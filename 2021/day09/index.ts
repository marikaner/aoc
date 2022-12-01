import { readInput } from '../read-input';

async function getInput(): Promise<number[][]> {
  return (await readInput(__dirname))
    .split('\n')
    .map((line) => line.split('').map((num) => parseInt(num)));
}

interface Pos {
  y: number;
  x: number;
}

interface Point extends Pos {
  val: number;
}

class HeightMap {
  private extent: Pos;

  constructor(private grid: number[][]) {
    this.extent = {
      y: this.grid.length,
      x: this.grid[0].length
    };
  }

  findNeighbors({ y, x }: Pos): Point[] {
    return [
      { y, x: x - 1 },
      { y, x: x + 1 },
      { y: y - 1, x },
      { y: y + 1, x }
    ]
      .filter(
        (pos) =>
          pos.x >= 0 &&
          pos.y >= 0 &&
          pos.x < this.extent.x &&
          pos.y < this.extent.y
      )
      .map((pos) => ({ ...pos, val: this.grid[pos.y][pos.x] }));
  }

  findLocalMinima(): Point[] {
    const minima: Point[] = [];
    this.grid.forEach((row, y) => {
      row.forEach((val, x) => {
        if (
          this.findNeighbors({ y, x }).every(
            ({ val: neighborVal }) => neighborVal > val
          )
        ) {
          minima.push({ y, x, val });
        }
      });
    });

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

      return this.getBasinNeighbors(minimum).filter(({ y, x }) => {
        const keep = !visited[y]?.[x];
        visited[y] = { ...visited[y], [x]: true };
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
