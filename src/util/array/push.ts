export function push<T>(array: T[], ...value: T[]): T[];
export function push<Array extends any[], Push extends any[]>(
  array: Array,
  ...value: Push
): [...Array, ...Push] {
  array.push(...value);
  return array as any[] as [...Array, ...Push];
}
