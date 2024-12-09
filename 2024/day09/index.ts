import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

const blocks = input
  .split('')
  .map((length, i) => ({
    length: parseInt(length),
    id: i % 2 === 0 ? i / 2 : undefined
  }))
  .filter(({ length }) => length);

function calculateChecksum(
  defragmentedBlocks: { length: number; id: number }[]
) {
  return defragmentedBlocks.reduce(
    ({ sum, totalLength }, { length, id }) => {
      for (let i = 0; i < length; i++) {
        sum += totalLength * (id || 0);
        totalLength++;
      }
      return { sum, totalLength };
    },
    { sum: 0, totalLength: 0 }
  ).sum;
}

function part1() {
  const defragmentedBlocks = JSON.parse(JSON.stringify(blocks));
  let l;
  let r;
  while (
    (l = defragmentedBlocks.findIndex(({ id }) => id === undefined)) <
    (r = defragmentedBlocks.findLastIndex(({ id }) => id))
  ) {
    const left = defragmentedBlocks[l];
    const right = defragmentedBlocks[r];

    if (left.length >= right.length) {
      defragmentedBlocks.splice(r, 1);
      defragmentedBlocks.splice(l, 1, right, {
        length: left.length - right.length,
        id: undefined
      });
    } else if (left.length < right.length) {
      defragmentedBlocks.splice(l, 1, {
        length: left.length,
        id: right.id
      });
      right.length = right.length - left.length;
    }
  }
  return calculateChecksum(defragmentedBlocks);
}

function part2() {
  const defragmentedBlocks = JSON.parse(JSON.stringify(blocks));

  defragmentedBlocks
    .filter(({ id }) => id)
    .reverse()
    .forEach((right) => {
      const r = defragmentedBlocks.findLastIndex(({ id }) => id === right.id);
      let l = defragmentedBlocks
        .slice(0, r)
        .findIndex(
          ({ id, length }) => id === undefined && length >= right.length
        );

      if (l > 0) {
        const left = defragmentedBlocks[l];
        defragmentedBlocks.splice(r, 1, {
          length: right.length
        });
        defragmentedBlocks.splice(l, 1, right, {
          length: left.length - right.length
        });
      }
    });

  return calculateChecksum(defragmentedBlocks);
}

console.log(part1());
console.log(part2());
