import { readInput } from '../read-input';

async function getInput(): Promise<number[]> {
  return (await readInput(__dirname)).split(',').map((num) => parseInt(num));
}

function getPossiblePos(crabsPos: number[]): number[] {
  const max = crabsPos.sort()[crabsPos.length - 1];

  const pos = [];
  for (let i = 0; i < max; i++) {
    pos.push(i);
  }
  return pos;
}

function calculateFuel(crabsPos: number[], finalPos: number) {
  return crabsPos.reduce(
    (sum, pos) => sum + calculateFuelForDistance(Math.abs(pos - finalPos)),
    0
  );
}

function calculateFuelForDistance(distance: number) {
  /* Task 1 */
  // return distance;

  /* Task 2 */
  let fuel = 0;
  for (let i = 0; i <= distance; i++) {
    fuel += i;
  }
  return fuel;
}

async function main() {
  const crabsPos = await getInput();
  const possiblePos = getPossiblePos(crabsPos);

  console.log(
    Math.min(...possiblePos.map((pos: any) => calculateFuel(crabsPos, pos)))
  );
}

main();
