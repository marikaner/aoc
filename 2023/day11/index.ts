import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);
const image = input.split('\n').map((line) => line.split(''));

interface Pos {
  x: number;
  y: number;
}

function getEmptyCols(img: string[][]) {
  const width = img[0].length;
  const emptyCols = [];
  for (let col = 0; col < width; col++) {
    if (img.every((line) => line[col] === '.')) {
      emptyCols.push(col);
    }
  }
  return emptyCols;
}

function getEmptyRows(img: string[][]) {
  const emptyRows = [];
  img.forEach((line, row) => {
    if (line.every((char) => char === '.')) {
      emptyRows.push(row);
    }
  });
  return emptyRows;
}

function getGalaxyPositions(emptyFactor = 2): Pos[] {
  const emptyCols = getEmptyCols(image);
  const emptyRows = getEmptyRows(image);
  const positions = [];
  image.forEach((line, y) =>
    line.forEach((val, x) => {
      if (val === '#') {
        let col = 0;
        while (emptyCols[col] < x) {
          col++;
        }
        let row = 0;
        while (emptyRows[row] < y) {
          row++;
        }
        positions.push({
          x: x + col * (emptyFactor - 1),
          y: y + row * (emptyFactor - 1)
        });
      }
    })
  );
  return positions;
}

function getGalaxyDistances(galaxies: Pos[]) {
  return galaxies
    .map((g1, i) =>
      galaxies
        .slice(i + 1)
        .map((g2) => Math.abs(g1.x - g2.x) + Math.abs(g1.y - g2.y))
    )
    .flat();
}

function part1() {
  return sum(getGalaxyDistances(getGalaxyPositions()));
}

function part2() {
  return sum(getGalaxyDistances(getGalaxyPositions(1000000)));
}

console.log(part1());
console.log(part2());
