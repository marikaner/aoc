import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

const locations = input
  .split('\n')
  .map((line) => line.split('   ').map((location) => parseInt(location)));

const left = locations.map((location) => location[0]).sort((a, b) => a - b);
const right = locations.map((location) => location[1]).sort((a, b) => a - b);

function part1() {
  const distances = left.map((location, index) =>
    Math.abs(right[index] - location)
  );
  return sum(distances);
}

function part2() {
  const similarities = left.map(
    (location) =>
      location *
      right.filter((rightLocation) => rightLocation === location).length
  );

  return sum(similarities);
}

console.log(part1());
console.log(part2());
