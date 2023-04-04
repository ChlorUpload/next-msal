export function hasDuplicate<T = any>(array: T[]): boolean {
  return array.length !== new Set(array).size;
}
