"use client";

import { useEffect } from "react";
import { authClient } from "./authClient";
import { AuthStateIndicator } from "./AuthStateIndicator";
import { useTokenRefreshState } from "./useTokenRefreshState";

interface AuthHandlerProps {
  children?: React.ReactNode;
  disableIndicator?: boolean;
  // sessionExpirationPage?: React.ReactNode;
}

export function AuthHandler({
  children,
  disableIndicator = false,
}: // sessionExpirationPage = <DefaultSessionExpiration />,
AuthHandlerProps) {
  useEffect(() => {
    // prevent hydration error
    // first render must be same with the server render.
    authClient.init();
  }, []);

  const state = useTokenRefreshState();

  useEffect(() => {
    if (state === "sessionExpired" || state === "error") {
      authClient.signOut();
    }
  }, [state]);

  return (
    <>
      {/* {state === "sessionExpired" && sessionExpirationPage} */}
      {/* {state !== "sessionExpired" && children} */}
      {children}
      {!disableIndicator && <AuthStateIndicator />}
    </>
  );
}
