import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

const equations = input.split('\n').map((line) => {
  const [rawVal, rawNums] = line.split(': ');
  return {
    val: parseInt(rawVal),
    nums: rawNums.split(' ').map((num) => parseInt(num))
  };
});

type Equation = {
  val: number;
  nums: number[];
};

function getPermutations(operators: string[]): string[][] {
  if (!operators.length) {
    return [[]];
  }

  if (operators.length === 1) {
    return [operators];
  }

  return operators
    .flatMap((operator, i) => {
      if (i && operator === operators[i - 1]) {
        return;
      }

      return getPermutations([
        ...operators.slice(0, i),
        ...operators.slice(i + 1)
      ]).map((permutation) => [operator, ...permutation]);
    })
    .filter((permutation) => permutation);
}

function calculate(nums: number[], operators: string[]): number {
  return operators.reduce((acc, op, i) => {
    if (op === '+') {
      return acc + nums[i + 1];
    }
    if (op === '||') {
      return parseInt(`${acc}${nums[i + 1]}`);
    }
    return acc * nums[i + 1];
  }, nums[0]);
}

function getPermutationsForCalibration(
  operatorCount: number,
  includeConcatenation: boolean
) {
  const operators = Array.from({ length: operatorCount }, () => '+');
  const permutations = [[...operators]];
  for (let i = 0; i < operators.length; i++) {
    operators[i] = '*';
    permutations.push(...getPermutations(operators));

    if (includeConcatenation) {
      const opsCopy = [...operators];
      for (let k = i; k < operators.length; k++) {
        opsCopy[k] = '||';
        permutations.push(...getPermutations(opsCopy));
      }
    }
  }

  return permutations;
}

function canCalibrate(
  { val, nums }: Equation,
  includeConcatenation = false
): boolean {
  const permutations = getPermutationsForCalibration(
    nums.length - 1,
    includeConcatenation
  );
  return permutations.some((ops) => calculate(nums, ops) === val);
}

function part1() {
  return sum(equations.filter((eq) => canCalibrate(eq)).map(({ val }) => val));
}

function part2() {
  return sum(
    equations.filter((eq) => canCalibrate(eq, true)).map(({ val }) => val)
  );
}

console.log(part1());
console.log(part2());
