import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

const seq = input.split(',');

function hash(str: string) {
  return str
    .split('')
    .reduce((curr, char) => ((curr + char.charCodeAt(0)) * 17) % 256, 0);
}

function parseStep(str: string) {
  const { label, operation, focalLength } = str.match(
    /(?<label>\w+)(?<operation>[-=]{1})(?<focalLength>\d*)/
  ).groups;
  return {
    label,
    operation,
    ...(operation === '=' && { focalLength: parseInt(focalLength) })
  };
}

function getBox(boxes: Record<string, number>[], i: number) {
  if (!boxes[i]) {
    boxes[i] = {};
  }
  return boxes[i];
}

function fillBoxes(boxes = []) {
  seq
    .map((str) => parseStep(str))
    .forEach(({ label, operation, focalLength }) => {
      const box = getBox(boxes, hash(label));
      if (operation === '=') {
        box[label] = focalLength;
      } else {
        delete box[label];
      }
    });

  return boxes;
}

function getFocussingPower(boxes: Record<string, number>[]) {
  return sum(
    boxes.flatMap((box, boxI) =>
      Object.values(box).map(
        (focalLength, i) => (boxI + 1) * (i + 1) * focalLength
      )
    )
  );
}

function part1() {
  return sum(seq.map((str) => hash(str)));
}

function part2() {
  return getFocussingPower(fillBoxes());
}

console.log(part1());
console.log(part2());
