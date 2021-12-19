import { readInput } from '../read-input';

async function getInput(): Promise<Point[][]> {
  return (await readInput(__dirname)).split('\n').map((line, y) =>
    line.split('').map((risk, x) => ({
      risk: parseInt(risk),
      totalRisk: Number.MAX_VALUE,
      x,
      y
    }))
  );
}

interface Point extends Pos {
  risk: number;
  totalRisk: number;
  visited?: boolean;
}

interface Pos {
  x: number;
  y: number;
}

class Cavern {
  private extent: Pos;
  private points: Point[][] = [];

  constructor(points: Point[][], repeats = 1) {
    this.extent = {
      y: points.length * repeats,
      x: points[0].length * repeats
    };
    this.initPoints(points, repeats);
  }

  private initPoints(points: Point[][], repeats: number) {
    for (let yRepeat = 0; yRepeat < repeats; yRepeat++) {
      this.points.push(
        ...points.map((xs) => {
          const newXs: Point[] = [];
          for (let xRepeat = 0; xRepeat < repeats; xRepeat++) {
            newXs.push(
              ...xs.map((point) =>
                repeatPoint(point, xRepeat, yRepeat, {
                  y: points.length,
                  x: points[0].length
                })
              )
            );
          }
          return newXs;
        })
      );
    }
  }

  getNeighbors({ x, y }: Pos): Point[] {
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
      .map((pos) => this.points[pos.y][pos.x]);
  }

  findPathWithLowestRisk(): number {
    const start = { x: 0, y: 0 };
    const end = { x: this.extent.x - 1, y: this.extent.y - 1 };
    this.points[start.y][start.x].totalRisk = 0;
    const queue = [this.points[start.y][start.x]];
    while (queue.length) {
      const point = queue.shift()!;

      this.getNeighbors(point).forEach((neighbor) => {
        const risk = neighbor.risk + point.totalRisk;
        if (risk < neighbor.totalRisk) {
          neighbor.totalRisk = risk;
          queue.push(neighbor);
        }
      });
    }
    return this.points[end.y][end.x].totalRisk;
  }
}

function repeatPoint(
  point: Point,
  xRepeat: number,
  yRepeat: number,
  originalExtent: Pos
): Point {
  let risk = point.risk + xRepeat + yRepeat;
  if (risk > 9) {
    risk %= 9;
  }
  return {
    ...point,
    risk,
    x: point.x + xRepeat * originalExtent.x,
    y: point.y + yRepeat * originalExtent.y
  };
}

async function main() {
  const positions = await getInput();
  /* Task 1 */
  // const cavern = new Cavern(positions);
  // console.log(cavern.findPathWithLowestRisk());

  /* Task 2 */
  const bigCavern = new Cavern(positions, 5);
  console.log(bigCavern.findPathWithLowestRisk());
}

main();
