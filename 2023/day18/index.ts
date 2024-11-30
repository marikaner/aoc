import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

let instructions = input.split('\n').map((line) => {
  const [dir, steps] = line.split(' ');
  return { dir, steps: parseInt(steps) };
});

// const dirMapping = {
//   0: 'R',
//   1: 'D',
//   2: 'L',
//   3: 'U'
// };

// instructions = input.split('\n').map((line) => {
//   let [_, __, color] = line.split(' ');
//   color = color.slice(2, 8);
//   const steps = parseInt(color.slice(0, 5), 16);
//   const dir = dirMapping[color.slice(5, 6)];
//   return { dir, steps };
// });

let loop = instructions.reduce(
  (loop, { dir, steps }, i) => {
    const prev = loop[i];
    if (dir === 'R') {
      loop.push({ x: prev.x + steps, y: prev.y });
    } else if (dir === 'L') {
      loop.push({ x: prev.x - steps, y: prev.y });
    } else if (dir === 'D') {
      loop.push({ x: prev.x, y: prev.y + steps });
    } else if (dir === 'U') {
      loop.push({ x: prev.x, y: prev.y - steps });
    }
    return loop;
  },
  [{ x: 0, y: 0 }]
);

const { xMax, yMax, xMin, yMin } = loop.reduce(
  ({ xMax, yMax, xMin, yMin }, { x, y }) => ({
    yMax: Math.max(yMax, y),
    xMax: Math.max(xMax, x),
    yMin: Math.min(yMin, y),
    xMin: Math.min(xMin, x)
  }),
  {
    xMax: Number.NEGATIVE_INFINITY,
    yMax: Number.NEGATIVE_INFINITY,
    xMin: Number.POSITIVE_INFINITY,
    yMin: Number.POSITIVE_INFINITY
  }
);

loop = loop.map(({ x, y }) => ({ x: x - xMin, y: y - yMin }));

const width = xMax - xMin + 1;
const height = yMax - yMin + 1;

// const templateRow = '.'.repeat(width).split('');
// const grid = '.'
//   .repeat(height)
//   .split('')
//   .map(() => [...templateRow]);

// grid[0][0] = '#';
// loop.reduce((prev, curr) => {
//   const yStep = prev.y < curr.y ? 1 : prev.y > curr.y ? -1 : 0;
//   const xStep = prev.x < curr.x ? 1 : prev.x > curr.x ? -1 : 0;
//   let y = prev.y;
//   let x = prev.x;
//   while (y !== curr.y) {
//     grid[y][x] = '#';
//     y += yStep;
//   }
//   while (x !== curr.x) {
//     grid[y][x] = '#';
//     x += xStep;
//   }
//   return curr;
// });

// const loopLength = sum(instructions.map(({ steps }) => steps));

// function count() {
//   let enclosedTiles = loopLength;
//   let onPipe = false;

//   for (let y = 0; y < height; y++) {
//     let inside = false;
//     for (let x = 0; x < width; x++) {
//       if (
//         grid[y][x] === '#' &&
//         grid[y + 1]?.[x] === '#' &&
//         grid[y - 1]?.[x] === '#'
//       ) {
//         inside = !inside;
//       } else if (
//         grid[y][x] === '#' &&
//         grid[y][x + 1] === '#' &&
//         grid[y + 1]?.[x] === '#'
//       ) {
//         onPipe = true;
//       } else if (
//         onPipe &&
//         grid[y][x] === '#' &&
//         grid[y][x - 1] === '#' &&
//         grid[y + 1]?.[x] === '#'
//       ) {
//         onPipe = false;
//       } else if (
//         onPipe &&
//         grid[y][x] === '#' &&
//         grid[y][x - 1] === '#' &&
//         grid[y - 1]?.[x] === '#'
//       ) {
//         onPipe = false;
//         inside = !inside;
//       } else if (
//         grid[y][x] === '#' &&
//         grid[y][x + 1] === '#' &&
//         grid[y - 1]?.[x] === '#'
//       ) {
//         onPipe = true;
//         inside = !inside;
//       } else if (inside && !onPipe) {
//         enclosedTiles++;
//       }
//     }
//     // console.log(enclosedTiles);
//   }

//   return enclosedTiles;
// }

interface Pos {
  x: number;
  y: number;
}
interface Vector {
  from: Pos;
  to: Pos;
}

function mergeVectorLists(
  y: number,
  vectors1: Vector[],
  vectors2: Vector[]
): Vector[] {
  let i1 = 0;
  let i2 = 0;
  // let x = Math.min(vectors1[i1].from.x, vectors2[i2].from.x);

  const result = [];

  while (i1 < vectors1.length || i2 < vectors2.length) {
    let v1 = vectors1[i1];
    let v2 = vectors2[i2];
    let last = result[result.length - 1];

    if (v1 && v2) {
      if ((last || v1).from.x < v2.from.x) {
        result.push(v1);
        i1++;
      } else if (v2.from.x < v1.from.x) {
        result.push(v2);
        i2++;
      } else {
        const from = { x: v2.to.x };
        i2++;
        v2 = vectors2[i2];
        if (v2) {
          const to = { x: v2.from.x };
          result.push({ to, from });
          if (v1.to.x <= v2.to.x) {
            i1++;
          }
        } else {
          const to = { x: v1.to.x };
          result.push({ to, from });
          i1++;
        }
      }
    } else if (v2) {
      result.push(v2);
      i2++;
    }
  }
  return result.map(({ from, to }) => ({
    from: { x: from.x, y },
    to: { x: to.x, y }
  }));
}

function countVectors() {
  const vectors = loop.slice(1).map((to, i) => ({ to, from: loop[i] }));
  const hSortedByY = [...vectors]
    .filter(({ from, to }) => from.y === to.y)
    .map(({ from, to }) =>
      from.x > to.x ? { from: to, to: from } : { from, to }
    )
    .sort((a, b) => a.from.y - b.from.y || a.from.x - b.from.x);
  // const vSortedByY = [...vectors]
  //   .filter(({ from, to }) => from.x === to.x)
  //   .map(({ from, to }) =>
  //     from.y > to.y ? { from: to, to: from } : { from, to }
  //   )
  //   .sort((a, b) => a.from.y - b.from.y);
  let x = 0;
  let y = 0;
  let vI = 0;
  let hI = 0;
  let currHVectors = [];
  let nextHVectors = [];

  while (hSortedByY[hI].from.y === y) {
    nextHVectors.push(hSortedByY.shift());
  }

  let acc = 0;
  while (hSortedByY.length) {
    currHVectors = nextHVectors;
    nextHVectors = [];
    const nextY = hSortedByY[hI].from.y;
    currHVectors.forEach(({ from, to }) => {
      acc += (to.x - from.x) * (nextY - y);
    });
    y = nextY;
    while (hSortedByY[hI] && hSortedByY[hI].from.y === y) {
      nextHVectors.push(hSortedByY.shift());
    }
    nextHVectors = mergeVectorLists(y, currHVectors, nextHVectors);
  }
}

// function print() {
//   console.log(grid.map((row) => row.join('')).join('\n'));
// }

function part1() {
  // print();
  return countVectors();
  // return count();
}

function part2() {}

console.log(part1());
console.log(part2());
