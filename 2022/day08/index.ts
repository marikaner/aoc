import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const trees = input.split('\n').map((row) => row.split(''));

function reverseGrid(grid: any[][]): any[][] {
  return grid.map((row) => row.reverse()).reverse();
}

function findVisibleTrees(): any[][] {
  function markVisible(grid: any[][], visible: boolean[][]): any[][] {
    visible[0] = visible[0].map(() => true);
    const highestTreesCol = grid[0];

    for (let rowI = 1; rowI < grid.length - 1; rowI++) {
      const row = grid[rowI];
      let highestTreeRow = row[0];
      visible[rowI][0] = true;

      for (let colI = 1; colI < row.length - 1; colI++) {
        const tree = row[colI];
        if (tree > highestTreeRow) {
          highestTreeRow = tree;
          visible[rowI][colI] = true;
        }
        if (tree > highestTreesCol[colI]) {
          highestTreesCol[colI] = tree;
          visible[rowI][colI] = true;
        }
      }
    }
    return visible;
  }

  const visible = markVisible(
    trees,
    trees.map((row) => row.map(() => false))
  );
  return markVisible(reverseGrid(trees), reverseGrid(visible));
}

function calcScore(rowI, colI, grid) {
  if (
    rowI === 0 ||
    colI === 0 ||
    rowI === grid.length - 1 ||
    colI === grid.length - 1
  ) {
    return 0;
  }
  const tree = grid[rowI][colI];

  let i = colI + 1;
  while (i < grid.length - 1 && grid[rowI][i] < tree) {
    i++;
  }
  const scoreRight = i - colI;

  i = colI - 1;
  while (i > 0 && grid[rowI][i] < tree) {
    i--;
  }
  const scoreLeft = colI - i;

  i = rowI + 1;
  while (i < grid.length - 1 && grid[i][colI] < tree) {
    i++;
  }
  const scoreBottom = i - rowI;

  i = rowI - 1;
  while (i > 0 && grid[i][colI] < tree) {
    i--;
  }
  const scoreTop = rowI - i;

  return scoreTop * scoreBottom * scoreLeft * scoreRight;
}

function task1() {
  return findVisibleTrees()
    .flat()
    .reduce((sum, visible) => sum + visible, 0);
}

function task2() {
  const scores = trees.flatMap((row, rowI) =>
    row.map((_, colI) => calcScore(rowI, colI, trees))
  );

  return Math.max(...scores);
}

console.log(task1());
console.log(task2());
