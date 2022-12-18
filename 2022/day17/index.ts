import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

interface RockTemplate {
  lines: boolean[][];
  height: number;
  width: number;
}

interface Rock {
  template: RockTemplate;
  pos: [number, number];
}

const rocks = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`
  .split('\n\n')
  .map((rock) => {
    const lines = rock
      .split('\n')
      .map((line) => line.split('').map((val) => (val === '#' ? true : false)))
      .reverse();
    return {
      lines,
      height: lines.length,
      width: lines[0].length
    };
  });

const rawJets = input.split('').map((jet) => (jet === '<' ? -1 : 1));
const jets = [...rawJets];

const emptyLine = [false, false, false, false, false, false, false];
const lines: boolean[][] = [];

// function move(rock) {
//   let pos = 2;
//   for (let i = 0; i < 3; i++) {
//     pos += jets.shift() === '<' ? -1 : +1;
//     if (pos < 0) {
//       pos = 0;
//     }
//     if (pos + rock.width > 7) {
//       pos = 7 - rock.width;
//     }
//   }

//   // const findStopLine(rock)
// }

function isBlockedSide(rock: Rock, xDiff: number): boolean {
  return rock.template.lines.some((rockLine, y) => {
    const line = lines[rock.pos[1] - y];
    const rockX =
      rock.pos[0] +
      (xDiff < 0 ? rockLine.indexOf(true) : rockLine.lastIndexOf(true));
    return line && line[rockX + xDiff];
  });
}

function push(rock: Rock) {
  if (!jets.length) {
    jets.push(...rawJets);
  }
  const xDiff = jets.shift();
  // console.log('push', xDiff);
  const isInBounds =
    xDiff < 0 ? rock.pos[0] > 0 : rock.pos[0] + rock.template.width < 7;
  const canPush = isInBounds && !isBlockedSide(rock, xDiff);

  if (canPush) {
    rock.pos[0] += xDiff;
    // console.log(rock.pos);
  } else {
    // console.log('push blocked');
  }
  return canPush;
}

function rest(rock: Rock) {
  // console.log('rest');
  const rockY = rock.pos[1];
  rock.template.lines.forEach((rockLine, y) => {
    let totalY = rockY - y;
    if (!lines[totalY]) {
      lines.unshift([...emptyLine]);
      totalY = 0;
      // lines[totalY] = [...emptyLine];
    }
    lines[totalY] = lines[totalY].map(
      (filled, x) => !!(filled || rockLine[x - rock.pos[0]])
    );
  });
}

function isAboveLines(rock: Rock): boolean {
  return !lines[rock.pos[1] + 1];
}

function reachedGround(rock: Rock): boolean {
  return lines.length - 1 === rock.pos[1];
}

function isBlockedDown(rock: Rock): boolean {
  return rock.template.lines.some((rockLine, y) => {
    const line = lines[rock.pos[1] - y + 1];

    return rockLine.some((isRock, x) => {
      const isFilled = line?.[rock.pos[0] + x];
      return isFilled && isRock;
    });
  });
}

// function fall(rock): boolean {
//   let canFall;
//   if (reachedGround(rock)) {
//     canFall = false;
//   } else if (isAboveLines(rock)) {
//     canFall = true;
//   } else if (!canFall) {
//     // canFall = !blocked;
//     let isBlocked = isBlockedDown(rock);
//     // if (!blocked) {
//     //   canFall = true;
//     //   blocked = newBlocked;
//     //   // return fall(rock, newBlocked);
//     // } else {
//     //   canFall = false;
//     // }

//     if (isBlocked && !wasPushed) {
//       console.log('fall blocked');
//       // lines.unshift([...emptyLine]);
//       push(rock);

//       // rock.pos[1] += 1;
//       isBlocked = isBlockedDown(rock);
//       // rock.pos[1] -= 1;
//       canFall = !isBlocked;
//       // if (!isBlocked)
//     } else {
//       canFall = true;
//     }
//   }

//   if (canFall) {
//     rock.pos[1] += 1;
//     console.log(rock.pos, blocked);
//     move(rock);
//   } else {
//     console.log('fall blocked');
//     rest(rock);
//   }
// }

function fall(rock: Rock, blocked = false) {
  const wasPushed = push(rock);

  // console.log('fall');
  let canFall;
  if (reachedGround(rock)) {
    canFall = false;
  } else if (isAboveLines(rock)) {
    canFall = true;
  } else if (!canFall) {
    // canFall = !blocked;
    let isBlocked = isBlockedDown(rock);
    // if (!blocked) {
    //   canFall = true;
    //   blocked = newBlocked;
    //   // return fall(rock, newBlocked);
    // } else {
    //   canFall = false;
    // }

    if (isBlocked && wasPushed && false) {
      // if (!isBlocked)
    } else {
      canFall = !isBlocked;
    }
  }

  if (canFall) {
    rock.pos[1] += 1;
    // console.log(rock.pos, blocked);
    fall(rock);
  } else {
    // console.log('fall blocked');
    rest(rock);
  }
}

function findRepeatableChunk(probe) {
  const repeatableChunk = [];
  probe = probe.reverse();
  for (let i = 0; i < probe.length; i++) {
    if (repeatableChunk.length) {
      if (
        probe
          .slice(i, i + repeatableChunk.length)
          .every((height, j) => height === repeatableChunk[j])
      ) {
        break;
      }
    }
    repeatableChunk.push(probe[i]);
  }
  return repeatableChunk;
}

function draw() {
  console.log(
    lines
      .map((line) => `|${line.map((filled) => (filled ? '#' : '.')).join('')}|`)
      .join('\n')
  );
}

function task1() {
  for (let i = 0; i < 2022; i++) {
    const rock = rocks[i % rocks.length];
    fall({ template: rock, pos: [2, -4] });
  }

  return lines.length;
}

function task2() {
  const totalTimes = 1000000000000;
  const probeTimes = 10000;
  const probe = [];
  let lastLength = 0;

  for (let i = 0; i < probeTimes; i++) {
    const rock = rocks[i % rocks.length];
    fall({ template: rock, pos: [2, -4] });
    if (!(i % rocks.length)) {
      probe.push(lines.length - lastLength);
      console.log(lines.length - lastLength);
      lastLength = lines.length;
    }
  }

  const chunk = findRepeatableChunk(probe);
  const chunkLength = chunk.length * 5;
  const chunkValue = chunk.reduce((sum, size) => sum + size, 0);
  const repeatableTimes = Math.floor((totalTimes - probeTimes) / chunkLength);
  const repeatedValue = repeatableTimes * chunkValue;
  const timesLeft = (totalTimes - probeTimes) % chunkLength;

  for (let i = totalTimes - timesLeft; i < totalTimes; i++) {
    const rock = rocks[i % rocks.length];
    fall({ template: rock, pos: [2, -4] });
  }
  return repeatedValue + lines.length;
}

// side effects
// console.log(task1());
console.log(task2());
