import { readInput } from '../read-input';

async function getInput(): Promise<Line[]> {
  return (await readInput(__dirname)).split('\n').map((line) => getLine(line));
}

interface Point {
  x: number;
  y: number;
}

interface Line {
  start: Point;
  end: Point;
}

function getPoint(pointStr: string): Point {
  const [x, y] = pointStr.split(',').map((coo) => parseInt(coo));
  return { x, y };
}

function getLine(lineStr: string): Line {
  const [start, end] = lineStr.split(' -> ');
  return { start: getPoint(start), end: getPoint(end) };
}

function isHorizontal(line: Line) {
  return line.start.y === line.end.y;
}

function isVertical(line: Line) {
  return line.start.x === line.end.x;
}

function range(start: number, end: number): number[] {
  if (start > end) {
    [start, end] = [end, start];
  }
  const enumeratedRange = [];
  for (let i = start; i <= end; i++) {
    enumeratedRange.push(i);
  }

  return enumeratedRange;
}

function getIncrement(start: number, end: number): number {
  const diff = end - start;
  return diff ? diff / Math.abs(diff) : diff;
}

function getPoints(line: Line) {
  const xIncrement = getIncrement(line.start.x, line.end.x);
  const yIncrement = getIncrement(line.start.y, line.end.y);

  let { x, y } = line.start;

  const points: Point[] = [];

  while (true) {
    points.push({ x, y });
    if (x === line.end.x && y === line.end.y) {
      break;
    }
    if (x !== line.end.x) {
      x += xIncrement;
    }
    if (y !== line.end.y) {
      y += yIncrement;
    }
  }

  return points;
}

function getStraightPoints(line: Line) {
  const [stat, dyn]: [keyof Point, keyof Point] = isHorizontal(line)
    ? ['y', 'x']
    : ['x', 'y'];

  return range(line.start[dyn], line.end[dyn]).map((dynVal) => ({
    [stat]: line.start[stat],
    [dyn]: dynVal
  }));
}

async function getOverlappingPoints() {
  /* Task 1 */
  // const lines = (await getInput()).filter(
  //   (line) => isHorizontal(line) || isVertical(line)
  // );
  const lines = await getInput();
  const allPoints = lines.flatMap((line) => getPoints(line));
  const grid: Record<number, Record<number, number>> = {};

  allPoints.forEach(({ x, y }) => {
    if (!grid[x]) {
      grid[x] = {};
    }

    if (!grid[x][y]) {
      grid[x][y] = 0;
    }

    grid[x][y] = grid[x][y] + 1;
  });

  const ys = Object.values(grid);
  const counts = ys.flatMap((yObj) => Object.values(yObj));
  const relevantCounts = counts.filter((count) => count > 1);
  return relevantCounts.length;
}

async function main() {
  console.log(await getOverlappingPoints());
}

main();
