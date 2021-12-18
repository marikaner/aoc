import { readInput } from '../read-input';

async function getInput(): Promise<{ dots: Dots; folds: Fold[] }> {
  const [coordinates, folds] = (await readInput(__dirname))
    .split('\n\n')
    .map((block) => block.split('\n'));

  return {
    dots: coordinates
      .map((line) => line.split(',').map((coo) => parseInt(coo)))
      .reduce((paperObj, [x, y]) => {
        if (!paperObj[y]) {
          paperObj[y] = { y, xs: [] };
        }
        paperObj[y].xs.push(x);
        return paperObj;
      }, {} as Dots),
    folds: folds.map((fold) => {
      const [direction, position] = fold.split('=');
      return {
        direction: direction.endsWith('x') ? 'x' : 'y',
        position: parseInt(position)
      };
    })
  };
}

interface Dots {
  [y: string]: {
    xs: number[];
    y: number;
  };
}

interface Fold {
  direction: 'y' | 'x';
  position: number;
}

class Paper {
  constructor(private dots: Dots) {}

  foldUp(position: number): void {
    this.dots = Object.values(this.dots).reduce((foldedDots, { y, xs }) => {
      const [move, keep] = partition(xs, (x) => x > position);
      foldedDots[y] = {
        y,
        xs: [...new Set([...keep, ...move.map((x) => 2 * position - x)])]
      };
      return foldedDots;
    }, {} as Dots);
  }

  foldLeft(position: number): void {
    const foldedDots: Dots = {};
    const [move, keep] = partition(
      Object.values(this.dots),
      ({ y }) => y > position
    );

    keep.forEach((ys) => {
      foldedDots[ys.y] = ys;
    });
    move.forEach(({ y, xs }) => {
      const newX = 2 * position - y;
      if (!foldedDots[newX]) {
        foldedDots[newX] = { y: newX, xs: [] };
      }
      foldedDots[newX].xs = [...new Set([...foldedDots[newX].xs, ...xs])];
    });

    this.dots = foldedDots;
  }

  fold(fold: Fold): void {
    return fold.direction === 'x'
      ? this.foldUp(fold.position)
      : this.foldLeft(fold.position);
  }

  numberOfDots(): number {
    return Object.values(this.dots).flatMap(({ xs }) => xs).length;
  }

  private getExtent(): { x: number; y: number } {
    return Object.values(this.dots).reduce(
      (max, { y, xs }) => {
        const localXMax = xs.reduce((localMax, x) =>
          x > localMax ? x : localMax
        );

        return {
          x: localXMax > max.x ? localXMax : max.x,
          y: y > max.y ? y : max.y
        };
      },
      { x: 0, y: 0 }
    );
  }

  toString(): string {
    let str = '';
    const { x: xMax, y: yMax } = this.getExtent();
    for (let y = 0; y <= yMax; y++) {
      const dots = this.dots[y]?.xs;
      for (let x = 0; x <= xMax; x++) {
        str += dots?.includes(x) ? '#' : '.';
      }
      str += '\n';
    }
    return str;
  }
}

function partition<T>(arr: T[], condition: (item: T) => boolean): T[][] {
  const conditionMet: T[] = [];
  const rest: T[] = [];
  arr.forEach((item) => {
    const pushTo = condition(item) ? conditionMet : rest;
    pushTo.push(item);
  });
  return [conditionMet, rest];
}

async function main() {
  const { dots, folds } = await getInput();

  const paper = new Paper(dots);

  folds.forEach((fold) => {
    paper.fold(fold);
  });

  console.log(paper.toString());
}

main();
