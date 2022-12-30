import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const snafuToInt: Record<string, number> = {
  0: 0,
  1: 1,
  2: 2,
  '-': -1,
  '=': -2
};

const intToSnafu: Record<string, string> = {
  0: '0',
  1: '1',
  2: '2',
  '-1': '-',
  '-2': '='
};

const snafus = input.split('\n').map((line) =>
  line
    .split('')
    .reverse()
    .map((num) => snafuToInt[num])
);

function add(snafu1: number[], snafu2: number[]): number[] {
  [snafu1, snafu2] =
    snafu1.length > snafu2.length ? [snafu1, snafu2] : [snafu2, snafu1];
  const a = snafu1.map((num, i) => num + (snafu2[i] ?? 0));
  return a.reduce((snafu, digit, i) => {
    digit = digit + (snafu[i] ?? 0);
    if (digit > 2) {
      snafu[i + 1] = snafu[i + 1] ? snafu[i + 1] : 0;
      snafu[i + 1] += 1;
      digit = digit - 5;
    } else if (digit < -2) {
      snafu[i + 1] = snafu[i + 1] ? snafu[i + 1] : 0;
      snafu[i + 1] -= 1;
      digit = 5 + digit;
    }

    snafu[i] = digit;

    return snafu;
  }, []);
}

function stringify(snafu: number[]): string {
  return [...snafu]
    .reverse()
    .map((digit) => intToSnafu[digit])
    .join('');
}

function task1() {
  return stringify(snafus.reduce((sum, snafu) => add(sum, snafu), [0]));
}

function task2() {}

console.log(task1());
console.log(task2());
