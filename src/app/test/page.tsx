import { getServerSession } from "@/auth/getServerSession";
import { AuthController } from "../components/AuthController";
import { ClientSideAuth } from "../components/ClientSideAuth";
import { ServerSideAuth } from "../components/ServerSideAuth";

export default async function Home() {
  const session = await getServerSession();
  return (
    <div>
      <h1>Test Page</h1>
      <h3>Server Side Auth</h3>
      <ServerSideAuth session={session} />
      <h3>Client Side Auth</h3>
      <ClientSideAuth />
      <h3>Controls</h3>
      <AuthController />
    </div>
  );
}
