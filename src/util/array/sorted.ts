export function sorted<T>(
  array: T[],
  comparator?: (a: T, b: T) => number,
): T[] {
  array.sort(comparator);
  return array;
}
