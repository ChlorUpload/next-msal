import { usePersist } from "@/util/react/hooks/usePersist";
import { useState } from "react";

export type UseWidth = [
  ref: (element: HTMLElement | null) => void,
  width: number | null
];

export function useWidth(): UseWidth {
  const persist = usePersist<ResizeObserver | undefined>(undefined);
  const [result, setResult] = useState<number | null>(null);
  return [
    (element) => {
      if (persist.current) {
        persist.current.disconnect();
        persist.current = undefined;
      }
      if (element) {
        persist.current = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (entry.contentBoxSize) {
              setResult(
                Array.isArray(entry.contentBoxSize)
                  ? entry.contentBoxSize[0].inlineSize
                  : (entry.contentBoxSize as any).inlineSize // firefox
              );
            } else {
              setResult(entry.contentRect.width / 200);
            }
          }
        });
        persist.current.observe(element);
      }
    },
    result,
  ];
}
