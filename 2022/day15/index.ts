import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const positions = input.split('\n').map((line) => {
  const coordinatesStr = line.match(
    /Sensor at x=(?<sensorX>-?\d+), y=(?<sensorY>-?\d+): closest beacon is at x=(?<beaconX>-?\d+), y=(?<beaconY>-?\d+)/
  ).groups;

  const sensorX = parseInt(coordinatesStr.sensorX);
  const sensorY = parseInt(coordinatesStr.sensorY);
  const beaconX = parseInt(coordinatesStr.beaconX);
  const beaconY = parseInt(coordinatesStr.beaconY);
  const radius = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);

  return {
    sensorX,
    sensorY,
    radius
  };
});

function task1() {
  const y = 2000000;
  const impossiblePositions = new Set();

  positions.forEach(({ sensorX, sensorY, radius }) => {
    if (y >= sensorY - radius && y <= sensorY + radius) {
      const distanceX = radius - Math.abs(sensorY - y);
      for (let x = sensorX - distanceX; x <= sensorX + distanceX; x++) {
        impossiblePositions.add(x);
      }
    }
  });

  return impossiblePositions.size - 1;
}

function findBeacon(filledPositions: [number, number][][]): [number, number] {
  filledPositions = filledPositions.map((xRanges) =>
    xRanges.sort(([aStart], [bStart]) => aStart - bStart)
  );
  for (let y = 0; y < filledPositions.length; y++) {
    let x = 1;
    for (let i = 0; i < filledPositions[y].length; i++) {
      const [start, end] = filledPositions[y][i];
      if (x < start - 1) {
        return [x + 1, y];
      }
      x = Math.max(x, end);
    }
  }
}

function task2() {
  const maxCoord = 4000000;

  const filledPositions: [number, number][][] = [];
  positions.forEach(({ sensorX, sensorY, radius }) => {
    for (
      let y = Math.max(sensorY - radius, 0);
      y <= Math.min(sensorY + radius, maxCoord);
      y++
    ) {
      const distanceX = radius - Math.abs(sensorY - y);
      if (!filledPositions[y]) {
        filledPositions[y] = [];
      }
      filledPositions[y].push([
        Math.max(sensorX - distanceX, 0),
        Math.min(sensorX + distanceX, maxCoord)
      ]);
    }
  });
  const [x, y] = findBeacon(filledPositions);
  return x * maxCoord + y;
}

console.log(task1());
console.log(task2());
