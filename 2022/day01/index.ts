import { cursorTo } from 'node:readline';
import { readInput, getDirName } from '../read-input.js';

const input = (await readInput(getDirName(import.meta.url))).split('\n\n');
// .map((line) => line ? parseInt(line) : 0);

const caloriesByElf = input.map((chunk) =>
  chunk.split('\n').map((line) => parseInt(line))
);

const m = caloriesByElf.reduce(
  (maxes, currCalories) => {
    const min = Math.min(...maxes);
    const newMax = Math.max(
      min,
      currCalories.reduce((sum, curr) => sum + curr, 0)
    );
    maxes[maxes.indexOf(min)] = newMax;
    return maxes;
  },
  [0, 0, 0]
);

console.log(m[0] + m[1] + m[2]);
