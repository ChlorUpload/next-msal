// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import {
  AccountInfo,
  AuthorizationCodeRequest,
  AuthorizationUrlRequest,
} from "@azure/msal-node";
import type { IronSessionOptions } from "iron-session";

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: "iron-session-kiwi",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // for redirect send cookies
  },
};

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    csrfToken: string;
    accessToken: string;
    idToken: string;
    account: AccountInfo | null;
    isAuthenticated: boolean;
    pkceCodes: {
      challengeMethod: "S256";
      verifier: string;
      challenge: string;
    };
    authCodeUrlRequest: AuthorizationUrlRequest;
    authCodeRequest: AuthorizationCodeRequest;
  }
}
