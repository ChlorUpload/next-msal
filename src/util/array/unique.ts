export function unique<T>(array: T[]) {
  return Array.from(new Set(array));
}
