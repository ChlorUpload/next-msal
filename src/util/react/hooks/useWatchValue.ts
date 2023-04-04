import { SingleWatchTarget } from "@/util/WatchTarget/WatchTarget";
import { useEffect } from "react";
import { useRerender } from "./useRerender";

export function useWatchValue<T>(watchTarget: SingleWatchTarget<T>): T {
  const rerender = useRerender();
  useEffect(() => {
    const unwatch = watchTarget(rerender);
    return () => {
      unwatch();
    };
  }, [watchTarget, rerender]);
  return watchTarget.value;
}
