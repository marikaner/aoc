import { get } from 'http';
import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const wordSearch = input
  .split('\n')
  .map((line, y) => line.split('').map((char, x) => ({ x, y, char })));

type Point = { x: number; y: number; char: string };

function getNeighbors(p: Point) {
  return [
    { ...wordSearch[p.y - 1]?.[p.x - 1], xDiff: -1, yDiff: -1 },
    { ...wordSearch[p.y - 1]?.[p.x], xDiff: 0, yDiff: -1 },
    { ...wordSearch[p.y - 1]?.[p.x + 1], xDiff: 1, yDiff: -1 },
    { ...wordSearch[p.y]?.[p.x - 1], xDiff: -1, yDiff: 0 },
    { ...wordSearch[p.y]?.[p.x + 1], xDiff: 1, yDiff: 0 },
    { ...wordSearch[p.y + 1]?.[p.x - 1], xDiff: -1, yDiff: 1 },
    { ...wordSearch[p.y + 1]?.[p.x], xDiff: 0, yDiff: 1 },
    { ...wordSearch[p.y + 1]?.[p.x + 1], xDiff: 1, yDiff: 1 }
  ].filter((p) => p);
}

function getXNeighbors(p: Point) {
  return [
    wordSearch[p.y - 1]?.[p.x - 1],
    wordSearch[p.y - 1]?.[p.x + 1],
    wordSearch[p.y + 1]?.[p.x - 1],
    wordSearch[p.y + 1]?.[p.x + 1]
  ].filter((p) => p);
}

function findLetter<T extends Point>(letter: string, points: T[]) {
  return points.filter((p) => p?.char === letter);
}

function part1() {
  const x = findLetter('X', wordSearch.flat());
  const xm = x.map((p) => findLetter('M', getNeighbors(p))).flat();
  const xma = findLetter(
    'A',
    xm.map((p) => ({
      ...wordSearch[p.y + p.yDiff]?.[p.x + p.xDiff],
      xDiff: p.xDiff,
      yDiff: p.yDiff
    }))
  );
  const xmas = findLetter(
    'S',
    xma.map((p) => wordSearch[p.y + p.yDiff]?.[p.x + p.xDiff])
  );
  return xmas.length;
}

function part2() {
  const a = findLetter('A', wordSearch.flat());
  const xmas = a
    .map((p) => getXNeighbors(p))
    .filter((neighbors) =>
      ['MMSS', 'MSMS', 'SMSM', 'SSMM'].includes(
        neighbors.map(({ char }) => char).join('')
      )
    );

  return xmas.length;
}

console.log(part1());
console.log(part2());
