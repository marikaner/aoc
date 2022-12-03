import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const caloriesByElf = input.split('\n\n').map((chunk) =>
  chunk
    .split('\n')
    .map((line) => parseInt(line))
    .reduce((sum, calories) => sum + calories, 0)
);

function task1() {
  return caloriesByElf.reduce((max, calories) => Math.max(max, calories), 0);
}

function task2() {
  return caloriesByElf
    .reduce(
      (maxes, calories) => {
        maxes[0] = Math.max(maxes[0], calories);
        return maxes.sort();
      },
      [0, 0, 0]
    )
    .reduce((sum, calories) => sum + calories, 0);
}

// console.log(task1());
// console.log(task2());
