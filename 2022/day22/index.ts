import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

type Direction = 'left' | 'right' | 'up' | 'down';
const cubeSize = 50;

const [rawField, rawPath] = input.split('\n\n');
const rawRows = rawField.split('\n');
const rows = rawRows.map((line) => {
  const groups = line.match(/(?<pre>\s*)(?<row>[.|#]+)/).groups;
  return {
    start: groups.pre.length,
    data: groups.row.split('').map((val) => val === '.')
  };
});
const path = rawPath
  .match(/\d+|[R|L]/g)
  .map((instruction) =>
    instruction === 'R' || instruction === 'L'
      ? instruction
      : parseInt(instruction)
  );

const fieldWidth = Math.max(...rawRows.map((row) => row.length));
let cols = [];
for (let i = 0; i < fieldWidth; i++) {
  cols.push(rows.map(({ start, data }) => data[i - start]));
}
cols = cols.map((col) => {
  let start = Math.min(col.indexOf(true), col.indexOf(false));
  return {
    start: start >= 0 ? start : Math.max(col.indexOf(true), col.indexOf(false)),
    data: col.filter((val) => val !== undefined)
  };
});

const turns: Record<'L' | 'R', Record<Direction, Direction>> = {
  L: {
    left: 'down',
    right: 'up',
    up: 'left',
    down: 'right'
  },
  R: {
    left: 'up',
    right: 'down',
    up: 'right',
    down: 'left'
  }
};

function turn(currDir: Direction, turnDir: 'L' | 'R'): Direction {
  return turns[turnDir][currDir];
}

function getWallDistance(
  [x, y]: [number, number],
  direction: Direction
): number {
  const [{ start, data }, coord] =
    direction === 'up' || direction === 'down' ? [cols[x], y] : [rows[y], x];

  if (direction === 'right' || direction === 'down') {
    return [...data.slice(coord + 1 - start), ...data].indexOf(false);
  }
  return [...data, ...data.slice(0, coord - start)].reverse().indexOf(false);
}

function shiftCoord(
  coord: number,
  distance: number,
  start: number,
  maxBounds: number
): number {
  return (
    start + ((((coord - start + distance) % maxBounds) + maxBounds) % maxBounds)
  );
}

function walk(
  [x, y]: [number, number],
  direction: Direction,
  distance: number
): [number, number] {
  const wallDistance = getWallDistance([x, y], direction);
  if (wallDistance >= 0) {
    distance = Math.min(wallDistance, distance);
  }
  const factor = direction === 'up' || direction === 'left' ? -1 : 1;
  const { start, data } =
    direction === 'up' || direction === 'down' ? cols[x] : rows[y];
  return direction === 'up' || direction === 'down'
    ? [x, shiftCoord(y, factor * distance, start, data.length)]
    : [shiftCoord(x, factor * distance, start, data.length), y];
}

const sides = {
  a: [cubeSize, 0],
  b: [2 * cubeSize, 0],
  c: [cubeSize, cubeSize],
  d: [0, 2 * cubeSize],
  e: [cubeSize, 2 * cubeSize],
  f: [0, 3 * cubeSize]
};

function getSide([x, y]: [number, number]): string {
  return Object.entries(sides).find(
    ([_, pos]) =>
      x >= pos[0] &&
      x < pos[0] + cubeSize &&
      y >= pos[1] &&
      y < pos[1] + cubeSize
  )[0];
}

const connections: Record<
  string,
  Record<
    Direction,
    (pos: [number, number]) => { pos: [number, number]; dir: Direction }
  >
> = {
  a: {
    right: (pos) => ({ pos, dir: 'right' }),
    down: (pos) => ({ pos, dir: 'down' }),
    left: (pos) => ({
      pos: shift(rotate(relativePos(pos), 2), [-1, 2]),
      dir: 'right'
    }),
    up: (pos) => ({
      pos: shift(rotate(relativePos(pos)), [-1, 3]),
      dir: 'right'
    })
  },
  b: {
    right: (pos) => ({
      pos: shift(rotate(relativePos(pos), 2), [2, 2]),
      dir: 'left'
    }),
    down: (pos) => ({
      pos: shift(rotate(relativePos(pos)), [2, 1]),
      dir: 'left'
    }),
    left: (pos) => ({ pos, dir: 'left' }),
    up: (pos) => ({ pos: shift(relativePos(pos), [0, 4]), dir: 'up' })
  },
  c: {
    right: (pos) => ({
      pos: shift(rotate(relativePos(pos), 3), [2, 1]),
      dir: 'up'
    }),
    down: (pos) => ({ pos, dir: 'down' }),
    left: (pos) => ({
      pos: shift(rotate(relativePos(pos), 3), [0, 1]),
      dir: 'down'
    }),
    up: (pos) => ({ pos, dir: 'up' })
  },
  d: {
    right: (pos) => ({ pos, dir: 'right' }),
    down: (pos) => ({ pos, dir: 'down' }),
    left: (pos) => ({ pos: rotate(relativePos(pos), 2), dir: 'right' }),
    up: (pos) => ({
      pos: shift(rotate(relativePos(pos)), [0, 1]),
      dir: 'right'
    })
  },
  e: {
    right: (pos) => ({
      pos: shift(rotate(relativePos(pos), 2), [3, 0]),
      dir: 'left'
    }),
    down: (pos) => ({
      pos: shift(rotate(relativePos(pos)), [1, 3]),
      dir: 'left'
    }),
    left: (pos) => ({ pos, dir: 'left' }),
    up: (pos) => ({ pos, dir: 'up' })
  },
  f: {
    right: (pos) => ({
      pos: shift(rotate(relativePos(pos), 3), [1, 3]),
      dir: 'up'
    }),
    down: (pos) => ({ pos: shift(relativePos(pos), [2, -1]), dir: 'down' }),
    left: (pos) => ({
      pos: shift(rotate(relativePos(pos), 3), [1, -1]),
      dir: 'down'
    }),
    up: (pos) => ({ pos, dir: 'up' })
  }
};

function getEdgeDistance(
  [x, y]: [number, number],
  direction: Direction
): number {
  const coord = direction === 'up' || direction === 'down' ? y : x;
  const rest = coord % cubeSize;
  return direction === 'up' || direction === 'left'
    ? rest
    : cubeSize - rest - 1;
}

function isWall([x, y]: [number, number]): boolean {
  const start = rows[y]?.start || 0;
  return rows[y]?.data?.[x - start] === false;
}

function isAtEdge([x, y]: [number, number], dir: Direction): boolean {
  if (dir === 'right') {
    return x % cubeSize === cubeSize - 1;
  }
  if (dir === 'left') {
    return x % cubeSize === 0;
  }
  if (dir === 'up') {
    return y % cubeSize === 0;
  }
  if (dir === 'down') {
    return y % cubeSize === cubeSize - 1;
  }
}

function relativePos([x, y]: [number, number]): [number, number] {
  return [x % cubeSize, y % cubeSize];
}

function rotate([x, y]: [number, number], times = 1): [number, number] {
  const pos: [number, number] =
    y === 0 || y === cubeSize - 1
      ? [Math.abs(y - (cubeSize - 1)), x]
      : [cubeSize - 1 - y, x];
  return times > 1 ? rotate(pos, --times) : pos;
}

function shift(
  [x, y]: [number, number],
  [xFactor, yFactor]: [number, number]
): [number, number] {
  return [x + xFactor * cubeSize, y + yFactor * cubeSize];
}

function step([x, y]: [number, number], dir: Direction): [number, number] {
  const factor = dir === 'up' || dir === 'left' ? -1 : 1;
  return dir === 'up' || dir === 'down' ? [x, y + factor] : [x + factor, y];
}

function walk3D(
  pos: [number, number],
  dir: Direction,
  distance: number
): { pos: [number, number]; dir: Direction } {
  let currDistance = 0;
  while (distance) {
    if (!isAtEdge(pos, dir)) {
      const edgeDistance = getEdgeDistance(pos, dir);
      currDistance = distance > edgeDistance ? edgeDistance : distance;
      distance -= currDistance;
      pos = walk(pos, dir, currDistance);
      if (!isAtEdge(pos, dir) || !distance) {
        return { pos, dir };
      }
    }

    const { pos: newPos, dir: newDir } = connections[getSide(pos)][dir](pos);
    if (isWall(step(newPos, newDir))) {
      return { pos, dir };
    }
    dir = newDir;
    pos = step(newPos, newDir);
    distance--;
  }
  return { pos, dir };
}

const facing = {
  left: 2,
  right: 0,
  up: 3,
  down: 1
};

function getPassword([x, y]: [number, number], direction: Direction) {
  return 1000 * y + 4 * x + facing[direction];
}

function task1() {
  let pos: [number, number] = [rows[0].start, 0];
  let dir: Direction = 'right';
  for (let instruction of path) {
    if (instruction === 'R' || instruction === 'L') {
      dir = turn(dir, instruction);
    } else {
      pos = walk(pos, dir, instruction);
    }
  }
  const [x, y] = pos;
  return getPassword([x + 1, y + 1], dir);
}

function task2() {
  let pos: [number, number] = [rows[0].start, 0];
  let dir: Direction = 'right';
  for (let instruction of path) {
    if (instruction === 'R' || instruction === 'L') {
      dir = turn(dir, instruction);
    } else {
      const posDir = walk3D(pos, dir, instruction);
      pos = posDir.pos;
      dir = posDir.dir;
      console.log(pos);
    }
  }
  const [x, y] = pos;
  return getPassword([x + 1, y + 1], dir);
}

// console.log(task1());
console.log(task2());
