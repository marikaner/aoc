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

interface Lense {
  next: Lense | undefined;
  prev: Lense | undefined;
  focalLength: number;
}

interface Box {
  first: Lense | undefined;
  last: Lense | undefined;
  lenses: Record<string, Lense>;
}

function replaceLense(box: Box, label: string, focalLength: number) {
  box.lenses[label].focalLength = focalLength;
}

function addLense(box: Box, label: string, focalLength: number) {
  const lense = {
    focalLength,
    prev: box.last,
    next: undefined
  };
  if (box.last) {
    box.last.next = lense;
    // box was empty before
  } else {
    box.first = lense;
  }
  box.last = lense;
  box.lenses[label] = lense;
}

function removeLense(box: Box, label: string) {
  const lense = box.lenses[label];
  if (lense) {
    if (lense.prev) {
      lense.prev.next = lense.next;
      // lense was first
    } else {
      box.first = lense.next;
    }
    if (lense.next) {
      lense.next.prev = lense.prev;
      // lense was last
    } else {
      box.last = lense.prev;
    }
    delete box.lenses[label];
  }
}

function getOrCreateBox(boxes: Box[], i: number) {
  if (!boxes[i]) {
    boxes[i] = {
      last: null,
      first: null,
      lenses: {}
    };
  }
  return boxes[i];
}

function fillBoxes(boxes = []) {
  seq
    .map((str) => parseStep(str))
    .forEach(({ label, operation, focalLength }) => {
      const box = getOrCreateBox(boxes, hash(label));
      if (operation === '=') {
        return box.lenses[label]
          ? replaceLense(box, label, focalLength)
          : addLense(box, label, focalLength);
      }
      return removeLense(box, label);
    });

  return boxes;
}

function getFocussingPower(boxes: Box[]) {
  return boxes.reduce((sum, { first: curr }, boxI) => {
    for (let i = 1; curr; i++, curr = curr.next) {
      sum += (boxI + 1) * i * curr.focalLength;
    }
    return sum;
  }, 0);
}

function part1() {
  return sum(seq.map((str) => hash(str)));
}

function part2() {
  return getFocussingPower(fillBoxes());
}

console.log(part1());
console.log(part2());
