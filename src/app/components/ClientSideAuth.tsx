"use client";

import { useClientAuth } from "@/auth/useClientAuth";

export function ClientSideAuth() {
  const { session, status } = useClientAuth();
  if (status === "loading") return <div>loading...</div>;
  return (
    <div>
      <div>AccessToken: {session?.accessToken}</div>
      <div>Expiration: {session?.expires}</div>
      <div>Roles: {session?.roles}</div>
      <div>UserId: {session?.userId}</div>
    </div>
  );
}
