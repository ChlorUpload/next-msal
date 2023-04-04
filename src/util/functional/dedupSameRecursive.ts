import { eqeqeq } from "../defaults/eqeqeq";
import { Equator } from "../types/Equator";

export function dedupSameRecursive<T>(
  func: (param: T) => any,
  isSame: Equator<T> = eqeqeq,
  ...extra: [] | [previous: T]
): (param: T) => void {
  let previous: [T] | undefined = extra.length ? extra : undefined;
  return function deduped(param: T) {
    if (!previous || !isSame(previous[0], param)) {
      previous = [param];
      func(param);
    }
  };
}
