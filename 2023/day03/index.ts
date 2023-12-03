import { readInput } from '../read-input.js';
import { sum, toArray } from '../util.js';

const input = await readInput(import.meta.url);
const lines = input.split('\n');
const numberPositions = lines.map((line) => getNumberPositions(line));

function getNumberPositions(line: string) {
  const numberRegex = /\d+/g;
  return toArray(line.matchAll(numberRegex)).map((result) => ({
    index: result.index,
    num: parseInt(result[0]),
    length: result[0].length
  }));
}

function getAdjacentChars(row: number, left: number, right: number) {
  return [lines[row - 1] || '', lines[row], lines[row + 1] || '']
    .map((line) => line.substring(left, right + 1))
    .join('');
}

function getGearPositions(line: string): number[] {
  const gearRegex = /\*/g;
  return toArray(line.matchAll(gearRegex)).map(({ index }) => index);
}

function getAdjacentNums(row: number, pos: number) {
  const numLines = [
    numberPositions[row - 1] || [],
    numberPositions[row],
    numberPositions[row + 1] || []
  ].flat();
  return numLines.filter(
    (numPos) => pos >= numPos.index - 1 && pos <= numPos.index + numPos.length
  );
}

function part1() {
  const symbolRegex = /[^\d\.]/;
  const partNumPositions = numberPositions.flatMap((positions, row) =>
    positions.filter((pos) =>
      symbolRegex.test(
        getAdjacentChars(row, pos.index - 1, pos.index + pos.length)
      )
    )
  );

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
