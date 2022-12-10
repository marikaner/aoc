import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const operations = input.split('\n').map((line) => line.split(' '));

function executeOperations(onCycleUpdate: (cycle: number, x: number) => void) {
  let cycle = 0;
  let x = 1;
  onCycleUpdate(0, 1);

  operations.forEach(([operation, value]) => {
    cycle++;
    onCycleUpdate(cycle, x);
    if (operation === 'addx') {
      x += parseInt(value);
      cycle++;
      onCycleUpdate(cycle, x);
    }
  });
}

function drawPixel(cycle: number, signal: number): string {
  const crtPos = cycle % 40;
  const pixel = [signal - 1, signal, signal + 1].includes(crtPos) ? '#' : '.';
  return crtPos ? pixel : `\n${pixel}`;
}

function task1() {
  const interestingCycles = [20, 60, 100, 140, 180, 220];
  let result = 0;
  executeOperations(
    (cycle, x) => (result += interestingCycles.includes(cycle) ? cycle * x : 0)
  );
  return result;
}

function task2() {
  let result = '';
  executeOperations((cycle, x) => (result += drawPixel(cycle, x)));
  return result;
}

console.log(task1());
console.log(task2());
