import { readInput } from '../read-input.js';
import { product } from '../util.js';

const input = await readInput(import.meta.url);

function getWins(time: number, record: number) {
  let wins = 0;
  for (let speed = 1; speed < time - 1; speed++) {
    if ((time - speed) * speed > record) {
      wins++;
    } else if (wins > 0) {
      return wins;
    }
  }
  return wins;
}

function part1() {
  const [times, records] = input.split('\n').map((line) =>
    line
      .split(/:\s+/)[1]
      .split(/\s+/)
      .map((num) => parseInt(num))
  );

  return product(times.map((time, race) => getWins(time, records[race])));
}

function part2() {
  const [time, record] = input
    .split('\n')
    .map((line) => parseInt(line.split(/:\s+/)[1].replaceAll(/\s+/g, '')));

  return getWins(time, record);
}

console.log(part1());
console.log(part2());
