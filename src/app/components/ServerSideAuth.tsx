import { Session } from "@/auth/models/auth";

export function ServerSideAuth({ session }: { session: Session | null }) {
  return (
    <div>
      <div>AccessToken: {session?.accessToken}</div>
      <div>Expiration: {session?.expires}</div>
      <div>Roles: {session?.roles}</div>
      <div>UserId: {session?.userId}</div>
    </div>
  );
}
