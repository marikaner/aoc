import { readInput } from '../read-input';

async function getInput(): Promise<number[]> {
  return (await readInput(__dirname)).split(',').map((num) => parseInt(num));
}

function proceedOneDay(fish: number[]): number[] {
  return fish.flatMap((days) => (days ? [days - 1] : [6, 8]));
}

async function getFish(fish: number[]) {
  for (let i = 0; i < 18; i++) {
    fish = proceedOneDay(fish);
    console.log(i, fish);
  }
  return fish;
}

async function calculateDescendants(
  fish: number[],
  days: number
): Promise<number> {
  const numOfDayByAge: Record<number, number> = {};
  for (let i = 1; i < 7; i++) {
    numOfDayByAge[i] = getNumberOfChildren(days + (7 - i)) + 1;
  }
  return fish.reduce((sum, fishDays) => sum + numOfDayByAge[fishDays], 0);
}

function getNumberOfChildren(productiveDays: number): number {
  const directChildren = Math.floor((productiveDays - 1) / 7);
  let descendants = 0;
  for (let i = 0; i < directChildren; i++) {
    const productiveDaysForChild = productiveDays - (i + 1) * 7 - 2;
    if (productiveDaysForChild <= 7) {
      break;
    }
    descendants += getNumberOfChildren(productiveDaysForChild);
  }

  return directChildren + descendants;
}

async function main() {
  const fish = await getInput();

  /* Task 1 */
  // console.log(await getFish(fish));

  /* Task 2 */
  console.log(await calculateDescendants(fish, 256)); // Duration: 126s
}

main();
