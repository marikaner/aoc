import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

interface Instruction {
  move: number;
  from: number;
  to: number;
}

const [rawCrates, rawInstructions] = input.split('\n\n');

const instructions: Instruction[] = rawInstructions.split('\n').map((line) => {
  const groups = line.match(
    /move (?<move>\d+) from (?<from>\d+) to (?<to>\d+)/
  ).groups;
  return {
    move: parseInt(groups.move),
    from: parseInt(groups.from) - 1,
    to: parseInt(groups.to) - 1
  };
});

const crates: string[][] = rawCrates
  .split('\n')
  .slice(0, -1)
  .reverse()
  .reduce(
    (currCrates, currCrate) => {
      for (let i = 0; i < 9; i++) {
        const content = currCrate[1 + i * 4];
        if (content !== ' ') {
          currCrates[i].push(content);
        }
      }
      return currCrates;
    },
    [[], [], [], [], [], [], [], [], []]
  );

function readTop() {
  return crates.map((crate) => crate.slice(-1)[0]).join('');
}

function task1() {
  instructions.forEach(({ move, from, to }) => {
    for (let i = 0; i < move; i++) {
      crates[to].push(crates[from].pop());
    }
  });

  return readTop();
}

function task2() {
  instructions.forEach(({ move, from, to }) => {
    crates[to].push(...crates[from].splice(0 - move, move));
  });

  return readTop();
}

// console.log(task1());
console.log(task2());
