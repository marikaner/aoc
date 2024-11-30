import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const map = input.split('\n').map((line) => line.split(''));
const visited = map.map((row) =>
  row.map(() => ({ visited: false, distance: Number.MIN_VALUE, path: [] }))
);
const height = map.length;
const width = map[0].length;
const start = { y: 0, x: map[0].findIndex((val) => val === '.') };
const end = {
  y: height - 1,
  x: map[height - 1].findIndex((val) => val === '.')
};

interface Pos {
  x: number;
  y: number;
}

function getUnfilteredNeighbors({ x, y }: Pos) {
  const value = map[y][x];
  if (value === '<') {
    return [{ x: x - 1, y }];
  }
  if (value === '>') {
    return [{ x: x + 1, y }];
  }
  if (value === '^') {
    return [{ x, y: y - 1 }];
  }
  if (value === 'v') {
    return [{ x, y: y + 1 }];
  }
  return [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 }
  ];
}

function getNeighbors({ x, y }: Pos) {
  return getUnfilteredNeighbors({ x, y }).filter(
    (pos) =>
      pos.x >= 0 &&
      pos.x < width &&
      pos.y >= 0 &&
      pos.y < height &&
      map[pos.y][pos.x] !== '#' &&
      !visited[pos.y][pos.x].visited
  );
}

function walk({ x, y }: Pos = start) {
  if (y === height - 1) {
    return; //visited[y][x].distance;
  }
  visited[y][x].visited = true;
  const neighbors = getNeighbors({ x, y });
  neighbors.forEach((neighbor) => {
    const maxDistance = Math.max(
      visited[neighbor.y][neighbor.x].distance,
      visited[y][x].distance + 1
    );

    if (visited[y][x].distance + 1 > visited[neighbor.y][neighbor.x].distance) {
      visited[neighbor.y][neighbor.x].path = [...visited[y][x].path, { x, y }];
    }

    visited[neighbor.y][neighbor.x].distance = maxDistance;
  });

  neighbors
    .sort((a, b) => visited[b.y][b.x].distance - visited[a.y][a.x].distance)
    .map((neighbor) => walk(neighbor));
}

function print() {
  const base = map.map((row) => [...row]);
  visited[end.y][end.x].path.forEach(({ x, y }) => {
    base[y][x] = 'O';
  });
  console.log(base.map((row) => row.join('')).join('\n'));
}

function part1() {
  walk();
  print();
  return visited[end.y][end.x].distance;
}

function part2() {}

console.log(part1());
console.log(part2());
