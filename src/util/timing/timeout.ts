import { Disposable } from "../Disposable/Disposable";

export function timeout(ms: number, func: () => void): Disposable {
  const toClear = setTimeout(func, ms);
  return () => clearTimeout(toClear);
}
