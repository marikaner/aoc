import { readInput } from '../read-input';

type Line = { pattern: string[]; output: string[] };
async function getInput(): Promise<Line[]> {
  return (await readInput(__dirname)).split('\n').map((line) => {
    const [pattern, output] = line.split(' | ').map((part) => part.split(' '));
    return { pattern, output };
  });
}

//  aaaa
// b    c
// b    c
//  dddd
// e    f
// e    f
//  gggg

function deductNums(pattern: string[]): Record<string, string> {
  const one = pattern.find((p) => p.length === 2)!;
  const seven = pattern.find((p) => p.length === 3)!;
  const eight = pattern.find((p) => p.length === 7)!;
  const four = pattern.find((p) => p.length === 4)!;

  const a = seven.split('').find((char) => !one.includes(char))!;
  const cf = one.split('');
  const bd = four.split('').filter((char) => !one.includes(char));
  const eg = eight
    .split('')
    .filter((char) => ![a, ...cf, ...bd].includes(char));

  const two = pattern.find(
    (p) => p.length === 5 && [a, ...eg].every((char) => p.includes(char))
  )!;

  const three = pattern.find(
    (p) => p.length === 5 && [a, ...cf].every((char) => p.includes(char))
  )!;

  const five = pattern.find(
    (p) => p.length === 5 && [a, ...bd].every((char) => p.includes(char))
  )!;

  const six = pattern.find(
    (p) => p.length === 6 && [a, ...bd, ...eg].every((char) => p.includes(char))
  )!;

  const nine = pattern.find(
    (p) =>
      p.length === 6 &&
      p !== six &&
      [a, ...cf, ...bd].every((char) => p.includes(char))
  )!;

  const zero = pattern.find((p) => p.length === 6 && p !== six && p !== nine)!;

  return {
    [zero]: '0',
    [one]: '1',
    [two]: '2',
    [three]: '3',
    [four]: '4',
    [five]: '5',
    [six]: '6',
    [seven]: '7',
    [eight]: '8',
    [nine]: '9'
  };
}

function readCode(output: string[], numbers: Record<string, string>): number {
  return parseInt(output.map((num) => findNumber(num, numbers)).join(''));
}

function findNumber(num: string, numbers: Record<string, string>): string {
  const record = Object.entries(numbers).find(
    ([key]) =>
      key.length === num.length &&
      num.split('').every((char) => key.includes(char))
  )!;

  return record[1];
}

async function main() {
  const input = await getInput();

  /* Task 1 */
  // const num = input
  //   .map(
  //     ({ output }) =>
  //       output.filter((o) => [2, 3, 4, 7].includes(o.length)).length
  //   )
  //   .reduce((sum, val) => sum + val, 0);

  /* Task 2 */
  const sum = input.reduce((sum, { pattern, output }, idx) => {
    const numbers = deductNums(pattern);
    const code = readCode(output, numbers);
    return sum + code;
  }, 0);

  console.log(sum);
}

main();
