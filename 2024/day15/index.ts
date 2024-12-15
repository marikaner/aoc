import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

const [rawMap, rawMovements] = input.split('\n\n');
let map = rawMap.split('\n').map((line) => line.split(''));
const movements = rawMovements.split('').filter((m) => m !== '\n') as Dir[];

type Dir = '^' | '>' | 'v' | '<';
type Pos = { x: number; y: number };
type BigBoxPos = [Pos, Pos];

function getNextPos(pos: Pos, dir: Dir, factor = 1) {
  switch (dir) {
    case '^':
      return { x: pos.x, y: pos.y - 1 * factor };
    case '>':
      return { x: pos.x + 1 * factor, y: pos.y };
    case 'v':
      return { x: pos.x, y: pos.y + 1 * factor };
    case '<':
      return { x: pos.x - 1 * factor, y: pos.y };
  }
}

function move(pos: Pos, dir: Dir) {
  const item = map[pos.y][pos.x];
  const nextPos = getNextPos(pos, dir);
  const nextItem = map[nextPos.y][nextPos.x];
  if (nextItem === '#') {
    return pos;
  }
  if (nextItem === '.') {
    map[nextPos.y][nextPos.x] = item;
    map[pos.y][pos.x] = '.';
    return nextPos;
  }
  if (nextItem === 'O') {
    move(nextPos, dir);
  } else if (['<', '>'].includes(dir)) {
    moveBigBoxH(nextPos, dir);
  } else if (nextItem === '[') {
    if (canMoveBigBoxesV([[nextPos, getNextPos(nextPos, '>')]], dir)) {
      moveBigBoxesV([[nextPos, getNextPos(nextPos, '>')]], dir);
    }
  } else if (nextItem === ']') {
    if (canMoveBigBoxesV([[getNextPos(nextPos, '<'), nextPos]], dir)) {
      moveBigBoxesV([[getNextPos(nextPos, '<'), nextPos]], dir);
    }
  }
  return map[nextPos.y][nextPos.x] === nextItem ? pos : move(pos, dir);
}

function moveBigBoxesV(boxes: BigBoxPos[], dir: Dir) {
  return boxes.forEach(([left, right]) => {
    const [nextPosLeft, nextPosRight] = [
      getNextPos(left, dir),
      getNextPos(right, dir)
    ];

    const [nextItemLeft, nextItemRight] = [
      map[nextPosLeft.y][nextPosLeft.x],
      map[nextPosRight.y][nextPosRight.x]
    ];

    if (nextItemLeft === '#' || nextItemRight === '#') {
      return;
    }
    if (nextItemLeft === '.' && nextItemRight === '.') {
      map[nextPosLeft.y][nextPosLeft.x] = '[';
      map[nextPosRight.y][nextPosRight.x] = ']';
      map[left.y][left.x] = '.';
      map[right.y][right.x] = '.';
      return;
    }
    if (nextItemLeft === '[') {
      moveBigBoxesV([[nextPosLeft, nextPosRight]], dir);
    } else {
      const nextBoxPos: [Pos, Pos][] = [
        [getNextPos(nextPosLeft, '<'), nextPosLeft],
        [nextPosRight, getNextPos(nextPosRight, '>')]
      ];
      if (nextItemLeft === ']' && nextItemRight === '[') {
        moveBigBoxesV(nextBoxPos, dir);
      } else if (nextItemLeft === ']') {
        moveBigBoxesV([nextBoxPos[0]], dir);
      } else if (nextItemRight === '[') {
        moveBigBoxesV([nextBoxPos[1]], dir);
      }
    }
    return moveBigBoxesV([[left, right]], dir);
  });
}

function canMoveBigBoxesV(boxes: BigBoxPos[], dir: Dir): boolean {
  return boxes.every(([left, right]) => {
    const [nextPosLeft, nextPosRight] = [
      getNextPos(left, dir),
      getNextPos(right, dir)
    ];

    const [nextItemLeft, nextItemRight] = [
      map[nextPosLeft.y][nextPosLeft.x],
      map[nextPosRight.y][nextPosRight.x]
    ];

    if (nextItemLeft === '#' || nextItemRight === '#') {
      return false;
    }
    if (nextItemLeft === '.' && nextItemRight === '.') {
      return true;
    }
    if (nextItemLeft === '[') {
      return canMoveBigBoxesV([[nextPosLeft, nextPosRight]], dir);
    }

    const nextBoxPos: [Pos, Pos][] = [
      [getNextPos(nextPosLeft, '<'), nextPosLeft],
      [nextPosRight, getNextPos(nextPosRight, '>')]
    ];
    if (nextItemLeft === ']' && nextItemRight === '[') {
      return canMoveBigBoxesV(nextBoxPos, dir);
    }
    if (nextItemLeft === ']') {
      return canMoveBigBoxesV([nextBoxPos[0]], dir);
    }
    if (nextItemRight === '[') {
      return canMoveBigBoxesV([nextBoxPos[1]], dir);
    }
  });
}

function moveBigBoxH(partialBigBoxPos: Pos, dir: Dir) {
  const otherBigBoxPos = getNextPos(partialBigBoxPos, dir);
  const otherBigBoxItem = map[otherBigBoxPos.y][otherBigBoxPos.x];

  move(otherBigBoxPos, dir);
  if (map[otherBigBoxPos.y][otherBigBoxPos.x] !== otherBigBoxItem) {
    move(partialBigBoxPos, dir);
  }
}

function part1() {
  const startY = map.findIndex((line) => line.includes('@'));
  const startX = map[startY].findIndex((cell) => cell === '@');
  let pos = { x: startX, y: startY };
  movements.forEach((dir) => {
    pos = move(pos, dir);
  });

  return sum(
    map.flatMap((line, y) =>
      line.map((item, x) => (['O', '['].includes(item) ? 100 * y + x : 0))
    )
  );
}

function part2() {
  map = rawMap.split('\n').map((line) =>
    line.split('').flatMap((item) => {
      switch (item) {
        case '#':
          return ['#', '#'];
        case 'O':
          return ['[', ']'];
        case '.':
          return ['.', '.'];
        case '@':
          return ['@', '.'];
      }
    })
  );

  return part1();
}

console.log(part1());
console.log(part2());
