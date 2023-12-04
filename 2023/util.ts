export function sum<T>(
  arr: T[],
  access = (val: T, i?: number): number => val as number
) {
  return arr.reduce((sum, val, i) => sum + access(val, i), 0);
}

export function toArray<T>(it: IterableIterator<T>): T[] {
  const result = [];
  for (const item of it) {
    result.push(item);
  }
  return result;
}
