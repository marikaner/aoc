import { readInput } from '../read-input';

async function getInput(): Promise<Point[][]> {
  return (await readInput(__dirname))
    .split('\n')
    .map((line) =>
      line
        .split('')
        .map((risk) => ({ risk: parseInt(risk), totalRisk: Number.MAX_VALUE }))
    );
}

interface Point {
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
              ...xs.map((point) => repeatPoint(point, xRepeat + yRepeat))
            );
          }
          return newXs;
        })
      );
    }
    console.log(this.points.length);
  }

  getUnvisitedNeighbors({ x, y }: Pos): Point[] {
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
          pos.y < this.extent.y &&
          !this.points[y][x].visited
      )
      .map((pos) => this.points[pos.y][pos.x]);
  }

  findPathWithLowestRisk(): number {
    const start = { x: 0, y: 0 };
    const end = { x: this.extent.x - 1, y: this.extent.y - 1 };
    this.points[start.y][start.x].totalRisk = 0;
    this.points.forEach((xs, y) => {
      xs.forEach((point, x) => {
        this.getUnvisitedNeighbors({ x, y }).forEach((neighbor) => {
          neighbor.totalRisk = Math.min(
            neighbor.totalRisk,
            neighbor.risk + point.totalRisk
          );
        });
        point.visited = true;
      });
    });
    return this.points[end.y][end.x].totalRisk;
  }
}

function repeatPoint(point: Point, riskIncrease: number): Point {
  let risk = point.risk + riskIncrease;
  if (risk > 9) {
    risk %= 9;
  }
  return { ...point, risk };
}

async function main() {
  const positions = await getInput();
  // const cavern = new Cavern(positions);
  // console.log(cavern.findPathWithLowestRisk());

  const bigCavern = new Cavern(positions, 5);
  console.log(bigCavern.findPathWithLowestRisk());
}

main();
