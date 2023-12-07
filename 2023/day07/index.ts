import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

const hands = input.split('\n').map((line) => {
  const [hand, rawBid] = line.split(' ');
  return { hand, bid: parseInt(rawBid) };
});

const typeScoring = {
  fiveOfAKind: 6,
  fourOfAKind: 5,
  fullHouse: 4,
  threeOfAKind: 3,
  twoPair: 2,
  onePair: 1,
  highCard: 0
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

function getRepeatedChar(hand: string, times: number): string | undefined {
  const match = hand.match(new RegExp(`(.)(.*\\1.*){${times - 1}}`));
  return match?.[1];
}

function getJokers(hand: string): number {
  return hand.split('').filter((char) => char === 'J').length;
}

function getTypeScore(hand: string, includeJokers: boolean) {
  let jokers = 0;
  if (includeJokers) {
    jokers = getJokers(hand);
    hand = hand.replaceAll('J', '');
  }

  let repeatedChar;
  if (jokers === 5 || getRepeatedChar(hand, 5 - jokers)) {
    return typeScoring.fiveOfAKind;
  }
  if (jokers === 4 || getRepeatedChar(hand, 4 - jokers)) {
    return typeScoring.fourOfAKind;
  }
  if (jokers === 3 || (repeatedChar = getRepeatedChar(hand, 3 - jokers))) {
    const reducedHand = hand.replaceAll(repeatedChar, '');
    return getRepeatedChar(reducedHand, 2)
      ? typeScoring.fullHouse
      : typeScoring.threeOfAKind;
  }
  if (jokers === 2 || (repeatedChar = getRepeatedChar(hand, 2 - jokers))) {
    const reducedHand = hand.replaceAll(repeatedChar, '');
    return getRepeatedChar(reducedHand, 2)
      ? typeScoring.twoPair
      : typeScoring.onePair;
  }
  return typeScoring.highCard;
}

function compareTypes(handA: string, handB: string, includeJokers: boolean) {
  return (
    getTypeScore(handA, includeJokers) - getTypeScore(handB, includeJokers)
  );
}

function compareHands(handA: string, handB: string, includeJokers = false) {
  return (
    compareTypes(handA, handB, includeJokers) || compareCards(handA, handB)
  );
}

function compareCards(handA: string, handB: string) {
  const i = handA.split('').findIndex((char, i) => char !== handB[i]);
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
