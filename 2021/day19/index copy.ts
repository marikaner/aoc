import { match } from 'assert';
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

interface Vector extends Point {
  from: Point;
  to: Point;
}

interface Scanner {
  points: Point[];
}

function abs(point: Point): Point {
  return {
    x: Math.abs(point.x),
    y: Math.abs(point.y),
    z: Math.abs(point.z)
  };
}

function getVectors(scanner: Scanner): Vector[] {
  const vectors = [];
  for (let i = 0; i < scanner.points.length; i++) {
    const from = scanner.points[i];
    for (let k = i + 1; k < scanner.points.length; k++) {
      const to = scanner.points[k];
      const vector = {
        x: from.x - to.x,
        y: from.y - to.y,
        z: from.z - to.z,
        from,
        to
      };
      vectors.push(vector);
    }
  }
  return vectors;
}

function isEqual(point1: Point, point2: Point): boolean {
  return (
    point1.x === point2.x && point1.y === point2.y && point1.z === point2.z
  );
}

function compareValue(val1: number, val2: number): number {
  return val1 - val2;
}

function compare(point1: Point, point2: Point): number {
  if (point1.x === point2.x) {
    if (point1.y === point2.y) {
      return compareValue(point1.z, point2.z);
    }
    return compareValue(point1.y, point2.y);
  }
  return compareValue(point1.x, point2.x);
}

function getComparableValues(point: Point): number[] {
  const { x, y, z } = point;
  return [Math.abs(x), Math.abs(y), Math.abs(z)].sort((a, b) => a - b);
}

function arePossiblyEqual(point1: Point, point2: Point): boolean {
  const values1 = getComparableValues(point1);
  const values2 = getComparableValues(point2);

  for (let i = 0; i < 3; i++) {
    if (values1[i] !== values2[i]) {
      return false;
    }
  }

  return true;
}

interface Match {
  vector: Vector;
  matches: Vector[];
}

function getMatches(scanners: Scanner[]): Match[] {
  const vectors1 = getVectors(scanners[0]);
  const vectors2 = getVectors(scanners[1]);
  const matches: Match[] = [];

  vectors1.forEach((vec1) => {
    const possibleDuplicates = vectors2.filter((vec2) =>
      arePossiblyEqual(vec1, vec2)
    );
    if (possibleDuplicates.length) {
      matches.push({
        vector: vec1,
        matches: possibleDuplicates
      });
    }
  });
  return matches;
}

interface Transformer {
  point1: Point;
  point2: Point;
  transformation: Transformation;
}

interface Transformation {
  x: 'x' | 'y' | 'z';
  y: 'x' | 'y' | 'z';
  z: 'x' | 'y' | 'z';
  xFactor: number;
  yFactor: number;
  zFactor: number;
}

function sign(num: number): 1 | -1 {
  return num >= 0 ? 1 : -1;
}

function getTransformers(point1: Point, point2: Point): Transformer[] {}

function findPossibleTransformations(vectorMatches: Match[]) {
  const transformationFactors = [];
  vectorMatches.forEach(({ vector, matches }) => {
    matches.forEach((match) => {
      const possibleXOrientations = [];
      const possibleYOrientations = [];
      const possibleZOrientations = [];
      if (Math.abs(vector.x) !== Math.abs(match.x)) {
        possibleXOrientations.push('x');
      }
      if (Math.abs(vector.x) !== Math.abs(match.y)) {
        possibleXOrientations.push('y');
      }
      if (Math.abs(vector.x) !== Math.abs(match.z)) {
        possibleXOrientations.push('y');
      }
      if (Math.abs(vector.y) !== Math.abs(match.x)) {
        possibleYOrientations.push('x');
      }
      if (Math.abs(vector.y) !== Math.abs(match.y)) {
        possibleYOrientations.push('y');
      }
      if (Math.abs(vector.y) !== Math.abs(match.z)) {
        possibleYOrientations.push('y');
      }
      if (Math.abs(vector.z) !== Math.abs(match.x)) {
        possibleZOrientations.push('x');
      }
      if (Math.abs(vector.z) !== Math.abs(match.y)) {
        possibleZOrientations.push('y');
      }
      if (Math.abs(vector.z) !== Math.abs(match.z)) {
        possibleZOrientations.push('y');
      }
    });
  });
}

function findTransformation(vec1: Vector, vec2: Vector) {
  const possibleXOrientations = [];
  const possibleYOrientations = [];
  const possibleZOrientations = [];
  if (Math.abs(vec1.x) !== Math.abs(vec2.x)) {
    possibleXOrientations.push('x');
  }
  if (Math.abs(vec1.x) !== Math.abs(vec2.y)) {
    possibleXOrientations.push('y');
  }
  if (Math.abs(vec1.x) !== Math.abs(vec2.z)) {
    possibleXOrientations.push('y');
  }
  if (Math.abs(vec1.y) !== Math.abs(vec2.x)) {
    possibleYOrientations.push('x');
  }
  if (Math.abs(vec1.y) !== Math.abs(vec2.y)) {
    possibleYOrientations.push('y');
  }
  if (Math.abs(vec1.y) !== Math.abs(vec2.z)) {
    possibleYOrientations.push('y');
  }
  if (Math.abs(vec1.z) !== Math.abs(vec2.x)) {
    possibleZOrientations.push('x');
  }
  if (Math.abs(vec1.z) !== Math.abs(vec2.y)) {
    possibleZOrientations.push('y');
  }
  if (Math.abs(vec1.z) !== Math.abs(vec2.z)) {
    possibleZOrientations.push('y');
  }
  possibleXOrientations.forEach(x => {
    possibleYOrientations.forEach(y => {
      possibleZOrientations.forEach(z => {
        
      })
    })
  })
}

async function main() {
  const scanners = await getInput();
  console.log(scanners.map((s) => getVectors(s)));
  const matches = getMatches(scanners);
  console.log(matches);
  console.log(matches.length);
}

main();
