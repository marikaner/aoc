import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

const mirrors = input
  .split('\n\n')
  .map((mirror) => mirror.split('\n').map((row) => row.split('')));

function isReflection(
  mirror: string[][],
  y1: number,
  y2: number,
  allowedSmudges: number
) {
  let smudges = 0;
  for (let i = 0; i < mirror[y1].length; i++) {
    if (mirror[y1][i] !== mirror[y2][i]) {
      smudges++;
      if (smudges > allowedSmudges) {
        return { isReflection: false };
      }
    }
  }
  return {
    isReflection: true,
    smudges
  };
}

function findHorizontalReflection(mirror: string[][], allowedSmudges = 0) {
  for (let i = 1; i < mirror.length; i++) {
    let reflectionI = 0;
    let state: any = {};
    let remainingSmudges = allowedSmudges;
    while (
      (state = isReflection(
        mirror,
        i + reflectionI,
        i - reflectionI - 1,
        allowedSmudges
      )).isReflection
    ) {
      remainingSmudges -= state.smudges;
      if (i + reflectionI === mirror.length - 1 || i - reflectionI - 1 === 0) {
        if (remainingSmudges === 0) {
          return i;
        }
        break;
      }
      reflectionI++;
    }
  }
}

function rotate(mirror: string[][]) {
  const rotatedMirror = [];
  for (let x = 0; x < mirror[0].length; x++) {
    rotatedMirror.push(mirror.map((row) => row[x]));
  }
  return rotatedMirror;
}

function findVerticalReflection(mirror: string[][], allowedSmudges = 0) {
  return findHorizontalReflection(rotate(mirror), allowedSmudges);
}

function getReflectionSummary(allowedSmudges = 0) {
  return sum(
    mirrors.map(
      (mirror) =>
        (findHorizontalReflection(mirror, allowedSmudges) || 0) * 100 ||
        findVerticalReflection(mirror, allowedSmudges)
    )
  );
}

function part1() {
  return getReflectionSummary();
}

function part2() {
  return getReflectionSummary(1);
}

console.log(part1());
console.log(part2());
