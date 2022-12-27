import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const positions = {};
const elves = [];
input.split('\n').forEach((line, row) =>
  line.split('').forEach((val, col) => {
    if (val === '#') {
      positions[row] = positions[row] ?? {};
      positions[row][col] = positions[row][col] ?? {};
      positions[row][col] = true;
      elves.push([col, row]);
    }
  })
);

const directions = ['N', 'S', 'W', 'E'];

function getNeighbors([x, y]) {
  const n = [x, y - 1];
  const nw = [x - 1, y - 1];
  const ne = [x + 1, y - 1];
  const s = [x, y + 1];
  const sw = [x - 1, y + 1];
  const se = [x + 1, y + 1];
  const w = [x - 1, y];
  const e = [x + 1, y];
  return { n, nw, ne, s, sw, se, w, e };
}

function findNeighborsInDirection({ n, nw, ne, s, sw, se, w, e }, direction) {
  if (direction === 'N') {
    return [n, nw, ne];
  }
  if (direction === 'S') {
    return [s, sw, se];
  }
  if (direction === 'W') {
    return [w, nw, sw];
  }
  return [e, ne, se];
}

type Proposal = Record<number, Record<number, number[]>>;

function findProposableNeighbor(pos, direction) {
  const neighbors = getNeighbors(pos);
  if (Object.values(neighbors).some(([x, y]) => positions[y]?.[x])) {
    for (let i = 0; i < 4; i++) {
      const currNeighbors = findNeighborsInDirection(
        neighbors,
        directions[(direction + i) % 4]
      );
      if (currNeighbors.every(([x, y]) => !positions[y]?.[x])) {
        return currNeighbors[0];
      }
    }
  }
}

function propose(direction: number): Proposal {
  return elves.reduce((proposed, currPos, i) => {
    const proposal = findProposableNeighbor(currPos, direction);
    if (proposal) {
      const [x, y] = proposal;
      proposed[y] = proposed[y] ?? {};
      proposed[y][x] = proposed[y][x] ?? [];
      proposed[y][x].push(i);
    }
    return proposed;
  }, {});
}

function move(proposal: Proposal) {
  Object.entries(proposal).forEach(([yStr, row]) => {
    Object.entries(row).forEach(([xStr, [i, ...multipleProposals]]) => {
      if (!multipleProposals.length) {
        const [oldX, oldY] = elves[i];
        positions[oldY][oldX] = false;
        const x = parseInt(xStr);
        const y = parseInt(yStr);
        positions[y] = positions[y] ?? {};
        positions[y][x] = positions[y][x] ?? {};
        positions[y][x] = true;
        elves[i] = [x, y];
      }
    });
  });
}

function calcGround(): number {
  const minX = Math.min(...elves.map(([x]) => x));
  const maxX = Math.max(...elves.map(([x]) => x));
  const minY = Math.min(...elves.map(([, y]) => y));
  const maxY = Math.max(...elves.map(([, y]) => y));
  const xDist = maxX - minX + 1;
  const yDist = maxY - minY + 1;
  return xDist * yDist - elves.length;
}

function disperse(limit = Number.POSITIVE_INFINITY): number {
  let currDirection = 0;
  let rounds = 0;
  while (rounds < limit) {
    const proposals = propose(currDirection % 4);
    if (!Object.keys(proposals).length) {
      return rounds + 1;
    }
    move(proposals);
    currDirection++;
    rounds++;
  }
}

function task1() {
  disperse(10);
  return calcGround();
}

function task2() {
  return disperse();
}

// side effects
// console.log(task1());
console.log(task2());
