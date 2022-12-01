import { readInput } from '../read-input';

async function getInput(): Promise<Point[][]> {
  return (await readInput(__dirname))
    .split('\n')
    .map((line, y) =>
      line.split('').map((num, x) => ({ x, y, val: parseInt(num) }))
    );
}

interface Pos {
  y: number;
  x: number;
}

interface Point extends Pos {
  val: number;
}

class EnergyLevelGrid {
  private extent: Pos;
  size: number;

  constructor(private grid: Point[][]) {
    this.extent = {
      y: this.grid.length,
      x: this.grid[0].length
    };
    this.size = this.extent.y * this.extent.x;
  }

  // a b c
  // d   e
  // f g h

  private findNeighbors({ y, x }: Pos): Point[] {
    return [
      { x: x - 1, y: y - 1 }, // a
      { x: x, y: y - 1 }, // b
      { x: x + 1, y: y - 1 }, // c
      { x: x - 1, y }, // d
      { x: x + 1, y }, // e
      { x: x - 1, y: y + 1 }, // f
      { x: x, y: y + 1 }, // g
      { x: x + 1, y: y + 1 } // h
    ]
      .filter(
        (pos) =>
          pos.x >= 0 &&
          pos.y >= 0 &&
          pos.x < this.extent.x &&
          pos.y < this.extent.y
      )
      .map((pos) => this.grid[pos.y][pos.x]);
  }

  step(): number {
    this.increaseEnergyLevels(this.grid.flat());
    this.flash();
    return this.reset();
  }

  private increaseEnergyLevels(points: Point[]) {
    points.forEach((point) => {
      point.val += 1;
    });
  }

  private flash(): void {
    const flashingPoints = this.grid.flatMap((row) =>
      row.filter(({ val }) => val === 10)
    );

    this.increaseEnergyLevels(flashingPoints);

    if (flashingPoints.length) {
      flashingPoints.forEach((point) => {
        const neighbors = this.findNeighbors(point).filter(
          ({ val }) => val !== 10
        );
        this.increaseEnergyLevels(neighbors);
      });

      this.flash();
    }
  }

  private reset(): number {
    const pointsThatFlashed = this.grid.flatMap((row) =>
      row.filter(({ val }) => val > 10)
    );

    pointsThatFlashed.forEach((point) => {
      point.val = 0;
    });

    return pointsThatFlashed.length;
  }
}

async function main() {
  const input = await getInput();
  const grid = new EnergyLevelGrid(input);

  /* Task 1 */
  // let flashes = 0;
  // for (let i = 0; i < 100; i++) {
  //   const add = grid.step();
  //   flashes += add;
  // }
  // console.log(flashes);

  /* Task 2 */
  let currentFlashes = 0;
  let steps = 0;
  while (currentFlashes < grid.size) {
    currentFlashes = grid.step();
    steps += 1;
  }

  console.log(steps);
}

main();
