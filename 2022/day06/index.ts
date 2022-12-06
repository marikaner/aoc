import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const data = input.split('');

function getMarkerIndex(distinct: number): number {
  for (let i = 0; i < data.length - distinct; i++) {
    const lastFour = data.slice(i, i + distinct);
    if (new Set(lastFour).size === distinct) {
      return i + distinct;
    }
  }
}

function task1() {
  return getMarkerIndex(4);
}

function task2() {
  return getMarkerIndex(14);
}

// console.log(task1());
// console.log(task2());
