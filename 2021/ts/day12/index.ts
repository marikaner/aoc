import { readInput } from '../read-input';

async function getInput(): Promise<string[][]> {
  return (await readInput(__dirname))
    .split('\n')
    .map((line) => line.split('-'));
}

function isSmallCave(cave: string): boolean {
  return cave.toLocaleLowerCase() === cave;
}

class CaveMap {
  public connections: Record<string, string[]>;
  constructor(connections: string[][]) {
    this.connections = {};
    connections.forEach(([cave1, cave2]) => {
      if (cave2 !== 'start' && cave1 !== 'end') {
        if (!this.connections[cave1]) {
          this.connections[cave1] = [];
        }
        this.connections[cave1].push(cave2);
      }
      if (cave1 !== 'start' && cave2 !== 'end') {
        if (!this.connections[cave2]) {
          this.connections[cave2] = [];
        }
        this.connections[cave2].push(cave1);
      }
    });
  }

  getPaths(): string[][] {
    return this.findPaths('start', []);
  }

  getExtendedPaths(): string[] {
    const extraCaves = [...Object.keys(this.connections), undefined].filter(
      (cave) => cave !== 'start'
    );
    const paths = extraCaves.flatMap((extraCave) =>
      this.findPaths('start', [], extraCave).map((path) =>
        ['start', ...path].join(',')
      )
    );
    return [...new Set(paths)];
  }

  private findPaths(
    startCave: string,
    seenCaves: string[],
    extraCave?: string
  ): string[][] {
    const nextCaves = this.connections[startCave].filter(
      (nextCave) =>
        !isSmallCave(nextCave) ||
        !seenCaves.includes(nextCave) ||
        (extraCave === nextCave &&
          seenCaves.filter((cave) => cave === nextCave).length < 2)
    );

    return nextCaves.flatMap((nextCave) => {
      if (nextCave === 'end') {
        return [[nextCave]];
      }
      const nextPaths = this.findPaths(
        nextCave,
        [...seenCaves, ...(isSmallCave(nextCave) ? [nextCave] : [])],
        extraCave
      );

      return nextPaths.map((next) => [nextCave, ...next]);
    });
  }
}

async function main() {
  const input = await getInput();

  const caves = new CaveMap(input);
  /* Task 1 */
  // const paths = caves.getPaths();
  // console.log(paths);

  /* Task 2 */
  const extraPaths = caves.getExtendedPaths();
  console.log(extraPaths.length);
}

main();
