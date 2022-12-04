import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const assignments = input
  .split('\n')
  .map((line) =>
    line
      .split(',')
      .map((section) => section.split('-').map((value) => parseInt(value)))
  );

function task1() {
  const fullyOverlapping = assignments.filter(
    ([section1, section2]) =>
      (section1[0] >= section2[0] && section1[1] <= section2[1]) ||
      (section2[0] >= section1[0] && section2[1] <= section1[1])
  );

  return fullyOverlapping.length;
}

function task2() {
  const partiallyOverlapping = assignments.filter(
    ([section1, section2]) =>
      (section1[0] >= section2[0] && section1[0] <= section2[1]) ||
      (section2[0] >= section1[0] && section2[0] <= section1[1])
  );

  return partiallyOverlapping.length;
}

// console.log(task1());
// console.log(task2());
