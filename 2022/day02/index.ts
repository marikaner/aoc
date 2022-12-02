import { readInput, getDirName } from '../read-input.js';

const input = await readInput(getDirName(import.meta.url));
const rounds = input.split('\n').map((line) => line.split(' '));

const shapes = {
  A: 1,
  X: 1,
  B: 2,
  Y: 2,
  C: 3,
  Z: 3
};

const outcomeScores = {
  0: 3,
  1: 0,
  2: 6
};

const outcomeOffset = {
  X: 2,
  Y: 0,
  Z: 1
};

function calcScore(strategy) {
  return strategy
    .map(
      ([move, response]) => response + outcomeScores[(move - response + 3) % 3]
    )
    .reduce((sum, score) => sum + score, 0);
}

function task1() {
  const strategy = rounds.map(([left, right]) => [shapes[left], shapes[right]]);
  return calcScore(strategy);
}

function task2() {
  const strategy = rounds.map(([move, outcome]) => [
    shapes[move],
    (outcomeOffset[outcome] + shapes[move]) % 3 || 3
  ]);
  return calcScore(strategy);
}

console.log(task1());
// console.log(task2());
