import type { Disposable } from "../Disposable/Disposable";

export type WatchTarget<WatchMap> = {
  [K in keyof WatchMap]: SingleWatchTarget<WatchMap[K]>;
};

export interface SingleWatchTarget<T> {
  (handler: (value: T) => void, onlyOnChange?: boolean): Disposable;
  get value(): T;
}

export interface IWatchTarget<WatchMap> {
  watch: WatchTarget<WatchMap>;
}
