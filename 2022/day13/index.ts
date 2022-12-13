import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const signals = input
  .split('\n\n')
  .map((chunk) => chunk.split('\n').map((line) => JSON.parse(line)));

function forceArray(val) {
  return Array.isArray(val) ? val : [val];
}

function compare([left, ...leftTail]: any, [right, ...rightTail]: any): number {
  if (left === undefined) {
    return right === undefined ? 0 : -1;
  }
  if (right === undefined) {
    return 1;
  }
  return (
    (typeof left === 'number' && typeof right === 'number'
      ? left - right
      : compare(forceArray(left), forceArray(right))) ||
    compare(leftTail, rightTail)
  );
}

function task1() {
  return signals
    .map(([left, right]) => compare(left, right))
    .map((x) => x < 0)
    .reduce((sum, correctOrder, i) => sum + (correctOrder ? i + 1 : 0), 0);
}

function task2() {
  return [...signals.flat(), [2], [6]]
    .sort(compare)
    .reduce(
      (prod, signal, i) =>
        !compare([2], signal) || !compare([6], signal) ? prod * (i + 1) : prod,
      1
    );
}

console.log(task1());
console.log(task2());
