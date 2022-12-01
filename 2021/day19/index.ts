import { readInput } from '../read-input';

async function getInput(): Promise<Scanner[]> {
  return (await readInput(__dirname))
    .split('--- scanner')
    .slice(1)
    .map((scannerStr) => ({
      points: scannerStr
        .split('\n')
        .slice(1)
        .filter((line) => line != '')
        .map((pointStr) => {
          const [x, y, z] = pointStr
            .split(',')
            .map((coordinate) => parseInt(coordinate));
          return { x, y, z };
        })
    }));
}

interface Point {
  x: number;
  y: number;
  z: number;
}

interface Scanner {
  points: Point[];
}

interface AxisTransformation {
  transformedAxis: keyof Point;
  sign: 1 | -1;
  dist: number;
}

const axes = ['x', 'y', 'z'] as (keyof Point)[];
const signs: [1, -1] = [1, -1];

function getAxis(
  points: Point[],
  scanner: Scanner,
  axis: keyof Point,
  knownAxes: (keyof Point)[] = []
): AxisTransformation | void {
  let distances: Record<number, number> = {};

  for (let currAxis of axes.filter((axis) => !knownAxes.includes(axis))) {
    for (let sign of signs) {
      distances = {};
      for (let point1 of points) {
        for (let point2 of scanner.points) {
          const distance = point1[axis] - point2[currAxis] * sign;
          if (!distances[distance]) {
            distances[distance] = 0;
          }
          distances[distance] += 1;
          if (distances[distance] >= 6) {
            return {
              transformedAxis: currAxis,
              sign,
              dist: distance
            };
          }
        }
      }
    }
  }
}

// function getTranslation(scanner1: Scanner, scanner2: Scanner) {
//   const distances = getAxis(scanner1, scanner2);
//   console.log(JSON.stringify(distances, null, 2));
//   // const x = 'x'
//   // const y = 'y'
//   // const sign = 'pos'
//   for (let x of axes) {
//     for (let y of axes.filter((coordinate) => coordinate !== x)) {
//       for (let xSign of ['pos', 'neg']) {
//         for (let ySign of ['pos', 'neg']) {
//           if (
//             distances.x[x][xSign].every(
//               (distance, i) => distance === distances.y[y][ySign][i]
//             )
//           ) {
//             const z = axes.find((z) => z !== x && z !== y)!;
//             for (let zSign in ['pos', 'neg']) {
//               if (
//                 distances.x[x][xSign].every(
//                   (distance, i) => distance === distances.z[z][zSign][i]
//                 )
//               ) {
//                 return { x, y, z, xSign, ySign, zSign };
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }

function getUniquePoints(points: Point[]): Point[] {
  const uniquePoints: Record<
    number,
    Record<number, Record<number, boolean>>
  > = {};
  points.forEach(({ x, y, z }) => {
    uniquePoints[x] = uniquePoints[x] || {};
    uniquePoints[x][y] = uniquePoints[x][y] || {};
    uniquePoints[x][y][z] = true;
  });

  return Object.entries(uniquePoints).flatMap(([x, yz]) =>
    Object.entries(yz).flatMap(([y, zObj]) =>
      Object.keys(zObj).map((z) => ({
        x: parseInt(x),
        y: parseInt(y),
        z: parseInt(z)
      }))
    )
  );
}

function countPoints(scanners: Scanner[]): number {
  let points = [...scanners[0].points];

  // const remainingScanners = [...scanners];
  const queue = scanners.slice(1);
  while (queue.length) {
    const scanner = queue.shift()!;
    const xAxis = getAxis(points, scanner, 'x');
    if (xAxis) {
      const yAxis = getAxis(points, scanner, 'y', [xAxis.transformedAxis])!;
      const zAxis = getAxis(points, scanner, 'z', [
        xAxis.transformedAxis,
        yAxis.transformedAxis
      ])!;
      // const axes = { x: xAxis, y: yAxis, z: zAxis };
      scanner.points.forEach((point) => {
        const newPoint = {
          x: point[xAxis.transformedAxis] + xAxis.dist,
          y: point[yAxis.transformedAxis] + yAxis.dist,
          z: point[zAxis.transformedAxis] + zAxis.dist
        };
        points.push(newPoint);
      });
      points = getUniquePoints(points);
    } else {
      queue.push(scanner);
    }
  }

  console.log(points);
  console.log(points.length);

  return points.length;
}

async function main() {
  const scanners = await getInput();
  const distances = countPoints(scanners);
  // console.log(JSON.stringify(distances, null, 2));
}

main();
