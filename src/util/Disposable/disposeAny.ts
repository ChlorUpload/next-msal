import type { Disposable, IDisposable } from "./Disposable";
import { isDisposable } from "./isDisposable";

export type AnyDisposable =
  | false
  | null
  | undefined
  | Disposable
  | IDisposable
  | AnyDisposable[];

export async function disposeAny(...items: AnyDisposable[]) {
  Promise.all(
    (
      (items as any).flat(Infinity) as Exclude<AnyDisposable, AnyDisposable[]>[]
    ).map(async function disposeRecursive(item) {
      if (isDisposable(item)) item.dispose();
      else if (item) item();
    })
  );
}
