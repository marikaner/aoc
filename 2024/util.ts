export function sum<T>(
  arr: T[],
  access = (val: T, i?: number): number => val as number
) {
  return arr.reduce((sum, val, i) => sum + access(val, i), 0);
}

export function product<T>(
  arr: T[],
  access = (val: T, i?: number): number => val as number
) {
  return arr.reduce((sum, val, i) => sum * access(val, i), 1);
}

export function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export function sign(val: number): 1 | -1 {
  return val < 0 ? -1 : 1;
}

export function zip<T>(arr1: T[], arr2: T[]) {
  let result = [];
  let i;
  for (i = 0; i < arr1.length; i++) {
    if (arr1[i]) {
      result.push(arr1[i]);
    }
    if (arr2[i]) {
      result.push(arr2[i]);
    }
  }
  result.push(...arr2.slice(i));
  return result;
}

export function rotate<T>(matrix: T[][]) {
  const rotatedMatrix = [];
  for (let x = 0; x < matrix[0].length; x++) {
    rotatedMatrix.push(matrix.map((row) => row[x]).reverse());
  }
  return rotatedMatrix;
}

export function toArray<T>(it: IterableIterator<T>): T[] {
  const result = [];
  for (const item of it) {
    result.push(item);
  }
  return result;
}

export function memoize<ArgsT extends any[], ReturnT extends any>(
  fn: (...args: ArgsT) => ReturnT,
  getCacheKey: (...args: ArgsT) => string = (...args) =>
    args.map((arg) => JSON.stringify(arg)).join(':')
) {
  const cache = {};

  return function (...args: ArgsT): ReturnT {
    const key = getCacheKey(...args);
    if (key in cache) {
      return cache[key];
    }

    cache[key] = fn(...args);
    return cache[key];
  };
}
