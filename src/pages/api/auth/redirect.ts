import { cryptoProvider } from "@/auth/msalSession/cryptoProvider";
import { sessionOptions } from "@/auth/msalSession/ironSession";
import {
  getMsalClient,
  redirectUri,
  scope,
} from "@/auth/msalSession/msalClient";
import { AuthorizationCodeRequest } from "@azure/msal-node";
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { makeSession } from "@/auth/msalSession/makeSession";

export async function redirect(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.state) throw new Error("State not found");

  const pca = await getMsalClient();
  const state = JSON.parse(
    cryptoProvider.base64Decode(req.query.state as any)
  ) as any;
  if (state.stage !== "login") {
    throw new Error("not a login stage");
  }

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
    console.error(error);
    res.end();
  }
}

export default withIronSessionApiRoute(redirect, sessionOptions);
