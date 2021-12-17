import { readInput } from '../read-input';

async function getInput(): Promise<string[][]> {
  return (await readInput(__dirname)).split('\n').map((line) => line.split(''));
}
const openToClosed: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>'
};

type CorruptedResult = {
  state: 'corrupted';
  unexpectedChar: string;
};

type IncompleteResult = {
  state: 'incomplete';
  autocorrection: string[];
};

type ValidationResult = CorruptedResult | IncompleteResult | undefined;

function validateLine(line: string[]): ValidationResult {
  const expectedClosingBrackets = [];

  for (let char of line) {
    if (openToClosed[char]) {
      expectedClosingBrackets.push(openToClosed[char]);
      continue;
    }

    const expectedChar = expectedClosingBrackets.pop();

    if (char !== expectedChar) {
      // console.log(`Expected ${expectedChar}, but found ${char} instead.`);
      return {
        state: 'corrupted',
        unexpectedChar: char
      };
    }
  }

  if (expectedClosingBrackets.length) {
    return {
      state: 'incomplete',
      autocorrection: expectedClosingBrackets.reverse()
    };
  }
}

function calculateCorruptionScore(
  validationResults: ValidationResult[]
): number {
  const corrupted = validationResults
    .filter((res) => res?.state === 'corrupted')
    .map((res) => (res as CorruptedResult).unexpectedChar);

  const scores = {
    ')': 3 * countOccurrences(corrupted, ')'),
    ']': 57 * countOccurrences(corrupted, ']'),
    '}': 1197 * countOccurrences(corrupted, '}'),
    '>': 25137 * countOccurrences(corrupted, '>')
  };
  return Object.values(scores).reduce((sum, subscore) => sum + subscore, 0);
}

function calculateIncompletionScores(
  validationResults: ValidationResult[]
): number[] {
  const baseScores: Record<string, number> = { ')': 1, ']': 2, '}': 3, '>': 4 };
  const incomplete = validationResults
    .filter((res) => res?.state === 'incomplete')
    .map((res) => (res as IncompleteResult).autocorrection);

  return incomplete.map((line) =>
    line
      .map((char) => baseScores[char])
      .reduce((score, baseScore) => score * 5 + baseScore, 0)
  );
}

function countOccurrences(arr: any[], element: any): number {
  return arr.filter((res) => res === element).length;
}

async function main() {
  const input = await getInput();
  const validationResults = input.map((line) => validateLine(line));

  /* Task 1 */
  // console.log(calculateCorruptionScore(validationResults));

  /* Task 2 */
  const incompletionScores = calculateIncompletionScores(
    validationResults
  ).sort((a, b) => a - b);

  const middleIndex = (incompletionScores.length - 1) / 2;
  console.log(incompletionScores[middleIndex]);
}

main();
