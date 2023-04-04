import { createDisposer } from "@/util/Disposable/Disposer";
import { on } from "@/util/dom/on";
import { useEffect, useState } from "react";

export function useMatchMedia(query: string): boolean | undefined {
  const [matches, setMatches] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    return createDisposer().add(
      on<MediaQueryListEvent>(media, "change", (ev) => {
        setMatches(ev.matches);
      })
    );
  }, [query]);

  return matches;
}
