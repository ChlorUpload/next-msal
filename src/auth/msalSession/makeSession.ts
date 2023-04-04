import { Session } from "../models/auth";
import { parseRoles } from "../models/role";

export function makeSession(
  accessToken: string,
  idTokenClaims: {
    exp: number;
    extension_Role: string;
    extension_UserId: string;
  }
): Session {
  const userId = idTokenClaims.extension_UserId!;
  const roles = parseRoles(idTokenClaims.extension_Role);
  const expires = new Date(idTokenClaims.exp * 1000).toISOString();
  return {
    userId,
    roles,
    accessToken,
    expires,
  };
}
