import { useWatchValue } from "@/util/react/hooks/useWatchValue";
import { authClient } from "./authClient";

export function useTokenRefreshState() {
  const tokenRefreshState = useWatchValue(authClient.watch.tokenRefreshState);
  return tokenRefreshState;
}
