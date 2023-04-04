import { useEffect } from "react";
import { usePersist } from "./usePersist";

export function useUnmounted() {
  const unmounted = usePersist(false);
  useEffect(
    () => () => {
      unmounted.current = true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return unmounted;
}
