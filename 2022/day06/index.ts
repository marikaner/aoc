import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const data = input.split('');

function getMarkerIndex(length: number): number {
  return (
    data.findIndex(
      (_, i) => new Set(data.slice(i, i + length)).size === length
    ) + length
  );
}

function task1() {
  return getMarkerIndex(4);
}

function task2() {
  return getMarkerIndex(14);
}

console.log(task1());
console.log(task2());
