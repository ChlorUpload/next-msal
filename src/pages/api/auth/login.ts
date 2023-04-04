import { cryptoProvider } from "@/auth/msalSession/cryptoProvider";
import { NextApiRequest, NextApiResponse } from "next";
import {
  getMsalClient,
  redirectUri,
  scope,
} from "@/auth/msalSession/msalClient";
import { AuthorizationUrlRequest } from "@azure/msal-node";
import { sessionOptions } from "@/auth/msalSession/ironSession";
import { withIronSessionApiRoute } from "iron-session/next";

export async function login(req: NextApiRequest, res: NextApiResponse) {
  const pca = await getMsalClient();

  const { redirectTo } = req.query;
  const state = cryptoProvider.base64Encode(
    JSON.stringify({
      redirectTo: redirectTo ?? "/",
      stage: "login",
    })
  );

  // Generate PKCE Codes before starting the authorization flow
  const { verifier, challenge } = await cryptoProvider.generatePkceCodes();

  const authCodeUrlRequest: AuthorizationUrlRequest = {
    state,
    redirectUri,
    codeChallenge: challenge,
    codeChallengeMethod: "S256",
    scopes: [scope],
  };

  req.session.verifier = verifier;
  await req.session.save();

  // Get url to sign user in and consent to scopes needed for application
  try {
    const authCodeUrlResponse = await pca.getAuthCodeUrl(authCodeUrlRequest);
    res.redirect(authCodeUrlResponse);
  } catch (error) {
    console.error(error);
  }
}

export default withIronSessionApiRoute(login, sessionOptions);
