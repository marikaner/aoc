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

function task1() {
  const interestingCycles = [20, 60, 100, 140, 180, 220];
  let result = 0;
  function onCycleUpdate(cycle, x) {
    result += interestingCycles.includes(cycle) ? cycle * x : 0;
  }
  executeOperations(onCycleUpdate);
  return result;
}

function drawPixel(cycle: number, signal: number): string {
  const crtPos = cycle % 40;
  const pixel = [signal - 1, signal, signal + 1].includes(crtPos) ? '#' : '.';
  return crtPos ? pixel : `\n${pixel}`;
}

function task2() {
  let result = '';
  function onCycleUpdate(cycle, x) {
    result += drawPixel(cycle, x);
  }
  executeOperations(onCycleUpdate);
  return result;
}

console.log(task1());
console.log(task2());
