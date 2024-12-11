import { readInput } from '../read-input.js';
import { memoize, sum } from '../util.js';

const input = await readInput(import.meta.url);

const stones = input.split(' ');

function blink(stones: string[]) {
  return stones.flatMap((stone) => {
    if (stone === '0') {
      return '1';
    }
    if (stone.length % 2 === 0) {
      return [
        stone.slice(0, stone.length / 2),
        stone.slice(stone.length / 2)
      ].map((s) => parseInt(s).toString());
    }
    return (parseInt(stone) * 2024).toString();
  });
}

const blinkRec = memoize((stones: string[], times: number) => {
  return times
    ? sum(blink(stones).map((stone) => blinkRec([stone], times - 1)))
    : 1;
});

function part1() {
  let changedStones = [...stones];
  for (let i = 0; i < 25; i++) {
    changedStones = blink(changedStones);
  }
  return changedStones.length;
}

function part2() {
  return blinkRec(stones, 75);
}

console.log(part1());
console.log(part2());
