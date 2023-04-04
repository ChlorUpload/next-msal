import { Role } from "./role";

export type Session = {
  userId: string;
  roles: Role[];
  accessToken: string;
  expires: string;
};

export type Auth =
  | {
      session: Session;
      status: "authenticated";
    }
  | {
      session: null;
      status: "loading" | "unauthenticated";
    };
