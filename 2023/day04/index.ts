import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

const scratchCards = input.split('\n').map((line) => {
  const [winners, numbers] = line
    .split(': ')[1]
    .split(/\s+\|\s+/)
    .map((nums) => nums.split(/\s+/));
  return { winners, numbers };
});

const winningScratchCards = scratchCards.map(
  ({ winners, numbers }) =>
    numbers.filter((num) => winners.includes(num)).length
);

function part1() {
  return sum(winningScratchCards, (wins) => (wins ? Math.pow(2, wins - 1) : 0));
}

function part2() {
  const copies = winningScratchCards.map(() => 1);
  winningScratchCards.forEach((wins, i) => {
    for (let win = 1; win <= wins; win++) {
      copies[i + win] += copies[i];
    }
  });
  return sum(copies);
}

console.log(part1());
console.log(part2());
