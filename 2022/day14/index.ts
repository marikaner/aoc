import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

type Pos = [number, number];

const paths = input.split('\n').map((line) => {
  const points = line
    .split(' -> ')
    .map((point) => point.split(',').map((coord) => parseInt(coord)));
  return points.slice(1).map((point, i) => [points[i], point]);
});

const grid = {};
paths.flat().forEach(([[startX, startY], [endX, endY]]) => {
  if (startX > endX) {
    [startX, endX] = [endX, startX];
  }
  if (startY > endY) {
    [startY, endY] = [endY, startY];
  }
  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y <= endY; y++) {
      rest([x, y]);
    }
  }
});

const source: Pos = [500, 0];

const lowestY = Math.max(
  ...paths.flatMap((vectors) =>
    vectors.flatMap(([[_startX, startY], [_endX, endY]]) => [startY, endY])
  )
);

const floorY = lowestY + 2;

function isFilled([x, y]: Pos): boolean {
  return y === floorY || !!grid[x]?.[y];
}

function rest(pos: Pos): Pos {
  const [x, y] = pos;
  if (!grid[x]) {
    grid[x] = {};
  }

  grid[x][y] = true;
  return pos;
}

function isAbyss([_, y]: Pos): boolean {
  return y >= lowestY;
}

function isSource([_, y]: Pos): boolean {
  return !y;
}

function getNextPos([fromX, fromY]: Pos): Pos | undefined {
  const toY = fromY + 1;
  const toX = [fromX, fromX - 1, fromX + 1].find((x) => !isFilled([x, toY]));
  if (toX) {
    return [toX, toY];
  }
}

function dropSandWithAbyss(pos: Pos = source): Pos | undefined {
  const nextPos = getNextPos(pos);
  if (nextPos) {
    return isAbyss(nextPos) ? undefined : dropSandWithAbyss(nextPos);
  }
  return rest(pos);
}

function dropSandWithFloor(pos: Pos = source): Pos {
  const nextPos = getNextPos(pos);
  if (nextPos) {
    return dropSandWithFloor(nextPos);
  }
  return rest(pos);
}

function countUntil(action: () => any, stopCondition: (res) => boolean) {
  let count = 0;
  while (true) {
    const res = action();
    if (stopCondition(res)) {
      return count;
    }
    count++;
  }
}

function task1() {
  return countUntil(dropSandWithAbyss, (pos) => !pos);
}

function task2() {
  return countUntil(dropSandWithFloor, isSource) + 1;
}

// side effects
console.log(task1());
console.log(task2());
