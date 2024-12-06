import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const originalMap: Readonly<string[][]> = input
  .split('\n')
  .map((line) => line.split(''));
const startY = originalMap.findIndex((row) => row.includes('^'));
const startX = originalMap[startY].findIndex((x) => x === '^');

const directions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1]
] as const;

type Direction = (typeof directions)[number];

function copyMap() {
  return JSON.parse(JSON.stringify(originalMap));
}

function isWalkingInLoop(
  map: string[][],
  pos: [number, number],
  direction: Direction
) {
  return map[pos[0]]?.[pos[1]].includes(JSON.stringify(direction));
}

function isObstacle(map: string[][], pos: [number, number]) {
  return map[pos[0]]?.[pos[1]] === '#';
}

function hasExitGrid(map: string[][], pos: [number, number]) {
  return !map[pos[0]]?.[pos[1]];
}

function step(pos: [number, number], direction: Direction): [number, number] {
  return [pos[0] + direction[0], pos[1] + direction[1]];
}

function markDirection(
  map: string[][],
  pos: [number, number],
  direction: Direction
) {
  map[pos[0]][pos[1]] += JSON.stringify(direction);
}

type StopReason = 'obstacle' | 'exit' | 'loop';

function getStopReason(
  map: string[][],
  pos: [number, number],
  direction: Direction
): StopReason {
  if (isObstacle(map, pos)) {
    return 'obstacle';
  }
  if (hasExitGrid(map, pos)) {
    return 'exit';
  }
  if (isWalkingInLoop(map, pos, direction)) {
    return 'loop';
  }
}

function walkInDirection(
  map: string[][],
  direction: Direction,
  startPos: [number, number]
) {
  let currentPos = startPos;
  let newPos = currentPos;
  let stopReason: StopReason;
  while (!(stopReason = getStopReason(map, newPos, direction))) {
    currentPos = newPos;
    markDirection(map, currentPos, direction);
    newPos = step(currentPos, direction);
  }
  return { pos: currentPos, stopReason };
}

function rotate(direction: Direction) {
  const index = directions.findIndex(
    ([y, x]) => y === direction[0] && x === direction[1]
  );
  return directions[(index + 1) % 4];
}

function walkAround(map: string[][]): Omit<StopReason, 'obstacle'> {
  let pos: [number, number] = [startY, startX];
  let direction: Direction = directions[0];
  let stopReason: StopReason;
  while (!['loop', 'exit'].includes(stopReason)) {
    ({ pos, stopReason } = walkInDirection(map, direction, pos));
    direction = rotate(direction);
  }
  return stopReason;
}

function part1() {
  const map = copyMap();
  walkAround(map);

  return map.flat().filter((val) => !['.', '#'].includes(val)).length;
}

function part2() {
  const map = copyMap();
  walkAround(map);

  const potentialObstaclePositions = map
    .map((row, y) => row.map((val, x) => ({ x, y, val })))
    .flat()
    .filter((val) => !['.', '#'].includes(val));

  return potentialObstaclePositions.filter(({ x, y }) => {
    if (originalMap[y][x] === '.') {
      const map = copyMap();
      map[y][x] = '#';
      return walkAround(map) === 'loop';
    }
  }).length;
}

console.log(part1());
console.log(part2());
