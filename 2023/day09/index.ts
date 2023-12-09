import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

const histories = input
  .split('\n')
  .map((line) => line.split(' ').map((num) => parseInt(num)));

function getNextNum(history: number[], backwards = false) {
  const prevHistory = history
    .slice(1)
    .reduce((prev, curr, i) => [...prev, curr - history[i]], []);

  return calculateNextNum(history, prevHistory, backwards);
}

function calculateNextNum(
  history: number[],
  prevHistory: number[],
  backwards: boolean
) {
  const isRoot = history.slice(1).every((item, i) => item === history[i]);
  if (backwards) {
    return (
      history[0] -
      (isRoot ? prevHistory[0] : getNextNum(prevHistory, backwards))
    );
  }

  return (
    history[history.length - 1] +
    (isRoot ? prevHistory[prevHistory.length - 1] : getNextNum(prevHistory))
  );
}

function part1() {
  return sum(histories.map((history) => getNextNum(history)));
}

function part2() {
  return sum(histories.map((history) => getNextNum(history, true)));
}

console.log(part1());
console.log(part2());
