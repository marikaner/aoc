import { readInput } from '../read-input';

async function getInput(): Promise<{
  template: string[];
  rules: Record<string, string>;
}> {
  const [template, rules] = (await readInput(__dirname)).split('\n\n');
  return {
    template: template.split(''),
    rules: rules.split('\n').reduce((rulesObj, line) => {
      const [from, to] = line.split(' -> ');
      return {
        ...rulesObj,
        [from]: to
      };
    }, {})
  };
}

class Polymer {
  constructor(
    private template: string[],
    private rules: Record<string, string>
  ) {}

  private getInitialPairOccurrences(): Record<string, number> {
    return this.template.reduce(
      (occurrences, element, i) =>
        i < this.template.length - 1
          ? addToObject(occurrences, element + this.template[i + 1])
          : occurrences,
      {}
    );
  }

  private insert(
    pairOccurrences: Record<string, number>
  ): Record<string, number> {
    return Object.entries(pairOccurrences).reduce(
      (occurrences, [pair, currOccurrences]) => {
        const newElement = this.rules[pair];
        addToObject(occurrences, pair[0] + newElement, currOccurrences);
        addToObject(occurrences, newElement + pair[1], currOccurrences);
        return occurrences;
      },
      {}
    );
  }

  calculateOccurrences(iterations: number): Record<string, number> {
    let pairOccurrences = this.getInitialPairOccurrences();
    while (iterations) {
      pairOccurrences = this.insert(pairOccurrences);
      iterations--;
    }
    return Object.entries(pairOccurrences).reduce(
      (occurrences, [pair, pairOccurrences]) =>
        addToObject(occurrences, pair[1], pairOccurrences),
      { [this.template[0]]: 1 }
    );
  }

  private insertInFormula(formula: string[]): string[] {
    return formula.flatMap((element, i) => {
      return i < formula.length - 1
        ? [element, this.rules[element + formula[i + 1]]]
        : [element];
    });
  }

  simulateOccurrences(iterations: number): Record<string, number> {
    let formula = [...this.template];
    while (iterations) {
      formula = this.insertInFormula(formula);
      iterations--;
    }
    return formula.reduce(
      (occurrences, element) => addToObject(occurrences, element),
      {} as Record<string, number>
    );
  }
}

function getScore(occurrences: Record<string, number>): number {
  const sortedScores = Object.values(occurrences).sort((a, b) => a - b);
  return sortedScores[sortedScores.length - 1] - sortedScores[0];
}

function addToObject(
  obj: Record<string, number>,
  element: string,
  times = 1
): Record<string, number> {
  if (obj[element] === undefined) {
    obj[element] = 0;
  }
  obj[element] += times;
  return obj;
}

async function main() {
  const { template, rules } = await getInput();
  const polymer = new Polymer(template, rules);

  /* Task 1 */
  // console.log(getScore(polymer.simulateOccurrences(10)));

  /* Task 2 */
  console.log(getScore(polymer.calculateOccurrences(40)));
}

main();
