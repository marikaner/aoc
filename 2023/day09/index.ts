import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

const histories = input
  .split('\n')
  .map((line) => line.split(' ').map((num) => parseInt(num)));

function getPreviousHistory(history: number[]) {
  return history
    .slice(1)
    .reduce((prev, curr, i) => [...prev, curr - history[i]], []);
}

function isRoot(history: number[]) {
  return history.slice(1).every((item, i) => item === history[i]);
}

function getNextNum(history: number[]) {
  const prevHistory = getPreviousHistory(history);

  return (
    history[history.length - 1] +
    (isRoot(prevHistory)
      ? prevHistory[prevHistory.length - 1]
      : getNextNum(prevHistory))
  );
}

function getPrevNum(history: number[]) {
  const prevHistory = getPreviousHistory(history);

  return (
    history[0] -
    (isRoot(prevHistory) ? prevHistory[0] : getPrevNum(prevHistory))
  );
}

function part1() {
  return sum(histories.map((history) => getNextNum(history)));
}

function part2() {
  return sum(histories.map((history) => getPrevNum(history)));
}

console.log(part1());
console.log(part2());
