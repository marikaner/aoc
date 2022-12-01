import { readInput } from '../read-input';

async function getInput() {
  return (await readInput(__dirname)).split('\n').map((line) => parseInt(line));
}

async function getMeasurementIncreases(window: number) {
  const input = await getInput();
  let previousSum;
  let num = 0;
  for (let i = 0; i <= input.length - window; i++) {
    const currentSum = input
      .slice(i, i + window)
      .reduce((sum, curr) => sum + curr, 0);
    if (previousSum && currentSum > previousSum) {
      num += 1;
    }
    previousSum = currentSum;
  }
  return num;
}

async function main() {
  console.log(await getMeasurementIncreases(3));
}

main();
