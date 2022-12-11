import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const monkeys = input.split('\n\n').map((chunk) => {
  const lines = chunk.split('\n');
  const items = lines[1]
    .split(' ')
    .slice(4)
    .map((item) => parseInt(item));

  const operationLine = lines[2].split(' ');
  const val = operationLine.pop();
  const op = operationLine.pop();
  const operation = parseOperation(op, val);

  const divisibleBy = parseInt(lines[3].split(' ').pop());

  const ifTrue = parseInt(lines[4].split(' ').pop());
  const ifFalse = parseInt(lines[5].split(' ').pop());

  return {
    items,
    operation,
    divisibleBy,
    ifTrue,
    ifFalse
  };
});

function parseOperation(op: string, val: string) {
  const parseVal = (num) => (val === 'old' ? num : parseInt(val));
  return op === '+'
    ? (num) => num + parseVal(num)
    : (num) => num * parseVal(num);
}

function isDivisibleBy(num: number, by: number): boolean {
  return !(num % by);
}

const lcm = 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

function getClassNum(num: number): number {
  const factor = Math.floor(num / lcm);
  return num - lcm * factor;
}

function simulateRounds(
  rounds: number,
  releave: (num: number) => number = (num) => num
) {
  const inspectedItems = monkeys.map(() => 0);
  for (let round = 0; round < rounds; round++) {
    monkeys.forEach(({ items, operation, divisibleBy, ifTrue, ifFalse }, i) => {
      while (items.length) {
        const item = items.shift();
        inspectedItems[i]++;
        const worry = getClassNum(releave(operation(item)));
        const toMonkey =
          monkeys[isDivisibleBy(worry, divisibleBy) ? ifTrue : ifFalse];
        toMonkey.items.push(worry);
      }
    });
  }

  console.log(inspectedItems);
  inspectedItems.sort((a, b) => a - b);
  return inspectedItems.pop() * inspectedItems.pop();
}

function task1() {
  return simulateRounds(20, (num) => Math.floor(num / 3));
}

function task2() {
  return simulateRounds(10000);
}

// tasks have side-effects
// console.log(task1());
console.log(task2());
