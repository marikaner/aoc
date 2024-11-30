import { readInput } from '../read-input.js';
import { memoize, rotate, sum } from '../util.js';

const input = await readInput(import.meta.url);

const baseDish = input.split('\n').map(
  (line) => line.split('')
  // .map((type, x) => (type === '.' ? undefined : { type, x, y }))
  // .filter((rock) => rock)
);

const rollingRocks = baseDish.flat().filter((type) => type === 'O').length;

// dish.flatMap((row, y) =>
//   row
//     .map((type, x) => (type === '0' ? { x, y } : undefined))
//     .filter((rock) => rock)
// );

//   .flat();

// const obstacles = { y: {}, x: {} };
// let rocks = [];
// dish.forEach(({ type, x, y }) => {
//   if (type === '#') {
//     obstacles.y[y] = [...(obstacles.y[y] || []), x];
//     obstacles.x[x] = [...(obstacles.x[x] || []), y];
//   } else {
//     rocks.push({ x, y });
//   }
// });

// function tilt() {
//   const rotatedRocks = rotate(rocks).map((row) =>
//     row.filter((char) => char !== '.')
//   );
//   const res = [];

//   for (let y = 0; y < rotatedRocks.length; y++) {
//     let blockedPos = rocks.length;
//     for (let x = rotatedRocks[y].length - 1; x >= 0; x--) {
//       const rock = rotatedRocks[y][x];
//       if (rock === 'O') {
//         res.push(blockedPos);
//         blockedPos--;
//       } else {
//         blockedPos = rocks.length - rock - 1;
//       }
//     }
//   }
//   console.log(res);
//   return sum(res);
// }

interface Pos {
  x: number;
  y: number;
}

type Direction = 'N' | 'E' | 'S' | 'W';

function print(dish) {
  console.log(dish.map((row) => row.join('')).join('\n'));
  console.log('\n');
}

function isStone({ x, y }: Pos, dish) {
  const type = dish[y][x];
  return type === '#' || type === 'O';
}

function rollStone(pos: Pos, direction: Direction, dish) {
  const { x, y } = pos;
  const newPos = { x, y };
  const axis = getAxis(direction);
  const { start, increase } = getChange(direction, dish);
  while (
    newPos[axis] !== start[axis] &&
    !isStone({ ...newPos, [axis]: newPos[axis] - increase[axis] }, dish)
  ) {
    newPos[axis] -= increase[axis];
  }
  dish[pos.y][pos.x] = '.';
  dish[newPos.y][newPos.x] = 'O';
}

// function getRelevantPartition({ x, y }: Pos, direction: Direction) {
//   if (direction === 'N') {
//     return dish
//       .slice(0, y)
//       .map((row) => row[x])
//       .join('');
//   }
//   if (direction === 'S') {
//     return dish
//       .slice(y, -1)
//       .map((row) => row[x])
//       .join('');
//   }
//   if (direction === 'W') {
//     return dish[y].slice(0, x).join('');
//   }
//   if (direction === 'E') {
//     return dish[y].slice(x, -1).join('');
//   }
// }

function getChange(direction: Direction, dish) {
  return direction === 'N' || direction === 'W'
    ? {
        increase: { x: 1, y: 1 },
        start: { x: 0, y: 0 },
        condition: {
          y: (y) => y < dish.length,
          x: (x) => x < dish[0].length
        }
      }
    : {
        increase: { x: -1, y: -1 },
        start: { x: dish[0].length - 1, y: dish.length - 1 },
        condition: {
          y: (y) => y >= 0,
          x: (x) => x >= 0
        }
      };
}

function getAxis(direction: Direction) {
  return direction === 'N' || direction === 'S' ? 'y' : 'x';
}

const tilt = //memoize(
  function (direction: Direction, dish) {
    let rocksToRoll = rollingRocks;

    const { increase, start, condition } = getChange(direction, dish);

    for (let y = start.y; condition.y(y) && rocksToRoll; y += increase.y) {
      for (let x = start.x; condition.x(x) && rocksToRoll; x += increase.x) {
        const type = dish[y][x];
        if (type === 'O') {
          rollStone({ x, y }, direction, dish);
        }
      }
    }
    return dish;
  };
//   (direction, dish) => [direction, dish].join(':')
// );

const cycle = memoize(
  function (dish, times = 1) {
    for (let i = 0; i < times; i++) {
      (['N', 'W', 'S', 'E'] as const).forEach((direction) =>
        tilt(direction, dish)
      );
    }
    return dish;
  },
  (dish, times) => [times, dish].join(':')
);

function getLoad(dish) {
  return sum(
    dish.flatMap((row, y) =>
      row.map((type) => (type === 'O' ? dish.length - y : 0))
    )
  );
}

function part1() {
  const dish = baseDish;
  tilt('N', dish);
  return getLoad(dish);
}

function part2() {
  const times = 1000;
  let dish = baseDish.map((row) => [...row]);
  for (let i = 0; i < 1000000000 / times; i++) {
    // console.log(i * times);
    dish = cycle(dish, times);
    // if (i % 2 === 1 || times === 2) {
    //   console.log(getLoad(dish));
    // }
  }

  return getLoad(dish);
}

// console.log(part1());
console.log(part2());
