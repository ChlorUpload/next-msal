import { eqeqeq } from "../defaults/eqeqeq";

export function sameArray<T>(
  a: T[],
  b: T[],
  isSame: (a: T, b: T) => boolean = eqeqeq,
): boolean {
  return (
    a.length === b.length && a.every((element, i) => isSame(element, b[i]))
  );
}
