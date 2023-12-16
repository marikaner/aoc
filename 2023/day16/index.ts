import { readInput } from '../read-input.js';
import { memoize } from '../util.js';

const input = await readInput(import.meta.url);

const baseGrid = input
  .split('\n')
  .map((line) => line.split('').map((element) => ({ element, beams: [] })));

interface Pos {
  x: number;
  y: number;
}

interface Beam extends Pos {
  dir: Dir;
}

type Dir = 'N' | 'E' | 'S' | 'W';

const getNextPos = memoize(
  function ({ y, x, dir }: Beam) {
    if (dir === 'N') {
      return { y: y - 1, x };
    }
    if (dir === 'S') {
      return { y: y + 1, x };
    }
    if (dir === 'E') {
      return { y, x: x + 1 };
    }
    if (dir === 'W') {
      return { y, x: x - 1 };
    }
  },
  ({ x, y, dir }) => [x, y, dir].join(':')
);

const getNextDirs = memoize(
  function ({ y, x, dir }: Beam): Dir[] {
    const { element } = baseGrid[y][x];

    if (dir === 'N') {
      if (element === '/') {
        return ['E'];
      }
      if (element === '\\') {
        return ['W'];
      }
      if (element === '-') {
        return ['E', 'W'];
      }
    }
    if (dir === 'S') {
      if (element === '/') {
        return ['W'];
      }
      if (element === '\\') {
        return ['E'];
      }
      if (element === '-') {
        return ['E', 'W'];
      }
    }
    if (dir === 'E') {
      if (element === '/') {
        return ['N'];
      }
      if (element === '\\') {
        return ['S'];
      }
      if (element === '|') {
        return ['N', 'S'];
      }
    }
    if (dir === 'W') {
      if (element === '/') {
        return ['S'];
      }
      if (element === '\\') {
        return ['N'];
      }
      if (element === '|') {
        return ['N', 'S'];
      }
    }
    return [dir];
  },
  ({ x, y, dir }) => [x, y, dir].join(':')
);

const getNextBeams = memoize(
  function (beam: Beam) {
    const dirs = getNextDirs(beam);
    return dirs
      .map((dir) => ({ ...getNextPos({ ...beam, dir }), dir }))
      .filter(
        ({ x, y }) =>
          x >= 0 && x < baseGrid.length && y >= 0 && y < baseGrid.length
      );
  },
  ({ x, y, dir }) => [x, y, dir].join(':')
);

function step(beams: Beam[], grid) {
  return beams.flatMap((beam) => {
    const gridElement = grid[beam.y][beam.x];
    if (gridElement.beams.includes(beam.dir)) {
      return [];
    }
    gridElement.beams.push(beam.dir);
    return getNextBeams(beam);
  });
}

function copyGrid() {
  return baseGrid.map((row) =>
    row.map(({ element }) => ({ element, beams: [] }))
  );
}

function calculateEnergy(beam: Beam) {
  let beams: Beam[] = [beam];
  const grid = copyGrid();
  while (beams.length) {
    beams = step(beams, grid);
  }
  return grid.flatMap((row) => row.filter(({ beams }) => beams.length)).length;
}

function part1() {
  return calculateEnergy({ y: 0, x: 0, dir: 'E' as const });
}

function part2() {
  const startPoints = baseGrid.flatMap((row, i) => [
    { y: i, x: 0, dir: 'E' as const },
    { y: i, x: baseGrid.length - 1, dir: 'W' as const },
    { x: i, y: 0, dir: 'S' as const },
    { x: i, y: baseGrid.length - 1, dir: 'N' as const }
  ]);

  return Math.max(...startPoints.map((beam) => calculateEnergy(beam)));
}

// console.log(part1());
// print();
console.log(part2());
