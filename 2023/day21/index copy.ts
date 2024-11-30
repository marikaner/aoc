import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

const grid: GridElement[][] = input
  .split('\n')
  .map((line) => line.split('').map((value) => ({ value, visited: {} })));
const height = grid.length;
const width = grid[0].length;
const start = getStart();

interface GridElement {
  value: string;
  visited: Record<
    number,
    Record<
      number,
      {
        distance: number;
        finalPos: boolean;
      }
    >
  >;
}

interface Pos {
  x: number;
  y: number;
}

interface LocalPos {
  localPos: Pos;
  gridPos: Pos;
}

function getStart() {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x].value === 'S') {
        return { x, y };
      }
    }
  }
}

function getNeighbors({ x, y }: Pos) {
  const n = [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 }
  ];
  return n.filter(
    (pos) => {
      const { localPos } = getLocalPos(pos);
      return grid[localPos.y][localPos.x].value !== '#';
    }
    // pos.x >= 0 &&
    // pos.x < width &&
    // pos.y >= 0 &&
    // pos.y < height &&
    // pos.y >= 5 &&
    // !grid[pos.y][pos.x].visited
  );
}

function getLocalPos({ x, y }: Pos) {
  const localPos = {
    x: x % width,
    y: y % height
  };
  if (localPos.x < 0) {
    localPos.x += width;
  }
  if (localPos.y < 0) {
    localPos.y += height;
  }
  return {
    localPos,
    gridPos: {
      x: Math.floor(x / width),
      y: Math.floor(y / height)
    }
  };
}

function getDistance(gridElement: GridElement, { gridPos }: LocalPos) {
  return gridElement.visited[gridPos.y]?.[gridPos.x];
}

function setDistance(
  gridElement: GridElement,
  { gridPos }: LocalPos,
  distance: number
) {
  return (gridElement.visited[gridPos.y][gridPos.x].distance = distance);
}

function getGridElement({ localPos, gridPos }: LocalPos) {
  const gridElement = grid[localPos.y][localPos.x];
  if (!gridElement.visited[gridPos.y]) {
    gridElement.visited[gridPos.y] = {};
  }
  if (!gridElement.visited[gridPos.y][gridPos.x]) {
    gridElement.visited[gridPos.y][gridPos.x] = {
      distance: Number.MAX_VALUE,
      finalPos: false
    };
  }
  return gridElement;
}

function getVisitedState(gridElement: GridElement, { gridPos }: LocalPos) {
  return gridElement.visited[gridPos.y][gridPos.x];
}

// function shouldVisit(
//   gridElement: GridElement,
//   pos: LocalPos,
//   distance: number
// ) {
//   const currDistance = getDistance(gridElement, pos);
//   return currDistance === undefined || currDistance > distance;
// }

function makeSteps(globalPos: Pos, distance: number) {
  const pos = getLocalPos(globalPos);
  const gridElement = getGridElement(pos);
  const visitedState = getVisitedState(gridElement, pos);
  if (visitedState.distance > distance) {
    visitedState.distance = distance;
    if (!(distance % 2)) {
      visitedState.finalPos = true;
    }
    // 5,5 => 4,5 => 4,6 => 4,7 => 5,7 => 6,7 => 6,6
    return getNeighbors(globalPos);
    // .filter((neighbor) => {
    //   const { gridPos, localPos } = getLocalPos(neighbor);
    //   const currDistance =
    //     grid[localPos.y][localPos.x].visited[gridPos.y]?.[gridPos.x];
    //   return currDistance === undefined || currDistance > distance + 1;
    // });
  }
  return [];
}

function print() {
  console.log(
    grid
      .map((row) =>
        row
          .flatMap(({ visited: visitedY, value }) =>
            Object.values(visitedY).flatMap((visitedX) =>
              Object.values(visitedX).map(({ finalPos }) => finalPos)
            ).length
              ? 'O'
              : value
          )
          .join('')
      )
      .join('\n')
  );
}

function part1() {
  let positions = [start];
  let distance = 0;
  while (distance < 6) {
    // while (distance < 26501365) {
    positions = positions.flatMap((pos) => makeSteps(pos, distance));
    distance++;
  }
  print();
  const c = grid.flatMap((row) =>
    row.flatMap(({ visited: visitedY }) =>
      Object.values(visitedY).map(
        (visitedX) =>
          Object.values(visitedX).filter(({ finalPos }) => finalPos).length
      )
    )
  );
  // .filter(({ finalPos }) => finalPos);
  // const d = c.flatMap(({ visited }) =>
  //   Object.values(visited).map((visitedX) => Object.keys(visitedX).length)
  // );
  // console.log(c);
  return sum(c);
}

function part2() {}

console.log(part1());
console.log(part2());
