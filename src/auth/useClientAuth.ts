import { useWatchValue } from "@/util/react/hooks/useWatchValue";
import { authClient } from "./authClient";

export function useClientAuth() {
  const auth = useWatchValue(authClient.watch.auth);
  return auth;
}
