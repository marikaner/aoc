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

export function toArray<T>(it: IterableIterator<T>): T[] {
  const result = [];
  for (const item of it) {
    result.push(item);
  }
  return result;
}
