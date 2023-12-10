import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const pipes = input.split('\n').map((line) => line.split(''));
const height = pipes.length;
const width = pipes[0].length;

const dirMapping = {
  W: {
    '-': 'E',
    J: 'N',
    '7': 'S'
  },
  E: {
    '-': 'W',
    L: 'N',
    F: 'S'
  },
  N: {
    '|': 'S',
    J: 'W',
    L: 'E'
  },
  S: {
    '|': 'N',
    '7': 'W',
    F: 'E'
  }
};

const oppositeDirs = {
  W: 'E',
  E: 'W',
  N: 'S',
  S: 'N'
} as const;

interface Pos {
  row: number;
  col: number;
}

type Dir = 'W' | 'N' | 'E' | 'S';

interface Pipe {
  row: number;
  col: number;
  dir: Dir;
}

function getStart() {
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (pipes[row][col] === 'S') {
        for (let dir of ['W', 'N', 'E', 'S'] as const) {
          if (getDir(getNextPosition({ row, col, dir }), dir)) {
            return { row, col, dir };
          }
        }
      }
    }
  }
}

function getStartValue({ row, col }: Pos) {
  const dirs = (['W', 'N', 'E', 'S'] as const).filter((dir) =>
    getDir(getNextPosition({ row, col, dir }), dir)
  );

  return Object.entries(dirMapping[dirs[0]]).find(
    ([_, dir]) => dir === dirs[1]
  )[0];
}

function getNextPosition({ row, col, dir }: Pipe) {
  if (dir === 'W') {
    return { row, col: col - 1 };
  }
  if (dir === 'E') {
    return { row, col: col + 1 };
  }
  if (dir === 'N') {
    return { row: row - 1, col };
  }

  return { row: row + 1, col };
}

function getDir({ row, col }: Pos, fromDir: Dir) {
  const val = pipes[row][col];
  return dirMapping[oppositeDirs[fromDir]][val];
}

function getNextPipe(pipe: Pipe) {
  const pos = getNextPosition(pipe);
  const dir = getDir(pos, pipe.dir);
  return {
    ...pos,
    dir
  };
}

function getLoop() {
  const start = getStart();
  function isStart({ row, col }: Pos) {
    return row === start.row && col === start.col;
  }
  let curr = start;
  const loop = [start];
  while (!isStart((curr = getNextPipe(curr)))) {
    loop.push(curr);
  }
  return loop;
}

function getCleanPipes() {
  const loop = getLoop();
  const start = loop[0];

  const cleanPipes = [];
  for (let y = 0; y < height; y++) {
    cleanPipes.push([]);
    for (let x = 0; x < width; x++) {
      cleanPipes[y].push('.');
    }
  }

  loop.forEach(({ row, col }) => {
    cleanPipes[row][col] = pipes[row][col];
  });
  cleanPipes[start.row][start.col] = getStartValue(start);
  return cleanPipes;
}

function part1() {
  return getLoop().length / 2;
}

function part2() {
  let enclosedTiles = 0;
  let onPipe = false;
  const cleanPipes = getCleanPipes();

  for (let y = 0; y < height; y++) {
    let inside = false;
    for (let x = 0; x < width; x++) {
      if (cleanPipes[y][x] === '|') {
        inside = !inside;
      } else if (cleanPipes[y][x] === 'F') {
        onPipe = true;
      } else if (onPipe && cleanPipes[y][x] === '7') {
        onPipe = false;
      } else if (onPipe && cleanPipes[y][x] === 'J') {
        onPipe = false;
        inside = !inside;
      } else if (cleanPipes[y][x] === 'L') {
        onPipe = true;
        inside = !inside;
      } else if (inside && !onPipe) {
        enclosedTiles++;
      }
    }
  }

  return enclosedTiles;
}

console.log(part1());
console.log(part2());
