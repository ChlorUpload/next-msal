import { cookies } from "next/headers";
import { unsealData } from "iron-session";
import { Session } from "./models/auth";

export async function getServerSession(): Promise<Session | null> {
  const c = cookies();
  const cookieName = process.env.SESSION_COOKIE_NAME as string;
  const found = c.get(cookieName);
  if (!found) return null;

  return (await unsealData(found.value, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
  })) as Session;
}
