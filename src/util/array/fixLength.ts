import { ofLength } from './ofLength';

export function fixLength<T>(arr: T[], length: number): (T | undefined)[] {
  return ofLength(length).map((_, i) => arr[i]);
}
