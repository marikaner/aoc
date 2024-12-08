import { readInput } from '../read-input.js';
import { unique } from '../util.js';

const input = await readInput(import.meta.url);

const lines = input.split('\n');
const antennas = lines.flatMap((line, y) =>
  line
    .split('')
    .map((antenna, x) => ({ x, y, antenna }))
    .filter(({ antenna }) => antenna !== '.')
);
const mapHeight = lines.length;
const mapWidth = lines[0].length;

type Pos = { x: number; y: number };

const antennasByFrequency = antennas.reduce(
  (acc, { x, y, antenna }) => ({
    ...acc,
    [antenna]: [...(acc[antenna] || []), { x, y }]
  }),
  {} as Record<string, Pos[]>
);

function countUniqueAntiNodes(antiNodes: Pos[]) {
  return unique(antiNodes.map((antinode) => JSON.stringify(antinode))).length;
}

function getAntinode(pos: Pos, pos2: Pos, d = 1) {
  const x = pos.x - d * (pos2.x - pos.x);
  const y = pos.y - d * (pos2.y - pos.y);

  if (x >= 0 && y >= 0 && x < mapWidth && y < mapHeight) {
    return { x, y };
  }
}

function getEchoingAntinodes(pos: Pos, pos2: Pos) {
  const antinodes: Pos[] = [pos];

  let d = 1;
  let antinode: Pos;

  while ((antinode = getAntinode(pos, pos2, d))) {
    antinodes.push(antinode);
    d++;
  }

  return antinodes;
}

function part1() {
  const antinodes: Pos[] = Object.values(antennasByFrequency)
    .flatMap((positions) =>
      positions.flatMap((pos, i) =>
        positions
          .slice(i + 1)
          .flatMap((pos2) => [getAntinode(pos, pos2), getAntinode(pos2, pos)])
      )
    )
    .filter((antinode) => antinode);

  return countUniqueAntiNodes(antinodes);
}

function part2() {
  const antinodes: Pos[] = Object.values(antennasByFrequency)
    .flatMap((positions) =>
      positions.flatMap((pos, i) =>
        positions
          .slice(i + 1)
          .flatMap((pos2) => [
            ...getEchoingAntinodes(pos, pos2),
            ...getEchoingAntinodes(pos2, pos)
          ])
      )
    )
    .filter((antinode) => antinode);

  return countUniqueAntiNodes(antinodes);
}

console.log(part1());
console.log(part2());
