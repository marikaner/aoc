import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const add = (left, right) => left + right;
const sub = (left, right) => left - right;
const mul = (left, right) => left * right;
const div = (left, right) => left / right;
const ops = { '+': add, '-': sub, '*': mul, '/': div };

const initialMonkeys = input.split('\n').reduce(
  (monkeys, line) => {
    const [name, value] = line.split(': ');
    if (value.includes(' ')) {
      const [left, op, right] = value.split(' ');
      monkeys.unsolved.push({ name, left, right, op });
    } else {
      const val = parseInt(value);
      monkeys.solved[name] = () => val;
    }
    return monkeys;
  },
  { solved: {}, unsolved: [] }
);

function getRootSolution(monkeys) {
  while (!('root' in monkeys.solved)) {
    monkeys = monkeys.unsolved.reduce(
      (monkeys, unsolvedOp) => {
        const { name, left, right, op } = unsolvedOp;
        if (left in monkeys.solved && right in monkeys.solved) {
          monkeys.solved[name] = (humn) =>
            ops[op](monkeys.solved[left](humn), monkeys.solved[right](humn));
        } else {
          monkeys.unsolved.push(unsolvedOp);
        }
        return monkeys;
      },
      { ...monkeys, unsolved: [] }
    );
  }

  return monkeys.solved['root'];
}

function task1() {
  const monkeys = {
    solved: { ...initialMonkeys.solved },
    unsolved: [...initialMonkeys.unsolved]
  };

  return getRootSolution(monkeys)();
}

function task2() {
  const monkeys = {
    solved: { ...initialMonkeys.solved, humn: (humn) => humn },
    unsolved: [...initialMonkeys.unsolved]
  };
  const unsolvedRoot = monkeys.unsolved.find(
    (monkey) => monkey.name === 'root'
  );
  unsolvedRoot.op = '-';
  const root = getRootSolution(monkeys);

  let i = 1_000_000;
  let factor = 100;
  let summand = 1;
  let oldI = i;
  while (true) {
    const res = root(i);
    if (!res) {
      return i;
    }
    if (res < 0) {
      if (factor > 1) {
        factor = Math.ceil(factor / 2);
        summand = oldI;
      } else {
        summand = Math.ceil(summand / 2);
      }
      i = oldI;
    } else {
      oldI = i;
    }
    i = factor === 1 ? i + summand : i * factor;
  }
}

console.log(task1());
console.log(task2());
