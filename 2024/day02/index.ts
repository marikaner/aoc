import { readInput } from '../read-input.js';
import { sign } from '../util.js';

const input = await readInput(import.meta.url);

const reports = input
  .split('\n')
  .map((line) => line.split(' ').map((level) => parseInt(level)));

function part1() {
  return reports.filter((report) => isSafeReport(report)).length;
}

function isSafeReport(report: number[]) {
  return report
    .slice(1)
    .every((level, i) =>
      isSafeLevelDiff(level, report[i], sign(report[1] - report[0]))
    );
}

function isSafeLevelDiff(
  level: number,
  prevLevel: number,
  allowedSign: number
) {
  const diff = level - prevLevel;
  return (
    Math.abs(diff) >= 1 && Math.abs(diff) <= 3 && sign(diff) === allowedSign
  );
}

function part2() {
  return reports.filter((report) => {
    const allowedSign = sign(report[1] - report[0]);
    const unsafeIdx = report
      .slice(1)
      .findIndex((level, i) => !isSafeLevelDiff(level, report[i], allowedSign));

    return (
      isSafeReport(report) ||
      isSafeReport(report.toSpliced(unsafeIdx, 1)) ||
      isSafeReport(report.toSpliced(unsafeIdx + 1, 1)) ||
      isSafeReport(report.toSpliced(unsafeIdx - 1, 1))
    );
  }).length;
}

console.log(part1());
console.log(part2());
