import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const map = input
  .split('\n')
  .map((line) => line.split('').map((char) => parseInt(char)));
const height = map.length;
const width = map[0].length;

interface Pos {
  x: number;
  y: number;
}

// type Direction = 'N' | 'S' | 'E' | 'W';

interface Path extends Pos {
  // heatLoss: number;
  pathWindows: PathWindow[];
  // visited: boolean;
}

interface PathWindow extends Pos {
  heatLoss: number;
  window: Pos[];
  visited: Record<number, Record<number, boolean>>;
}

// type PathPos = Path & Pos;

const visited: Path[][] = map.map((row, y) =>
  row.map((num, x) => ({
    // visited: false,
    // heatLoss: Number.MAX_SAFE_INTEGER,
    pathWindows: [],
    x,
    y
  }))
);

function isForbiddenOld(pathWindow: Pos[], { x, y }: Pos) {
  if (pathWindow.length >= 4) {
    const { x: x1, y: y1 } = pathWindow[pathWindow.length - 1];
    const { x: x2, y: y2 } = pathWindow[pathWindow.length - 2];
    const { x: x3, y: y3 } = pathWindow[pathWindow.length - 3];
    const { x: x4, y: y4 } = pathWindow[pathWindow.length - 4];
    return (
      (x1 === x && x2 === x && x3 === x && x4 === x) ||
      (y1 === y && y2 === y && y3 === y && y4 === y)
    );
  }
}

function isForbidden(pathWindow: Pos[]) {
  if (pathWindow.length >= 5) {
    const { x: x1, y: y1 } = pathWindow[pathWindow.length - 1];
    const { x: x2, y: y2 } = pathWindow[pathWindow.length - 2];
    const { x: x3, y: y3 } = pathWindow[pathWindow.length - 3];
    const { x: x4, y: y4 } = pathWindow[pathWindow.length - 4];
    const { x: x, y: y } = pathWindow[pathWindow.length - 5];
    return (
      (x1 === x && x2 === x && x3 === x && x4 === x) ||
      (y1 === y && y2 === y && y3 === y && y4 === y)
    );
  }
}

function getEligibleNeighbors({ x, y }: PathWindow) {
  return [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 }
  ].filter(
    ({ x, y }) => x >= 0 && y >= 0 && x < width && y < height //&& !visited[y][x].visited
  );
}

function limitedWalk(path: Path, times = 3, excludeNeighBors: Path[] = []) {
  if (!times) {
    return;
  }
  const neighbors = getEligibleNeighbors(path)
    .map(({ x, y }) => visited[y][x])
    .filter(({ x, y }) => excludeNeighBors.find((n) => n.x === x && n.y === y));

  neighbors.forEach((neighbor) => {
    const eligiblePaths = path.pathWindows.filter(
      ({ window }) => !isForbidden(window, neighbor)
    );
    neighbor.pathWindows.push(
      ...eligiblePaths.map((eligiblePath) => ({
        window: [...eligiblePath.window, { x: neighbor.x, y: neighbor.y }],
        heatLoss: eligiblePath.heatLoss + map[neighbor.y][neighbor.x]
      }))
    );

    neighbor.pathWindows = neighbor.pathWindows.reduce(
      (allWindows, currWindow) => {
        const existingWindow = allWindows.find(({ window }) =>
          window.every(
            (pos, i) => pos.x === currWindow[i].x && pos.y === currWindow[i].y
          )
        );
        if (existingWindow) {
          if (currWindow.heatLoss < existingWindow.heatLoss) {
            existingWindow.heatLoss = currWindow.heatLoss;
          }
        } else {
          allWindows.push(currWindow);
        }
        return allWindows;
      },
      [] as PathWindow[]
    );
  });

  neighbors.forEach((neighbor) => {
    limitedWalk(neighbor, times - 1, [...excludeNeighBors, path]);
  });
}

function copyVisited(visited: Record<number, Record<number, boolean>>) {
  return Object.entries(visited).reduce(
    (res, [key, value]) => ({ ...res, [key]: { ...value } }),
    {}
  );
}

function walk([pathWindow, ...nextPaths]: PathWindow[]) {
  // console.log(pathWindow);
  pathWindow.visited[pathWindow.y] = pathWindow.visited[pathWindow.y] || {};
  pathWindow.visited[pathWindow.y][pathWindow.x] = true;

  const neighbors = getEligibleNeighbors(pathWindow)
    .filter(({ x, y }) => !pathWindow.visited[y]?.[x])
    .map(({ x, y }) => ({
      x,
      y,
      window: [...pathWindow.window, { x, y }],
      heatLoss: pathWindow.heatLoss + map[y][x],
      visited: copyVisited(pathWindow.visited)
    }))
    .filter(({ window }) => !isForbidden(window));
  // .flatMap(({ x, y }) =>
  //   visited[y][x].pathWindows.filter(({ visited }) => !visited)
  // );

  neighbors.forEach((neighborWindow) => {
    // const eligiblePaths = pathWindow.filter(
    //   ({ window }) => !isForbidden(window, neighbor)
    // );

    // neighbor.pathWindows.push(
    //   ...eligiblePaths.map((eligiblePath) => ({
    //     window: [...eligiblePath.window, { x: neighbor.x, y: neighbor.y }],
    //     heatLoss: eligiblePath.heatLoss + map[neighbor.y][neighbor.x]
    //   }))
    // );

    visited[neighborWindow.y][neighborWindow.x].pathWindows = visited[
      neighborWindow.y
    ][neighborWindow.x].pathWindows.reduce((allWindows, currWindow) => {
      const existingWindow = allWindows.find(({ window }) =>
        window.every(
          (pos, i) =>
            currWindow[i] &&
            pos.x === currWindow[i].x &&
            pos.y === currWindow[i].y
        )
      );
      if (existingWindow) {
        if (currWindow.heatLoss < existingWindow.heatLoss) {
          existingWindow.heatLoss = currWindow.heatLoss;
        }
      } else {
        allWindows.push(currWindow);
      }
      return allWindows;
    }, [] as PathWindow[]);

    visited[neighborWindow.y][neighborWindow.x].pathWindows.forEach(
      ({ window }) => {
        if (window.length > 4) {
          window.shift();
        }
      }
    );
  });

  // visited[pathWindow.y][path.x].visited = true;

  return (
    [...nextPaths, ...neighbors]
      // .filter((p) => !p.visited)
      .sort((a, b) => a.heatLoss - b.heatLoss)
  );
}

function part1() {
  const start: PathWindow = {
    x: 0,
    y: 0,
    heatLoss: map[0][0],
    visited: {},
    window: [{ x: 0, y: 0 }]
  };

  // visited[0][0];
  // start.heatLoss = map[0][0];
  // start.pathWindows.push({ window: [{ x: 0, y: 0 }], heatLoss: map[0][0] });
  let nextPaths = [start];
  while (nextPaths.length) {
    nextPaths = walk(nextPaths);
  }
  // walk([start]);
  return visited[height - 1][width - 1];
}

function part2() {}

console.log(part1());
console.log(part2());
