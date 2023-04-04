export function repeat<T>(value: T, count: number): T[] {
  return Array.from(new Array(count)).map(() => value);
}
