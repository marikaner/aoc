import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const motions: [string, number][] = input.split('\n').map((line) => {
  const [direction, distance] = line.split(' ');
  return [direction, parseInt(distance)];
});

function getMotion(prevKnot, knot) {
  const motion = [0, 0];
  const xDistance = prevKnot[0] - knot[0];
  const yDistance = prevKnot[1] - knot[1];

  if (Math.abs(xDistance) >= 2) {
    motion[0] = Math.sign(xDistance);
    if (Math.abs(yDistance)) {
      motion[1] = Math.sign(yDistance);
    }
  } else if (Math.abs(yDistance) >= 2) {
    motion[1] = Math.sign(yDistance);
    if (Math.abs(xDistance)) {
      motion[0] = Math.sign(xDistance);
    }
  }
  return motion;
}

function updateTail(head, tail, visited) {
  const [newHead, ...newTail] = tail;

  const tMotion = getMotion(head, newHead);

  if (tMotion[0] || tMotion[1]) {
    newHead[0] += tMotion[0];
    newHead[1] += tMotion[1];

    if (newTail.length) {
      return updateTail(newHead, newTail, visited);
    }
    visited.push(newHead.toString());
  }
}

function moveHead(direction, head) {
  if (direction === 'R') {
    return (head[0] += 1);
  }
  if (direction === 'L') {
    return (head[0] -= 1);
  }
  if (direction === 'U') {
    return (head[1] += 1);
  }
  if (direction === 'D') {
    return (head[1] -= 1);
  }
}

function moveRope([direction, distance], [head, ...tail], visited) {
  moveHead(direction, head);
  updateTail(head, tail, visited);

  if (--distance) {
    return moveRope([direction, distance], [head, ...tail], visited);
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
