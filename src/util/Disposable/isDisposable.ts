import type { IDisposable } from "./Disposable";

export function isDisposable(self: any): self is IDisposable {
  return typeof self?.dispose === "function";
}
