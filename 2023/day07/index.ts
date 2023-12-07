import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

const hands = input.split('\n').map((line) => {
  const [hand, bid] = line.split(' ');
  return { hand: hand.split(''), bid: parseInt(bid) };
});

const typeScoring = {
  /* high card */
  1: 0,
  /* one pair, two pairs -> 1 + 1 = 2 */
  2: 1,
  /* three of a kind, full house -> 1 + 3 = 5 */
  3: 3,
  /* four of a kind */
  4: 5,
  /* five of a kind */
  5: 6
};

const cardScoring = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2
};

function getTypeScore(hand: string[], useJokers: boolean): number {
  const charOccurrences = hand.reduce(
    (chars, char) => ({ ...chars, [char]: (chars[char] || 0) + 1 }),
    {} as Record<string, number>
  );

  let jokers = 0;
  if (useJokers) {
    jokers = charOccurrences.J || 0;
    charOccurrences.J = 0;
  }
  const [most, secondMost] = Object.values(charOccurrences).sort(
    (a, b) => b - a
  );
  return typeScoring[most + jokers] + (typeScoring[secondMost] || 0);
}

function compareTypes(handA: string[], handB: string[], useJokers: boolean) {
  return getTypeScore(handA, useJokers) - getTypeScore(handB, useJokers);
}

function compareHands(handA: string[], handB: string[], useJokers = false) {
  return compareTypes(handA, handB, useJokers) || compareCards(handA, handB);
}

function compareCards(handA: string[], handB: string[]) {
  const i = handA.findIndex((char, i) => char !== handB[i]);
  return cardScoring[handA[i]] - cardScoring[handB[i]];
}

function part1() {
  const rankedHands = hands
    .sort((a, b) => compareHands(a.hand, b.hand))
    .map(({ bid }, i) => bid * (i + 1));

  return sum(rankedHands);
}

function part2() {
  cardScoring.J = 1;

  const rankedHands = hands
    .sort((a, b) => compareHands(a.hand, b.hand, true))
    .map(({ bid }, i) => bid * (i + 1));

  return sum(rankedHands);
}

console.log(part1());
console.log(part2());
