import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

function parseSprings(factor = 1) {
  return input.split('\n').map((line) => {
    const [parts, broken] = line.split(' ');

    let repeatedParts = parts;
    let repeatedBroken = broken;
    for (let i = 1; i < factor; i++) {
      repeatedParts += '?' + parts;
      repeatedBroken += ',' + broken;
    }

    return {
      parts: repeatedParts,
      broken: repeatedBroken.split(',').map((cond) => parseInt(cond))
    };
  });
}

interface State {
  i: number;
  currGroupLength: number;
  currGroupIndex: number;
}

interface Spring {
  parts: string;
  broken: number[];
}

function getNextStates(damaged: number[], state: State, part: string) {
  if (part === '?') {
    return [
      ...getNextStates(damaged, state, '#'),
      ...getNextStates(damaged, state, '.')
    ];
  }

  let { i, currGroupIndex, currGroupLength } = state;
  if (part === '#') {
    // is not in group
    if (!currGroupLength) {
      currGroupIndex++;
      // too many groups
      if (currGroupIndex === damaged.length) {
        return [];
      }
    }
    currGroupLength++;
    // group is too large
    if (currGroupLength > damaged[currGroupIndex]) {
      return [];
    }
    // is '.' and in group
  } else if (currGroupLength) {
    // group has correct size
    if (currGroupLength === damaged[currGroupIndex]) {
      currGroupLength = 0;
      // group is too small
    } else if (currGroupLength < damaged[currGroupIndex]) {
      return [];
    }
  }

  return [
    {
      i: i + 1,
      currGroupIndex,
      currGroupLength
    }
  ];
}

function isEndState(parts: string, i: number) {
  return i === parts.length || !/[?#]/.test(parts.slice(i));
}

function counts(damaged: number[], { currGroupIndex, currGroupLength }: State) {
  return (
    currGroupIndex === damaged.length - 1 &&
    (currGroupLength === damaged[currGroupIndex] || !currGroupLength)
  );
}

function countArrangements(
  spring: Spring,
  state: State = {
    i: 0,
    currGroupIndex: -1,
    currGroupLength: 0
  }
) {
  const cachedCount = getCachedCount(spring, state);
  if (cachedCount !== undefined) {
    return cachedCount;
  }
  const { parts, broken } = spring;
  if (isEndState(parts, state.i)) {
    return counts(broken, state) ? 1 : 0;
  }

  let count = 0;

  getNextStates(broken, state, parts[state.i]).forEach((state) => {
    count += countArrangements(spring, state);
  });
  cacheCount(spring, state, count);
  return count;
}

const cache = {};

function getCacheKey(
  { parts, broken }: Spring,
  { i, currGroupIndex, currGroupLength }: State
) {
  return [parts, broken.join(','), i, currGroupIndex, currGroupLength].join(
    ':'
  );
}

function getCachedCount(spring: Spring, state: State) {
  return cache[getCacheKey(spring, state)];
}

function cacheCount(spring: Spring, state: State, count: number) {
  cache[getCacheKey(spring, state)] = count;
}

function part1() {
  return sum(parseSprings().map((spring) => countArrangements(spring)));
}

function part2() {
  return sum(parseSprings(5).map((spring) => countArrangements(spring)));
}

console.log(part1());
console.log(part2());
