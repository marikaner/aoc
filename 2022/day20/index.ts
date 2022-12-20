import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

interface Node {
  prev: Node;
  val: number;
  next: Node;
}

const initialSequence = input
  .split('\n')
  .map((line) => ({ val: parseInt(line) } as Node));

for (let i = 0; i < initialSequence.length; i++) {
  const node = initialSequence[i];
  node.next =
    i === initialSequence.length - 1
      ? initialSequence[0]
      : initialSequence[i + 1];
  node.prev =
    i === 0
      ? initialSequence[initialSequence.length - 1]
      : initialSequence[i - 1];
}

function removeNode(node: Node) {
  const next = node.next;
  const prev = node.prev;
  prev.next = next;
  next.prev = prev;
}

function insertNodeAfter(node: Node, prev: Node) {
  const next = prev.next;

  prev.next = node;
  node.prev = prev;
  node.next = next;
  next.prev = node;
}

function move(node: Node) {
  const maxDistance = initialSequence.length - 1;
  let distance = node.val % maxDistance;
  if (distance) {
    if (distance < 0) {
      distance += maxDistance;
    }

    let currNode = node;
    while (distance--) {
      currNode = currNode.next;
    }

    removeNode(node);
    insertNodeAfter(node, currNode);
  }
}

function findByValue(val: number): Node {
  return initialSequence.find((node) => node.val === val);
}

function findByNAfter(start: Node, n: number) {
  n = n % initialSequence.length;
  let curr = start;
  while (n--) {
    curr = curr.next;
  }
  return curr;
}

function getPosition() {
  const zero = findByValue(0);
  const x = findByNAfter(zero, 1000);
  const y = findByNAfter(x, 1000);
  const z = findByNAfter(y, 1000);

  return x.val + y.val + z.val;
}

function task1() {
  initialSequence.forEach((node) => {
    move(node);
  });

  return getPosition();
}

function task2() {
  for (let i = 0; i < initialSequence.length; i++) {
    const node = initialSequence[i];
    node.val *= 811589153;
  }

  let times = 10;
  while (times--) {
    initialSequence.forEach((node) => {
      move(node);
    });
  }

  return getPosition();
}

// side effects
// console.log(task1());
console.log(task2());
