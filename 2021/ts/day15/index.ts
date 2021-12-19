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
  constructor(private points: Point[][]) {
    this.extent = {
      y: this.points.length,
      x: this.points[0].length
    };
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
    this.points.forEach((ys, y) => {
      ys.forEach((point, x) => {
        const neighbors = this.getUnvisitedNeighbors({ x, y });
        neighbors.forEach((neighbor) => {
          const riskThroughCurrent = neighbor.risk + point.totalRisk;
          if (neighbor.totalRisk > riskThroughCurrent) {
            neighbor.totalRisk = riskThroughCurrent;
          }
        });
        point.visited = true;
      });
    });
    return this.points[end.y][end.x].totalRisk;
  }
}

async function main() {
  const positions = await getInput();
  const cave = new Cavern(positions);

  console.log(cave.findPathWithLowestRisk());
}

main();
