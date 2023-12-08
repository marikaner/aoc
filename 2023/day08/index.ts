import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const [rawSteps, rawMaps] = input.split('\n\n');
const steps = rawSteps.split('');
const maps = rawMaps.split('\n').reduce((nodes, line) => {
  const [el, L, R] = line.split(/[^A-Z]+/);
  return { ...nodes, [el]: { L, R } };
}, {});

function part1() {
  let curr = 'AAA';
  let i = 0;
  while (curr !== 'ZZZ') {
    curr = maps[curr][steps[i % steps.length]];
    i++;
  }
  return i;
}

function gcd(a, b) {
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

function part2() {
  let starts = Object.keys(maps).filter((node) => node.endsWith('A'));
  return starts
    .map((node) => {
      let i = 0;
      let curr = node;
      while (!curr.endsWith('Z')) {
        curr = maps[curr][steps[i % steps.length]];
        i++;
      }
      return i;
    })
    .reduce((currLcm, steps) => lcm(currLcm, steps));
}

console.log(part1());
console.log(part2());
