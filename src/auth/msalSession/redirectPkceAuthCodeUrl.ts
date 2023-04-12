import { AuthorizationUrlRequest } from "@azure/msal-node";
import { NextApiRequest, NextApiResponse } from "next";
import { cryptoProvider } from "./cryptoProvider";
import { getMsalClient, redirectUri, scope } from "./msalClient";

export async function redirectPkceAuthCodeUrl(
  req: NextApiRequest,
  res: NextApiResponse,
  state: string,
  authority?: string
) {
  const pca = await getMsalClient(req);
  const { verifier, challenge } = await cryptoProvider.generatePkceCodes();
  const authCodeUrlRequest: AuthorizationUrlRequest = {
    state,
    redirectUri,
    codeChallenge: challenge,
    codeChallengeMethod: "S256",
    authority,
    scopes: [scope],
  };

  req.session.verifier = verifier;
  await req.session.save();

  const authCodeUrlResponse = await pca.getAuthCodeUrl(authCodeUrlRequest);
  res.redirect(authCodeUrlResponse);
}
