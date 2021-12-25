import { readInput } from '../read-input';

async function getInput(): Promise<SnailFishNum[]> {
  return (await readInput(__dirname)).split('\n').map((numStr) => {
    const digits: Digit[] = [];
    let level = 0;
    for (let char of numStr) {
      if (char === '[') {
        level++;
      } else if (char === ']') {
        level--;
      } else if (char !== ',') {
        digits.push({ level, value: parseInt(char) });
      }
    }
    return new SnailFishNum(digits);
  });
}

interface Digit {
  level: number;
  value: number;
}

class SnailFishNum {
  constructor(public digits: Digit[]) {}

  clone() {
    const digits = this.digits.map((digit) => ({ ...digit }));
    return new SnailFishNum(digits);
  }

  add(num: SnailFishNum): this {
    this.digits = [...this.digits, ...num.digits].map((digit) => ({
      ...digit,
      level: digit.level + 1
    }));
    return this.reduce();
  }

  private shouldExplode(index: number): boolean {
    const digit = this.digits[index];
    return digit ? digit.level > 4 : false;
  }
  private shouldSplit(index: number): boolean {
    const digit = this.digits[index];
    return digit ? digit.value > 9 : false;
  }

  private explode(index: number): void {
    const { value, level } = this.digits[index];
    if (index > 0) {
      this.digits[index - 1].value += value;
    }
    if (index < this.digits.length - 2) {
      this.digits[index + 2].value += this.digits[index + 1].value;
    }
    this.digits.splice(index, 2, { level: level - 1, value: 0 });
  }

  private split(index: number): void {
    const { value, level } = this.digits[index];
    this.digits.splice(
      index,
      1,
      { level: level + 1, value: Math.floor(value / 2) },
      { level: level + 1, value: Math.ceil(value / 2) }
    );
  }

  reduce(): this {
    for (let i = 0; i < this.digits.length; i++) {
      if (this.shouldExplode(i)) {
        this.explode(i);
      }
    }
    for (let i = 0; i < this.digits.length; i++) {
      if (this.shouldExplode(i)) {
        this.explode(i);
        i -= 2;
      } else if (this.shouldSplit(i)) {
        this.split(i);
        i--;
      }
    }
    return this;
  }

  toArray(digits: any[] = this.digits, level = 4): (number | any[])[] {
    const transformedDigits = [];
    for (let i = 0; i < digits.length; i++) {
      const digit = digits[i];
      const nextDigit = digits[i + 1];
      if (
        Array.isArray(digit) ||
        (digit.level === level &&
          (digit.level === nextDigit?.level || Array.isArray(nextDigit)))
      ) {
        transformedDigits.push([
          digit.value ?? digit,
          nextDigit.value ?? nextDigit
        ]);
        i++;
      } else {
        transformedDigits.push(digit);
      }
    }
    return level === 1
      ? transformedDigits[0]
      : this.toArray(transformedDigits, level - 1);
  }

  toString(): string {
    return JSON.stringify(this.toArray());
  }

  calculateMagnitude([left, right] = this.toArray()): number {
    const leftMagnitude =
      3 * (typeof left === 'number' ? left : this.calculateMagnitude(left));
    const rightMagnitude =
      2 * (typeof right === 'number' ? right : this.calculateMagnitude(right));
    return leftMagnitude + rightMagnitude;
  }
}

function getSum(numbers: SnailFishNum[]): SnailFishNum {
  const [head, ...tail] = numbers;
  return tail.reduce((sum, num) => sum.add(num), head);
}

function findMaxMagnitude(numbers: SnailFishNum[]): number {
  let max = 0;
  numbers.forEach((num1, i) => {
    numbers.forEach((num2, k) => {
      if (i !== k) {
        max = Math.max(
          max,
          num1.clone().add(num2.clone()).calculateMagnitude()
        );
      }
    });
  });
  return max;
}

async function main() {
  const numbers = await getInput();

  /* Task 1 */
  console.log(getSum(numbers).calculateMagnitude());

  /* Task 2 */
  console.log(findMaxMagnitude(numbers));
}

main();
