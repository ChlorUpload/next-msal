export function arraySet<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}
