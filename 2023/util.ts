export function sum(arr: any[], access = (val: any) => val) {
  return arr.reduce((sum, val) => sum + access(val), 0);
}
