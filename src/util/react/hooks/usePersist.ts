import { useRef } from "react";

export interface UsePersist<T> {
  current: T;
}

export function usePersist<T>(
  defaultValue: (() => T) | (T extends (...args: any[]) => any ? never : T),
): UsePersist<T> {
  const result: UsePersist<[UsePersist<T>?]> = useRef([]);
  if (!result.current[0])
    result.current = [
      {
        current:
          defaultValue instanceof Function ? defaultValue() : defaultValue,
      },
    ];
  return result.current[0]!;
}
