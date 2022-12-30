import { readInput } from '../read-input.js';

const input = await readInput(import.meta.url);

interface CubeSide {
  cube: [number, number, number];
  side: string;
  position: string;
}

const cubes = input
  .split('\n')
  .map((line) => line.split(',').map((val) => parseInt(val)));

function stringifySide(side: number[][]): string {
  return side.map((point) => point.join(',')).join(':');
}

function stringifyCube(cube: number[]): string {
  return cube.join(',');
}

const sideFactory = {
  front: (cube: number[]): number[][] => [
    [cube[0], cube[1], cube[2]],
    [cube[0], cube[1] + 1, cube[2]],
    [cube[0] + 1, cube[1], cube[2]]
  ],
  back: (cube: number[]): number[][] => [
    [cube[0], cube[1], cube[2] + 1],
    [cube[0], cube[1] + 1, cube[2] + 1],
    [cube[0] + 1, cube[1], cube[2] + 1]
  ],
  left: (cube: number[]): number[][] => [
    [cube[0], cube[1], cube[2]],
    [cube[0], cube[1] + 1, cube[2]],
    [cube[0], cube[1], cube[2] + 1]
  ],
  right: (cube: number[]): number[][] => [
    [cube[0] + 1, cube[1], cube[2]],
    [cube[0] + 1, cube[1] + 1, cube[2]],
    [cube[0] + 1, cube[1], cube[2] + 1]
  ],
  top: (cube: number[]): number[][] => [
    [cube[0], cube[1] + 1, cube[2]],
    [cube[0] + 1, cube[1] + 1, cube[2]],
    [cube[0] + 1, cube[1] + 1, cube[2] + 1]
  ],
  bottom: (cube: number[]): number[][] => [
    [cube[0], cube[1], cube[2]],
    [cube[0] + 1, cube[1], cube[2]],
    [cube[0] + 1, cube[1], cube[2] + 1]
  ]
};

function getSidesForCube(cube: number[]): string[] {
  return [
    sideFactory.front(cube),
    sideFactory.back(cube),
    sideFactory.left(cube),
    sideFactory.right(cube),
    sideFactory.top(cube),
    sideFactory.bottom(cube)
  ].map((side) => stringifySide(side));
}

const minCube = cubes.sort(
  (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]
)[0] as [number, number, number];

const neighborFactory = {
  top: (cube) => [cube[0], cube[1] + 1, cube[2]],
  bottom: (cube) => [cube[0], cube[1] - 1, cube[2]],
  left: (cube) => [cube[0] - 1, cube[1], cube[2]],
  right: (cube) => [cube[0] + 1, cube[1], cube[2]],
  front: (cube) => [cube[0], cube[1], cube[2] - 1],
  back: (cube) => [cube[0], cube[1], cube[2] + 1]
};

const oppositeSides = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
  front: 'back',
  back: 'front'
};

function visitCubeSide(
  cubeSide: CubeSide,
  surfaceSides: Record<string, boolean>
): CubeSide | undefined {
  if (!surfaceSides[cubeSide.side]) {
    surfaceSides[cubeSide.side] = true;
    return cubeSide;
  }
}

function getNeighboringSides(
  cube: [number, number, number],
  side: string,
  surfaceSides: Record<string, boolean>,
  cubes: Record<string, boolean>
): {
  cube: [number, number, number];
  position: string;
  side: string;
}[] {
  const relevantSides = Object.keys(oppositeSides).filter(
    (s) => s !== side && s !== oppositeSides[side]
  );

  return relevantSides
    .map((position) => {
      // front neighbors
      const virtualCube = neighborFactory[side](cube);
      let currCube = neighborFactory[position](virtualCube);
      let currSide = stringifySide(
        sideFactory[oppositeSides[position]](currCube)
      );
      let currPosition = oppositeSides[position];

      if (cubes[stringifyCube(currCube)] && currSide in surfaceSides) {
        return visitCubeSide(
          {
            cube: currCube,
            position: currPosition,
            side: currSide
          },
          surfaceSides
        );
      }

      // flat neighbors
      currCube = neighborFactory[position](cube);
      currSide = stringifySide(sideFactory[side](currCube));
      currPosition = side;

      if (cubes[stringifyCube(currCube)] && currSide in surfaceSides) {
        return visitCubeSide(
          {
            cube: currCube,
            position: currPosition,
            side: currSide
          },
          surfaceSides
        );
      }

      // cube sides
      currCube = cube;
      currSide = stringifySide(sideFactory[position](currCube));
      currPosition = position;

      if (cubes[stringifyCube(currCube)] && currSide in surfaceSides) {
        return visitCubeSide(
          {
            cube: currCube,
            position: currPosition,
            side: currSide
          },
          surfaceSides
        );
      }
    })
    .filter((position) => position) as any;
}

function getExternalSurfaceSides(surfaceSides: Record<string, boolean>) {
  const externalSurfaces = [];
  const availableCubes = cubes.reduce(
    (cubes, cube) => ({
      ...cubes,
      [stringifyCube(cube)]: true
    }),
    {}
  );
  let neighbors = [
    visitCubeSide(
      {
        cube: minCube,
        position: 'bottom',
        side: stringifySide(sideFactory.bottom(minCube))
      },
      surfaceSides
    )
  ];

  while (neighbors.length) {
    externalSurfaces.push(...new Set(neighbors.map(({ side }) => side)));

    neighbors = neighbors.flatMap((neighbor) =>
      getNeighboringSides(
        neighbor.cube,
        neighbor.position,
        surfaceSides,
        availableCubes
      )
    );
  }
  return new Set(externalSurfaces).size;
}

function getSurfaceSides() {
  const allSides = cubes.flatMap((cube) => getSidesForCube(cube));
  return allSides.filter(
    (side) => allSides.indexOf(side) === allSides.lastIndexOf(side)
  );
}

function task1() {
  return getSurfaceSides().length;
}

function task2() {
  return getExternalSurfaceSides(
    getSurfaceSides().reduce((obj, side) => ({ ...obj, [side]: false }), {})
  );
}

console.log(task1());
console.log(task2());
