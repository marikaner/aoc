import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const motions: [string, number][] = input.split('\n').map((line) => {
  const [direction, distance] = line.split(' ');
  return [direction, parseInt(distance)];
});

function getMotion(prevKnot, knot) {
  const xDistance = prevKnot[0] - knot[0];
  const yDistance = prevKnot[1] - knot[1];

  if (Math.abs(xDistance) >= 2 || Math.abs(yDistance) >= 2) {
    return [Math.sign(xDistance), Math.sign(yDistance)];
  }
  return [0, 0];
}

function updateTail(head, tail, visited) {
  const [newHead, ...newTail] = tail;
  const motion = getMotion(head, newHead);

  if (motion[0] || motion[1]) {
    newHead[0] += motion[0];
    newHead[1] += motion[1];

    if (newTail.length) {
      return updateTail(newHead, newTail, visited);
    }
    visited.push(newHead.toString());
  }
}

const motionMapping = {
  R: (head) => (head[0] += 1),
  L: (head) => (head[0] -= 1),
  U: (head) => (head[1] += 1),
  D: (head) => (head[1] -= 1)
};

function moveHead(direction, head) {
  motionMapping[direction](head);
}

function moveRope([direction, distance], [head, ...tail], visited) {
  moveHead(direction, head);
  updateTail(head, tail, visited);

  if (--distance) {
    moveRope([direction, distance], [head, ...tail], visited);
  }
}

function moveAll(rope) {
  const visited = [rope[rope.length - 1].toString()];

  motions.forEach(([direction, distance]) =>
    moveRope([direction, distance], rope, visited)
  );

  return new Set(visited).size;
}

function task1() {
  return moveAll([
    [0, 0],
    [0, 0]
  ]);
}

function task2() {
  return moveAll([
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
  ]);
}

console.log(task1());
console.log(task2());
