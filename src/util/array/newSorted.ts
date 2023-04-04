export function newSorted<T>(
  data: Iterable<T>,
  comparator?: (a: T, b: T) => number,
): T[] {
  const result = [...data];
  result.sort(comparator);
  return result;
}
