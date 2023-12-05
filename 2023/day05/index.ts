import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const [rawSeeds, ...rawMaps] = input.split('\n\n');
const seeds = rawSeeds
  .split('seeds: ')[1]
  .split(' ')
  .map((num) => parseInt(num));

const maps = rawMaps.map((part) =>
  part
    .split('\n')
    .slice(1)
    .map((line) => {
      const [target, source, range] = line
        .split(' ')
        .map((num) => parseInt(num));
      return { target, source, range };
    })
    .sort((a, b) => a.source - b.source)
);

function part1() {
  const locations = seeds.map((seed) =>
    maps.reduce((id, map) => {
      const entry = map.find(
        ({ source, range }) => id >= source && id < source + range
      );
      return entry ? entry.target - entry.source + id : id;
    }, seed)
  );
  return Math.min(...locations);
}

interface RangedId {
  id: number;
  range: number;
}

interface Entry {
  range: number;
  source?: number;
  target?: number;
}

function getNextRangedId(
  min: number,
  max: number,
  { range, target = 0, source = 0 }: Entry
) {
  const maxMappableId = source + range;
  const maxValidId = Math.min(maxMappableId, max);

  return {
    id: target - source + min,
    range: maxValidId - min
  };
}

function part2() {
  const rangedSeedIds: RangedId[] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    const id = seeds[i];
    const range = seeds[i + 1];
    rangedSeedIds.push({ id, range });
  }

  const locations = rangedSeedIds.map((rangedSeedId) =>
    maps.reduce(
      (ids, map) => {
        const mappedIds: RangedId[] = [];
        ids.forEach((rangedId) => {
          let min = rangedId.id;
          const max = rangedId.id + rangedId.range;
          for (const entry of map) {
            if (min < entry.source) {
              const newRangedId = getNextRangedId(min, max, {
                range: entry.source
              });
              mappedIds.push(newRangedId);
              min += newRangedId.range;
            }
            if (min >= entry.source && min < entry.source + entry.range) {
              const newRangedId = getNextRangedId(min, max, entry);
              mappedIds.push(newRangedId);
              min += newRangedId.range;
            }
            if (max < entry.source || min === max) {
              break;
            }
          }
          if (min < max) {
            mappedIds.push({
              id: min,
              range: max - min
            });
          }
        });
        return mappedIds;
      },
      [rangedSeedId]
    )
  );
  return Math.min(...locations.flat().map(({ id }) => id));
}

console.log(part1());
console.log(part2());
