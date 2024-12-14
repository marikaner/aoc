import { readInput } from '../read-input.js';
import { product } from '../util.js';

const input = await readInput(import.meta.url);

const robots = input.split('\n').map((line) => {
  const [px, py, vx, vy] = [...line.matchAll(/(-*\d+)/g)].map(([num]) =>
    parseInt(num)
  );
  return { px, py, vx, vy };
});

type Pos = { px: number; py: number };
type Vel = { vx: number; vy: number };
type Size = { width: number; height: number };

function move(robots: (Pos & Vel)[], { width, height }: Size, seconds = 1) {
  return robots
    .map(({ px, py, vx, vy }) => ({
      px,
      py,
      vx: (vx + Math.ceil(Math.abs(vx / width)) * width) % width,
      vy: (vy + Math.ceil(Math.abs(vy / height)) * height) % height
    }))
    .map(({ px, py, vx, vy }) => ({
      px: (px + vx * seconds) % width,
      py: (py + vy * seconds) % height
    }));
}

function getQuadrants(robots: Pos[], { width, height }: Size) {
  const quadrantWidth = (width - 1) / 2;
  const quadrantHeight = (height - 1) / 2;

  const q1 = robots.filter(
    ({ px, py }) => px < quadrantWidth && py < quadrantHeight
  );
  const q2 = robots.filter(
    ({ px, py }) => px > quadrantWidth && py < quadrantHeight
  );
  const q3 = robots.filter(
    ({ px, py }) => px < quadrantWidth && py > quadrantHeight
  );
  const q4 = robots.filter(
    ({ px, py }) => px > quadrantWidth && py > quadrantHeight
  );

  return { q1, q2, q3, q4 };
}

const size = { width: 101, height: 103 };

function part1() {
  const robotPos = move(robots, size, 100);
  const quadrants = getQuadrants(robotPos, size);
  return product(Object.values(quadrants).map((q) => q.length));
}

function makeGrid(robots: Pos[], { width, height }: Size) {
  const grid = Array.from({ length: height }, () => {
    return Array.from({ length: width }, () => '.');
  });

  robots.forEach(({ px, py }) => {
    grid[py][px] = '#';
  });

  return grid.map((row) => row.join('')).join('\n');
}

function part2() {
  for (let i = 0; true; i++) {
    const grid = makeGrid(move(robots, size, i), size);
    if (grid.includes('##########')) {
      // console.log(grid);
      return i;
    }
  }
}

console.log(part1());
console.log(part2());
