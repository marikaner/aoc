import { readInput } from '../read-input.js';
import { sum, unique } from '../util.js';

const input = await readInput(import.meta.url);

const snapshot: Brick[] = input
  .split('\n')
  .map((line) => {
    const [lowerEnd, upperEnd] = line
      .split('~')
      .map((brickEnd) => {
        const [x, y, z] = brickEnd.split(',').map((num) => parseInt(num));
        return { x, y, z };
      })
      .sort((a, b) => a.z - b.z);
    return { lowerEnd, upperEnd, supports: [], supportedBy: [] };
  })
  .sort((a, b) => {
    return a.lowerEnd.z - b.lowerEnd.z || a.upperEnd.z - b.upperEnd.z;
  });

interface Pos {
  x: number;
  y: number;
  z: number;
}

interface Brick {
  lowerEnd: Pos;
  upperEnd: Pos;
  supports: number[];
  supportedBy: number[];
}

function intersects(brick1: Brick, brick2: Brick) {
  return (
    intersectsByDir(brick1, brick2, 'x') && intersectsByDir(brick1, brick2, 'y')
  );
}

function intersectsByDir(brick1: Brick, brick2: Brick, dir: string) {
  const brick1Min = Math.min(brick1.lowerEnd[dir], brick1.upperEnd[dir]);
  const brick1Max = Math.max(brick1.lowerEnd[dir], brick1.upperEnd[dir]);
  const brick2Min = Math.min(brick2.lowerEnd[dir], brick2.upperEnd[dir]);
  const brick2Max = Math.max(brick2.lowerEnd[dir], brick2.upperEnd[dir]);
  return !(brick2Max < brick1Min || brick2Min > brick1Max);
}

function getUnderlyingZ(brick: Brick, i: number) {
  return snapshot
    .slice(0, i)
    .reduce(
      (highest, curr) =>
        intersects(curr, brick) && curr.upperEnd.z > highest
          ? curr.upperEnd.z
          : highest,
      0
    );
}

function fall() {
  snapshot.forEach((brick, i) => {
    const underlyingZ = getUnderlyingZ(brick, i);
    findSupporters(brick, underlyingZ).forEach((supporter) => {
      brick.supportedBy.push(supporter);
      snapshot[supporter].supports.push(i);
    });
    const zShift = brick.lowerEnd.z - (underlyingZ + 1);
    brick.lowerEnd.z -= zShift;
    brick.upperEnd.z -= zShift;
  });
}

function findSupporters(brick: Brick, z: number) {
  return snapshot.reduce(
    (indices, otherBrick, i) =>
      otherBrick.upperEnd.z === z && intersects(brick, otherBrick)
        ? [...indices, i]
        : indices,
    []
  );
}

function wouldFall(brick: number, fallenBricks: number[] = []) {
  return snapshot[brick].supportedBy.every((supporterBrick) =>
    fallenBricks.includes(supporterBrick)
  );
}

function howManyWouldFall(
  fallingBricks: number[],
  fallenBricks: number[] = []
) {
  fallenBricks = [...fallenBricks, ...fallingBricks];

  const nextFallingBricks = unique(
    fallingBricks.flatMap((brick) =>
      snapshot[brick].supports.filter((otherBrick) =>
        wouldFall(otherBrick, fallenBricks)
      )
    )
  );

  return nextFallingBricks.length
    ? howManyWouldFall(nextFallingBricks, fallenBricks)
    : fallenBricks.length - 1;
}

fall();

function part1() {
  return snapshot.filter((brick, i) =>
    brick.supports.every((supportedBrickI) => !wouldFall(supportedBrickI, [i]))
  ).length;
}

function part2() {
  const supportingBricks: number[] = snapshot.reduce(
    (indices, { supports }, i) => (supports.length ? [...indices, i] : indices),
    []
  );

  return sum(supportingBricks.map((brick) => howManyWouldFall([brick])));
}

console.log(part1());
console.log(part2());
