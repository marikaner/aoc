import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const hailstones = input.split('\n').map((line) => {
  const [position, velocity] = line.split(' @ ').map((str) => parseVector(str));
  return { position, velocity };
});

function parseVector(vectorStr: string) {
  const [x, y, z] = vectorStr.split(', ').map((num) => parseInt(num));
  return { x, y, z };
}

interface Pos {
  x: number;
  y: number;
  z: number;
}

interface Vector {
  position: Pos;
  velocity: Pos;
}

function willIntersect(
  { position: pos1, velocity: vel1 }: Vector,
  { position: pos2, velocity: vel2 }: Vector,
  { min, max }: { min: number; max: number }
) {
  const c2 =
    (pos1.y * vel1.x + pos2.x * vel1.y - pos1.x * vel1.y - pos2.y * vel1.x) /
    (vel2.y * vel1.x - vel1.y * vel2.x);
  const c1 = (pos2.x + c2 * vel2.x - pos1.x) / vel1.x;
  const intersection = { x: pos2.x + c2 * vel2.x, y: pos2.y + c2 * vel2.y };

  return (
    c1 >= 0 &&
    c2 >= 0 &&
    intersection.x >= min &&
    intersection.y >= min &&
    intersection.x <= max &&
    intersection.y <= max
  );
}

function part1() {
  const min = 200000000000000;
  const max = 400000000000000;
  return hailstones.flatMap((vec1, i) =>
    hailstones
      .slice(i + 1)
      .filter((vec2) => willIntersect(vec1, vec2, { min, max }))
  ).length;
}

function part2() {}

console.log(part1());
console.log(part2());
