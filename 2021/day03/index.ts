import { readInput } from '../read-input';

async function getInput(): Promise<number[][]> {
  return (await readInput(__dirname))
    .split('\n')
    .map((line) => line.split('').map((num) => parseInt(num)));
}

async function getRate(): Promise<number[]> {
  const input = await getInput();
  return input.reduce(
    (rate, bin) => {
      bin.forEach((num, i) => {
        const summand = num || -1;
        rate[i] += summand;
      });
      return rate;
    },
    input[0].map(() => 0)
  );
}

function translateNum(num: number[]): number {
  return parseInt(num.join(''), 2);
}

function getGamma(rate: number[]): number {
  return translateNum(rate.map((num) => (num > 0 ? 1 : 0)));
}

function getEpsilon(rate: number[]): number {
  return translateNum(rate.map((num) => (num > 0 ? 0 : 1)));
}

async function getLifeSupportRating(keep: (rate: number) => number) {
  const input = await getInput();
  let reducedInput = input;
  let i = 0;
  while (reducedInput.length > 1 && i < input[0].length) {
    const rate = reducedInput.reduce((sum, num) => (sum += num[i] || -1), 0);
    const decidingNum = keep(rate);
    reducedInput = reducedInput.filter((num) => num[i] === decidingNum);
    i++;
  }
  return translateNum(reducedInput[0]);
}

async function getOxygenGeneratorRating(): Promise<number> {
  return getLifeSupportRating((rate) => (rate >= 0 ? 1 : 0));
}

async function getCO2ScrubberRating(): Promise<number> {
  return getLifeSupportRating((rate) => (rate < 0 ? 1 : 0));
}

async function main() {
  /* Task 1 */
  // const rate = await getRate();
  // console.log(getGamma(rate) * getEpsilon(rate));

  /* Task 2 */
  console.log(
    (await getOxygenGeneratorRating()) * (await getCO2ScrubberRating())
  );
}

main();
