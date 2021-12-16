import { readInput } from '../read-input';

async function getInput(): Promise<number[][]> {
  return (await readInput(__dirname))
    .split('\n')
    .map((line) => line.split('').map((num) => parseInt(num)));
}

interface Pos {
  row: number;
  col: number;
}

interface Point extends Pos {
  val: number;
}

class HeightMap {
  constructor(private grid: number[][]) {}

  findNeighbors({ row, col }: Pos): Point[] {
    return [
      { row, col: col - 1 },
      { row, col: col + 1 },
      { row: row - 1, col },
      { row: row + 1, col }
    ]
      .filter(
        (pos) =>
          pos.col >= 0 &&
          pos.row >= 0 &&
          pos.col < this.extent.cols &&
          pos.row < this.extent.rows
      )
      .map((pos) => ({ ...pos, val: this.grid[pos.row][pos.col] }));
  }

  get extent(): { rows: number; cols: number } {
    return {
      rows: this.grid.length,
      cols: this.grid[0].length
    };
  }

  findLocalMinima(): Point[] {
    const minima = [];
    for (let row = 0; row < this.extent.rows; row++) {
      for (let col = 0; col < this.extent.cols; col++) {
        const val = this.grid[row][col];
        if (
          this.findNeighbors({ row, col }).every(
            ({ val: neighborVal }) => neighborVal > val
          )
        ) {
          minima.push({ row, col, val });
        }
      }
    }
    return minima;
  }

  private getBasinNeighbors(minimum: Point): Point[] {
    const basinNeighbors = this.findNeighbors(minimum).filter(
      ({ val: neighborVal }) => neighborVal > minimum.val && neighborVal !== 9
    );

    return [
      minimum,
      ...basinNeighbors.flatMap((neighbor) => this.getBasinNeighbors(neighbor))
    ];
  }

  findBasins(): Point[][] {
    return this.findLocalMinima().map((minimum) => {
      const visited: Record<number, Record<number, boolean>> = {};

      return this.getBasinNeighbors(minimum).filter(({ row, col }) => {
        const keep = !visited[row]?.[col];
        visited[row] = { ...visited[row], [col]: true };
        return keep;
      });
    });
  }

  calculateRiskLevel(): number {
    return this.findLocalMinima().reduce(
      (riskLevel, { val }) => riskLevel + val + 1,
      0
    );
  }
}

async function main() {
  const input = await getInput();

  const map = new HeightMap(input);
  /* Task 1 */
  // console.log(map.calculateRiskLevel());

  /* Task 2 */
  const biggestBasins = map
    .findBasins()
    .map((basin) => basin.length)
    .sort((a, b) => b - a)
    .slice(0, 3);
  console.log(biggestBasins.reduce((prod, factor) => prod * factor, 1));
}

main();
