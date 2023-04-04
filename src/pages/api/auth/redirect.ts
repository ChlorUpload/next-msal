import { cryptoProvider } from "@/auth/msalSession/cryptoProvider";
import {
  authorityMap,
  getMsalClient,
  redirectUri,
  scope,
} from "@/auth/msalSession/msalClient";
import { AuthorizationCodeRequest } from "@azure/msal-node";
import { NextApiRequest, NextApiResponse } from "next";
import { makeSession } from "@/auth/msalSession/makeSession";
import { sessionOptions } from "@/auth/msalSession/ironSession";
import { withIronSessionApiRoute } from "iron-session/next";
import { redirectPkceAuthCodeUrl } from "@/auth/msalSession/redirectPkceAuthCodeUrl";

export async function redirect(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.state) throw new Error("State not found");

  if (req.query.error) {
    await onError(req, res);
    return;
  }

  const pca = await getMsalClient();
  const state = JSON.parse(
    cryptoProvider.base64Decode(req.query.state as any)
  ) as any;

  const code = req.query.code || req.body.code;
  const verifier = req.session.verifier;

  const authCodeRequest: AuthorizationCodeRequest = {
    redirectUri,
    scopes: [scope],
    code,
    codeVerifier: verifier,
  };

  try {
    const tokenResponse = await pca.acquireTokenByCode(authCodeRequest);
    const accessToken = tokenResponse.accessToken;
    const idTokenClaims = tokenResponse!.idTokenClaims as any;
    const session = makeSession(accessToken, idTokenClaims);
    await req.session.destroy();
    req.session = {
      ...req.session,
      ...session,
      account: {
        homeAccountId: tokenResponse.account!.homeAccountId,
        localAccountId: tokenResponse.account!.localAccountId,
      },
      verifier: "",
    };
    await req.session.save();

    res.redirect(state.redirectTo);
  } catch (error) {
    // no explicit error, but cannot get token -> require sign in again
    // e.g. reset password finished
    await redirectPkceAuthCodeUrl(req, res, req.query.state as string);
    return;
  }
}

async function onError(req: NextApiRequest, res: NextApiResponse) {
  /**
   * When the user selects 'forgot my password' on the sign-in page, B2C service will throw an error.
   * We are to catch this error and redirect the user to LOGIN again with the resetPassword authority.
   * For more information, visit: https://docs.microsoft.com/azure/active-directory-b2c/user-flow-overview#linking-user-flows
   */
  if (JSON.stringify(req.query.error_description).includes("AADB2C90118")) {
    await redirectPkceAuthCodeUrl(
      req,
      res,
      req.query.state as string,
      authorityMap.resetPassword
    );
    return;
  }

  if (JSON.stringify(req.query.error_description).includes("AADB2C90091")) {
    await redirectPkceAuthCodeUrl(req, res, req.query.state as string);
    return;
  }

  throw new Error("unexpected error: " + (req.query as any).error_description);
}

export default withIronSessionApiRoute(redirect, sessionOptions);
