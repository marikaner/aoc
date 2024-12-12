import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

let arrangement = input
  .split('\n')
  .map((line, y) =>
    line.split('').map((val, x) => ({ val, x, y, visited: false }))
  );

type Plant = {
  val: string;
  x: number;
  y: number;
  visited: boolean;
};

function getNeighbors(plant: Plant) {
  return [
    arrangement[plant.y - 1]?.[plant.x],
    arrangement[plant.y + 1]?.[plant.x],
    arrangement[plant.y][plant.x - 1],
    arrangement[plant.y][plant.x + 1]
  ];
}

function getNeighborsWithDirection(plant: Plant) {
  return {
    top: arrangement[plant.y - 1]?.[plant.x],
    bottom: arrangement[plant.y + 1]?.[plant.x],
    left: arrangement[plant.y][plant.x - 1],
    right: arrangement[plant.y][plant.x + 1]
  };
}

function measure(plant: Plant) {
  plant.visited = true;
  const neighbors = getNeighbors(plant);

  const perimeter = neighbors.filter(
    (neighbor) => neighbor?.val !== plant.val
  ).length;

  if (
    neighbors.every(
      (neighbor) =>
        !neighbor ||
        plant.val !== neighbor.val ||
        (plant.val === neighbor.val && neighbor.visited)
    )
  ) {
    return { perimeter, area: 1 };
  }

  return neighbors
    .filter((neighbor) => neighbor?.val === plant.val)
    .reduce(
      (measurements, neighbor) => {
        if (!neighbor.visited) {
          const neighborMeasurements = measure(neighbor);
          return {
            perimeter: measurements.perimeter + neighborMeasurements.perimeter,
            area: measurements.area + neighborMeasurements.area
          };
        }
        return measurements;
      },
      { perimeter, area: 1 }
    );
}

function calculateFences(plant: Plant) {
  return Object.entries(getNeighborsWithDirection(plant))
    .filter(([, neighbor]) => neighbor?.val !== plant.val)
    .map(([dir]) => dir);
}

function collectRegion(plant: Plant) {
  plant.visited = true;
  const neighbors = getNeighbors(plant).filter(
    (neighbor) => neighbor?.val === plant.val && !neighbor.visited
  );

  const group = [plant];

  neighbors.forEach((neighbor) => {
    if (!neighbor.visited) {
      group.push(...collectRegion(neighbor));
    }
  });

  return group;
}

function getFences(plant: Plant | undefined, fences: string[][][]) {
  return fences[plant?.y]?.[plant?.x];
}

function setFences(plant: Plant, newFences: string[], fences: string[][][]) {
  return (fences[plant.y][plant.x] = newFences);
}

function transformFencesToOneSide(
  plant: Plant,
  fences: string[][][],
  dir: string
) {
  const [xDiff, yDiff] = dir === 'top' || dir === 'bottom' ? [1, 0] : [0, 1];

  [1, -1].forEach((sign) => {
    for (let i = 1, currentPlant: Plant, currentFences: string[]; true; i++) {
      currentPlant =
        arrangement[plant.y + yDiff * i * sign]?.[plant.x + xDiff * i * sign];
      currentFences = fences[currentPlant?.y]?.[currentPlant.x];
      if (currentPlant?.val === plant.val && currentFences?.includes(dir)) {
        fences[currentPlant.y][currentPlant.x] = getFences(
          currentPlant,
          fences
        ).filter((fence) => fence !== dir);
      } else {
        break;
      }
    }
  });
}

function transformFencesToSides(plant: Plant, fences: string[][][]) {
  getFences(plant, fences).forEach((dir) => {
    transformFencesToOneSide(plant, fences, dir);
  });
}

function part1() {
  return sum(
    arrangement
      .flat()
      .reduce(
        (measurements, plant) =>
          plant.visited ? measurements : [...measurements, measure(plant)],
        []
      )
      .map(({ perimeter, area }) => perimeter * area)
  );
}

function part2() {
  // clean up after part 1
  arrangement.flat().forEach((plant) => (plant.visited = false));

  const fences = arrangement.map((row) =>
    row.map((plant) => calculateFences(plant))
  );
  arrangement.flat().forEach((plant) => transformFencesToSides(plant, fences));

  return sum(
    arrangement
      .flat()
      .reduce(
        (acc, plant) => (plant.visited ? acc : [...acc, collectRegion(plant)]),
        []
      )
      .map(
        (group) =>
          sum(group.map((plant) => fences[plant.y][plant.x].length)) *
          group.length
      )
  );
}

console.log(part1());
console.log(part2());
