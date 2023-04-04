// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { AccountInfo } from "@azure/msal-node";
import type { IronSessionOptions } from "iron-session";
import { Session } from "../models/auth";

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: process.env.SESSION_COOKIE_NAME as string,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: true,
    sameSite: "none", // for redirect send cookies
  },
};

type PartialAccountInfo = {
  homeAccountId: AccountInfo["homeAccountId"];
  localAccountId: AccountInfo["localAccountId"];
};

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData extends Session {
    account: PartialAccountInfo | null;
    verifier: string;
  }
}
