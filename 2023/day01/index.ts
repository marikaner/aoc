import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);
const calibrationDocument = input.split('\n');

function part1() {
  return calibrationDocument
    .map((line) =>
      line
        .split('')
        .map((char) => parseInt(char))
        .filter((num) => !Number.isNaN(num))
    )
    .reduce((sum, digits) => {
      const firstDigit = digits[0];
      const lastDigit = digits[digits.length - 1];
      return sum + 10 * firstDigit + lastDigit;
    }, 0);
}

function part2() {
  const wordNumbers = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine'
  ];

  return calibrationDocument
    .map((line) => {
      {
        const numDigits = line
          .split('')
          .map((num, i) => [i, parseInt(num)])
          .filter(([_, val]) => !Number.isNaN(val));
        const firstNumDigit = numDigits[0];
        const lastNumDigit = numDigits[numDigits.length - 1];

        const digitsLeft = wordNumbers
          .map((num, i) => [line.indexOf(num), i + 1])
          .filter(([index]) => index !== -1);
        if (firstNumDigit) {
          digitsLeft.push(firstNumDigit);
        }
        const digitsRight = wordNumbers
          .map((num, i) => [line.lastIndexOf(num), i + 1])
          .filter(([index]) => index !== -1);
        if (lastNumDigit) {
          digitsRight.push(lastNumDigit);
        }

        const firstDigit = digitsLeft.reduce(
          (min, left) => (left[0] < min[0] ? left : min),
          [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
        );
        const lastDigit = digitsRight.reduce(
          (max, left) => (left[0] > max[0] ? left : max),
          [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
        );

        return 10 * firstDigit[1] + lastDigit[1];
      }
    })
    .reduce((sum, num) => sum + num, 0);
}

console.log(part1());
console.log(part2());
