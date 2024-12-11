import { readInput } from '../read-input.js';
import { sum, unique } from '../util.js';

const input = await readInput(import.meta.url);

const map = input
  .split('\n')
  .map((line, y) =>
    line.split('').map((height, x) => ({ height: parseInt(height), x, y }))
  );

const heads = map.flat().filter(({ height }) => !height);

type Pos = { x: number; y: number; height: number };

function getNeighbors(pos: Pos) {
  return [
    map[pos.y - 1]?.[pos.x],
    map[pos.y + 1]?.[pos.x],
    map[pos.y][pos.x - 1],
    map[pos.y][pos.x + 1]
  ].filter((p) => p);
}

function walk(pos: Pos): Pos[] {
  if (pos.height === 9) {
    return [pos];
  }

  return getNeighbors(pos)
    .filter(({ height }) => height === pos.height + 1)
    .flatMap((head) => walk(head));
}

function part1() {
  const scores = heads.map(
    (head) => unique(walk(head).map((top) => JSON.stringify(top))).length
  );
  return sum(scores);
}

function part2() {
  const ratings = heads.map((head) => walk(head).length);
  return sum(ratings);
}

console.log(part1());
console.log(part2());
