import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);
const lines = input.split('\n');
const lineLength = lines[0].length;
const numberPositions = lines.map((line) => getNumberPositions(line));

function getNumberPositions(line: string) {
  const numRegex = RegExp('[0-9]+', 'g');
  let result;
  const searchResult = [];
  while ((result = numRegex.exec(line)) !== null) {
    searchResult.push({
      index: result.index,
      num: parseInt(result[0]),
      length: result[0].length
    });
  }
  return searchResult;
}

function getAdjacentChars(row: number, left: number, right: number) {
  return [lines[row - 1] || '', lines[row], lines[row + 1] || '']
    .map((line) => line.substring(left, right + 1))
    .join('');
}

function getGearPositions(line: string): number[] {
  const gearRegex = /\*/g;
  let result;
  const searchResult = [];
  while ((result = gearRegex.exec(line)) !== null) {
    searchResult.push(result.index);
  }
  return searchResult;
}

function getAdjacentNums(row: number, pos: number) {
  const numLines = [
    ...(numberPositions[row - 1] || []),
    ...numberPositions[row],
    ...(numberPositions[row + 1] || [])
  ];
  return numLines.filter(
    (numPos) => pos >= numPos.index - 1 && pos <= numPos.index + numPos.length
  );
}

function part1() {
  const symbolRegex = /[^\d\.]/;
  const partNumPositions = numberPositions.flatMap((positions, row) => {
    return positions.filter((pos) => {
      const left = Math.max(0, pos.index - 1);
      const right = Math.min(lineLength - 1, pos.index + pos.length);
      return symbolRegex.test(getAdjacentChars(row, left, right));
    });
  });

  return sum(partNumPositions, ({ num }) => num);
}

function part2() {
  const gearPositions = lines.map((line) => getGearPositions(line));
  const ratios = gearPositions.flatMap((gearPositionsLine, row) =>
    gearPositionsLine.map((pos) => {
      const adjacentNums = getAdjacentNums(row, pos);
      return adjacentNums.length === 2
        ? adjacentNums[0].num * adjacentNums[1].num
        : 0;
    })
  );
  return sum(ratios);
}

console.log(part1());
console.log(part2());
