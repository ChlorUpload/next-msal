import { eqeqeq } from "../defaults/eqeqeq";
import { Disposable } from "../Disposable/Disposable";
import { MultipleException } from "../exception/MultipleException";
import { UnknownException } from "../exception/UnknownException";
import { ReadonlyWrite } from "../exception/wrapper/ReadonlyWrite";
import { dedupSameRecursive } from "../functional/dedupSameRecursive";
import { Equator } from "../types/Equator";
import { SingleWatchTarget, WatchTarget } from "./WatchTarget";

export type WatchTargetSetter<WatchMap> = {
  [K in keyof WatchMap]: (value: WatchMap[K]) => void;
};

export function createWatchTarget<WatchMap>(
  initialValue: WatchMap,
  equators: Partial<{
    [K in keyof WatchMap]: (a: WatchMap[K], b: WatchMap[K]) => boolean;
  }> = {},
): [WatchTarget<WatchMap>, WatchTargetSetter<WatchMap>] {
  const result: Partial<WatchTarget<WatchMap>> = {};
  const setter: Partial<WatchTargetSetter<WatchMap>> = {};
  (
    Object.keys(initialValue as unknown as object) as (keyof WatchMap)[]
  ).forEach((key) => {
    [result[key], setter[key]] = createSingleWatchTarget(
      initialValue[key],
      equators[key] ?? eqeqeq,
    );
  });
  return [
    result as WatchTarget<WatchMap>,
    setter as WatchTargetSetter<WatchMap>,
  ];
}

export function createSingleWatchTarget<T>(
  initialValue: T,
  isSame: Equator<T> = eqeqeq,
): [SingleWatchTarget<T>, (value: T) => void] {
  let value = initialValue;
  const handlers = new Map<Disposable, (value: T) => void>();
  const watch = function watch(
    handler: (value: T) => void,
    onlyOnChange = false,
  ) {
    function disposeWatchTarget() {
      handlers.delete(disposeWatchTarget);
    }
    handlers.set(disposeWatchTarget, handler);
    if (!onlyOnChange) {
      try {
        handler(value);
      } catch (err) {
        disposeWatchTarget();
        throw err;
      }
    }
    return disposeWatchTarget;
  } as SingleWatchTarget<T>;
  Object.defineProperty(watch, "value", {
    get: () => value,
    set: ReadonlyWrite,
  });
  function setter(newValue: T) {
    value = newValue;
    const exceptions: Error[] = [];
    handlers.forEach(function setWatchValue(handler) {
      if (value !== newValue) {
        // eslint-disable-next-line no-console
        console.warn(
          "some of watch handlers are changing watch value.",
          "purposed propagating value:",
          newValue,
          "violating (new-changing) value: ",
          value,
        );
      }
      try {
        handler(value);
      } catch (err) {
        exceptions.push(err instanceof Error ? err : new UnknownException(err));
      }
    });
    if (exceptions.length) {
      // for testing
      for (const ex of exceptions) {
        // eslint-disable-next-line no-console
        console.error(ex);
      }
      throw new MultipleException(
        "Multiple exceptions occurred while setting async watch value",
        ...exceptions,
      );
    }
  }
  return [watch, dedupSameRecursive(setter, isSame, initialValue)];
}
