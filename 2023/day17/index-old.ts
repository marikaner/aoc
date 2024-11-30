import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const map = input
  .split('\n')
  .map((line) => line.split('').map((char) => parseInt(char)));
const height = map.length;
const width = map[0].length;

interface Pos {
  x: number;
  y: number;
}

// type Direction = 'N' | 'S' | 'E' | 'W';

interface Path extends Pos {
  // heatLoss: number;
  pathWindows: PathWindow[];
  visited: boolean;
}

interface PathWindow {
  heatLoss: number;
  window: Pos[];
}

// type PathPos = Path & Pos;

const visited: Path[][] = map.map((row, y) =>
  row.map((num, x) => ({
    visited: false,
    heatLoss: Number.MAX_SAFE_INTEGER,
    pathWindows: [],
    x,
    y
  }))
);

function isForbidden(pathWindow: Pos[], { x, y }: Pos) {
  if (pathWindow.length >= 4) {
    const { x: x1, y: y1 } = pathWindow[pathWindow.length - 1];
    const { x: x2, y: y2 } = pathWindow[pathWindow.length - 2];
    const { x: x3, y: y3 } = pathWindow[pathWindow.length - 3];
    const { x: x4, y: y4 } = pathWindow[pathWindow.length - 4];
    return (
      (x1 === x && x2 === x && x3 === x && x4 === x) ||
      (y1 === y && y2 === y && y3 === y && y4 === y)
    );
  }
}

function getEligibleNeighbors({ x, y }: Path) {
  return [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 }
  ].filter(
    ({ x, y }) =>
      x >= 0 && y >= 0 && x < width && y < height && !visited[y][x].visited
  );
}

function walk(path: Path, nextPaths: Path[] = []) {
  path.visited = true;
  const neighbors = getEligibleNeighbors(path).map(({ x, y }) => visited[y][x]);

  neighbors.forEach((neighbor) => {
    const eligiblePaths = path.pathWindows.filter(
      ({ window }) => !isForbidden(window, neighbor)
    );
    eligiblePaths.map((eligiblePath) => {
      const heatLoss = eligiblePath.heatLoss + map[neighbor.y][neighbor.x];
      if (neighbor.pathWindows.length) {
        const window = [...eligiblePath.window,{ x: neighbor.x, y: neighbor.y }];
        const eligibleNeighborNeighbors = getEligibleNeighbors(path).map(({ x, y }) => visited[y][x]).flatMap(n=> n.pathWindows.filter(({window}) => !isForbidden(window, n))).length
      }
      if (heatLoss < neighbor.heatLoss) {
        neighbor.heatLoss = heatLoss;
        const pathWindows = eligiblePaths.map((eligiblePath) => [
          ...eligiblePath,
          { x: neighbor.x, y: neighbor.y }
        ]);
        // pathWindow.shift();
        neighbor.pathWindows = pathWindows;
      }
    });
    if (eligiblePaths.length) {
       else if (heatLoss === neighbor.heatLoss) {
        const pathWindows = eligiblePaths.map((eligiblePath) => [
          ...eligiblePath,
          { x: neighbor.x, y: neighbor.y }
        ]);
        neighbor.pathWindows.push(...pathWindows);
      }
    }
    neighbor.pathWindows.forEach((p) => {
      if (p.length > 4) {
        p.shift();
      }
    });
    neighbor.pathWindows = neighbor.pathWindows.reduce((allWindows, window) => {
      if (
        !allWindows.find((w) =>
          w.every((p, i) => p.x === window[i].x && p.y === window[i].y)
        )
      ) {
        allWindows.push(window);
      }
      return allWindows;
    }, [] as Pos[][]);
  });

  visited[path.y][path.x].visited = true;

  nextPaths = [...nextPaths, ...neighbors]
    .filter((p) => !p.visited)
    .sort((a, b) => a.heatLoss - b.heatLoss);

  if (nextPaths.length) {
    walk(nextPaths[0], nextPaths.slice(1));
  }
}

function part1() {
  const start = visited[0][0];
  // start.heatLoss = map[0][0];
  start.pathWindows.push({ window: [{ x: 0, y: 0 }], heatLoss: map[0][0] });
  walk(start);
  return visited[height - 1][width - 1];
}

function part2() {}

console.log(part1());
console.log(part2());
