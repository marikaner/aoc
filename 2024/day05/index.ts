import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

const [rawRules, rawUpdate] = input.split('\n\n');
const rules = rawRules
  .split('\n')
  .map((rule) => rule.split('|') as [string, string]);
const updates = rawUpdate.split('\n').map((update) => update.split(','));

function isRuleRespected(rule: [string, string], update: string[]) {
  const pageIndices = rule.map((page) => update.findIndex((p) => p === page));
  return pageIndices.includes(-1) || pageIndices[1] >= pageIndices[0];
}

function getMiddlePageSum(updates: string[][]) {
  return sum(
    updates.map((update) => parseInt(update[(update.length - 1) / 2]))
  );
}

function part1() {
  const correctUpdates = updates.filter((update) =>
    rules.every((rule) => isRuleRespected(rule, update))
  );

  return getMiddlePageSum(correctUpdates);
}

function findIncorrectPageIndexPair(update: string[]) {
  const rule = rules.find((rule) => !isRuleRespected(rule, update));
  return rule?.map((page) => update.findIndex((p) => p === page)) as
    | [number, number]
    | undefined;
}

function swapPages(update: string[], [i1, i2]: [number, number]) {
  const [page1, page2] = [update[i1], update[i2]];
  update[i1] = page2;
  update[i2] = page1;
}

function part2() {
  const incorrectUpdates = updates.filter((update) =>
    rules.some((rule) => !isRuleRespected(rule, update))
  );

  incorrectUpdates.forEach((update) => {
    let incorrectPageIndexPair;
    while ((incorrectPageIndexPair = findIncorrectPageIndexPair(update))) {
      swapPages(update, incorrectPageIndexPair);
    }
  });

  return getMiddlePageSum(incorrectUpdates);
}

console.log(part1());
console.log(part2());
