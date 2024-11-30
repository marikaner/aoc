import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

const grid = input.split('\n').map((line) => line.split(''));
const visited = grid.map((row) => row.map(() => Number.MAX_SAFE_INTEGER));
const height = grid.length;
const width = grid[0].length;
const start = getStart();

interface Pos {
  x: number;
  y: number;
}

function getStart() {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 'S') {
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
    (pos) =>
      pos.x >= 0 &&
      pos.x < width &&
      pos.y >= 0 &&
      pos.y < height &&
      grid[pos.y][pos.x] !== '#'
  );
}

function walk({ x, y }: Pos, distance: number) {
  if (visited[y][x] > distance) {
    visited[y][x] = distance;
    return getNeighbors({ x, y });
  }
  return [];
}

function isEndPos(visitedDistance: number, stepGoal: number) {
  return visitedDistance % 2 === stepGoal % 2;
}

function print(stepGoal: number) {
  console.log(
    visited
      .map(
        (row, y) =>
          row
            .map(
              (visitedDistance, x) =>
                (isEndPos(visitedDistance, stepGoal) ? 'O' : grid[y][x]) +
                (x === 10 || x === 21 ? '|' : '')
            )
            .join('') + (y === 10 || y === 21 ? '\n' + '-'.repeat(35) : '')
      )
      .join('\n')
  );
}

function part1() {
  let positions = [start];
  const stepGoal = 12;
  for (let distance = 0; distance <= stepGoal; distance++) {
    positions = positions.flatMap((pos) => walk(pos, distance));
  }

  print(stepGoal);
  return sum(
    visited.map(
      (row) =>
        row.filter((visitedDistance) => isEndPos(visitedDistance, stepGoal))
          .length
    )
  );
}

function part2() {
  // S => TL
  // S => BL
  // S => TR
  // S => BR
  // BL => TR
  // TL => BR

}

console.log(part1());
console.log(part2());
