import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

interface Pos {
  x: number;
  y: number;
}

const directions = {
  '>': 'right',
  '<': 'left',
  '^': 'up',
  v: 'down'
};

const map: Record<string, Record<string, string>> = {};
const rawInput = input.split('\n').slice(1, -1);
rawInput.forEach((line, y) => {
  map[y] = {};
  line
    .split('')
    .slice(1, -1)
    .forEach((val, x) => {
      if (val !== '.') {
        map[y][x] = directions[val];
      }
    });
});

const height = Object.keys(map).length;
const width = rawInput[0].length - 2;
const startPos = { x: 0, y: -1 };
const endPos = { x: width - 1, y: height };

function getNextPositions({ x, y }, round) {
  const positions = [
    { x, y },
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 }
  ];
  return positions.filter(
    ({ x, y }) =>
      isValidPos({ x, y }) &&
      map[(((y - round) % height) + height) % height]?.[x] !== 'down' &&
      map[(((y + round) % height) + height) % height]?.[x] !== 'up' &&
      map[y]?.[(((x - round) % width) + width) % width] !== 'right' &&
      map[y]?.[(((x + round) % width) + width) % width] !== 'left'
  );
}

function toString({ x, y }) {
  return `${x},${y}`;
}

function getUniquePositions(positions): Pos[] {
  return positions.reduce(
    ({ str, res }, pos) => {
      const strPos = toString(pos);
      if (!str.includes(strPos)) {
        str.push(strPos);
        res.push(pos);
      }
      return { res, str };
    },
    { res: [], str: [] }
  ).res;
}

function isEndPos({ x, y }): boolean {
  return x === endPos.x && y === endPos.y;
}

function isStartPos({ x, y }): boolean {
  return x === startPos.x && y === startPos.y;
}

function isValidPos({ x, y }): boolean {
  return (
    (x >= 0 && x < width && y >= 0 && y < height) ||
    isStartPos({ x, y }) ||
    isEndPos({ x, y })
  );
}

function getDuration(
  fromPos: Pos = startPos,
  didArrive: (pos: Pos) => boolean = isEndPos,
  mins = 0
) {
  let positions: Pos[] = [{ ...fromPos }];
  while (true) {
    mins++;
    positions = getUniquePositions(
      positions.flatMap((pos) => getNextPositions(pos, mins))
    );

    if (positions.some((pos) => didArrive(pos))) {
      return mins;
    }
  }
}

function task1() {
  return getDuration();
}

function task2() {
  const toDuration = getDuration();
  const froDuration = getDuration(endPos, isStartPos, toDuration);
  return getDuration(startPos, isEndPos, froDuration);
}

console.log(task1());
console.log(task2());
