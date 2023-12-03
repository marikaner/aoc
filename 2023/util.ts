export function sum(arr: any[], access = (val: any) => val) {
  return arr.reduce((sum, val) => sum + access(val), 0);
}

export function toArray<T>(it: IterableIterator<T>): T[] {
  const result = [];
  for (const item of it) {
    result.push(item);
  }
  return result;
}
