import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const rucksacks = input.split('\n');

function getPriority(item) {
  return item === item.toLowerCase()
    ? item.charCodeAt(0) - 96
    : item.charCodeAt(0) - 64 + 26;
}

function task1() {
  return rucksacks
    .map((rucksack) => {
      const compartmentSize = rucksack.length / 2;
      const compartment1 = rucksack.slice(0, compartmentSize);
      const compartment2 = rucksack.slice(compartmentSize);

      const sharedItem = compartment1
        .split('')
        .find((item) => compartment2.includes(item));

      return getPriority(sharedItem);
    })
    .reduce((sum, itemPrio) => sum + itemPrio, 0);
}

function task2() {
  return rucksacks
    .reduce(
      (groups, rucksack) => {
        const currentGroup = groups.slice(-1)[0];
        if (!currentGroup.length || currentGroup.length % 3) {
          currentGroup.push(rucksack);
        } else {
          groups.push([rucksack]);
        }
        return groups;
      },
      [[]]
    )
    .map(([rucksack1, rucksack2, rucksack3]) => {
      const sharedItem = rucksack1
        .split('')
        .find((item) => rucksack2.includes(item) && rucksack3.includes(item));

      return getPriority(sharedItem);
    })
    .reduce((sum, itemPrio) => sum + itemPrio, 0);
}

// console.log(task1());
// console.log(task2());
