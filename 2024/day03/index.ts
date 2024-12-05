import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

function part1() {
  const multiplications = [...input.matchAll(/mul\((\d+),(\d+)\)/g)];
  return sum(
    multiplications.map(
      (multiplication) =>
        parseInt(multiplication[1]) * parseInt(multiplication[2])
    )
  );
}

function part2() {
  const cleanedInput = `do()${input}`
    .split("don't()")
    .map((part) => part.slice(part.indexOf('do()')))
    .join('');
  const multiplications = [...cleanedInput.matchAll(/mul\((\d+),(\d+)\)/g)];
  return sum(
    multiplications.map(
      (multiplication) =>
        parseInt(multiplication[1]) * parseInt(multiplication[2])
    )
  );
}

console.log(part1());
console.log(part2());
