import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

type Pos = [number, number];

const heightMap = input
  .split('\n')
  .map((line) => line.split('').map((val) => val.charCodeAt(0)));
const start = findLetter('S');
const end = findLetter('E');
const a = 'a'.charCodeAt(0);
heightMap[start[0]][start[1]] = a;
heightMap[end[0]][end[1]] = 'z'.charCodeAt(0);

const visited = heightMap.map((row) => row.map(() => Number.MAX_SAFE_INTEGER));

function findLetter(letter: string): Pos {
  const charCode = letter.charCodeAt(0);
  for (let rowI = 0; rowI < heightMap.length; rowI++) {
    const row = heightMap[rowI];
    const colI = row.findIndex((val) => val === charCode);
    if (colI !== -1) {
      return [rowI, colI];
    }
  }
}

function getValue([x, y]: Pos): number | undefined {
  return heightMap[x]?.[y];
}

function isLowPoint(pos: Pos) {
  return getValue(pos) === a;
}

function getVisited([x, y]: Pos): number {
  return visited[x][y];
}

function setVisited([x, y]: Pos, distance): void {
  visited[x][y] = distance;
}

function canStep(from: Pos, to: Pos): boolean {
  const fromVal = getValue(from);
  const toVal = getValue(to);

  return toVal ? fromVal - toVal < 2 : false;
}

function shouldStep(to: Pos, distance: number): boolean {
  return distance + 1 < getVisited(to);
}

function hike(from: Pos, isEnd: (pos: Pos) => boolean): void {
  function hikeDown(from: Pos, distance = 0): void {
    setVisited(from, distance);
    if (!isEnd(from)) {
      const [x, y] = from;
      const top: Pos = [x, y - 1];
      const right: Pos = [x + 1, y];
      const bottom: Pos = [x, y + 1];
      const left: Pos = [x - 1, y];

      if (canStep(from, top) && shouldStep(top, distance)) {
        hikeDown(top, distance + 1);
      }
      if (canStep(from, right) && shouldStep(right, distance)) {
        hikeDown(right, distance + 1);
      }
      if (canStep(from, bottom) && shouldStep(bottom, distance)) {
        hikeDown(bottom, distance + 1);
      }
      if (canStep(from, left) && shouldStep(left, distance)) {
        hikeDown(left, distance + 1);
      }
    }
  }
  hikeDown(from);
}

function task1() {
  hike(end, ([x, y]: Pos) => x === start[0] && y === start[1]);
  return getVisited(start);
}

function task2() {
  hike(end, (pos: Pos) => isLowPoint(pos));

  return Math.min(
    ...heightMap.flatMap((row, x) =>
      row
        .map((_, y) => [x, y])
        .filter((pos: Pos) => isLowPoint(pos))
        .map((pos: Pos) => getVisited(pos))
    )
  );
}

// note: side effects
// console.log(task1());
console.log(task2());
