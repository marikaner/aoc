import { readInput } from '../read-input.js';
import { sum } from '../util.js';

const input = await readInput(import.meta.url);

const games = input.split('\n').map((line) => {
  const [meta, game] = line.split(': ');
  const gameId = parseInt(meta.split(' ')[1]);
  const rounds = game.split('; ');
  return {
    id: gameId,
    minColors: rounds.reduce(
      (minColors, round) => {
        round.split(', ').forEach((amountColor) => {
          const [amount, color] = amountColor.split(' ');
          minColors[color] = Math.max(minColors[color], parseInt(amount));
        });
        return minColors;
      },
      { red: 0, blue: 0, green: 0 }
    )
  };
});

function part1() {
  return sum(
    games.filter(({ id, minColors }) => {
      return (
        minColors.red <= 12 && minColors.blue <= 14 && minColors.green <= 13
      );
    }),
    ({ id }) => id
  );
}

function part2() {
  return sum(
    games.map(({ id, minColors }) => {
      return minColors.red * minColors.blue * minColors.green;
    })
  );
}

console.log(part1());
console.log(part2());
