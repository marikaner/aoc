import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

const multiplications = [...input.matchAll(/mul\((\d+),(\d+)\)/g)];
const dos = [...input.matchAll(/do\(\)/g)].map(({ index }) => index);
const donts = [...input.matchAll(/don't\(\)/g)].map(({ index }) => index);

function part1() {
  return sum(
    multiplications.map(
      (multiplication) =>
        parseInt(multiplication[1]) * parseInt(multiplication[2])
    )
  );
}

function part2() {
  let doI = 0;
  let dontI = 0;
  return multiplications.reduce((sum, multiplication) => {
    while (multiplication.index > donts[dontI]) {
      dontI++;
    }
    while (multiplication.index > dos[doI]) {
      doI++;
    }

    return (sum +=
      (dos[doI - 1] ?? -1) > (donts[dontI - 1] ?? -2)
        ? parseInt(multiplication[1]) * parseInt(multiplication[2])
        : 0);
  }, 0);
}

console.log(part1());
console.log(part2());
