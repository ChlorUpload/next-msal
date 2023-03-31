import { cryptoProvider } from "@/auth/cryptoProvider";
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/auth/ironSession";
import { pca, redirectUri, scope } from "@/auth/msalClient";

async function signIn(req: NextApiRequest, res: NextApiResponse) {
  // create a GUID for crsf
  req.session.csrfToken = cryptoProvider.createNewGuid();
  await req.session.save();

  const state = cryptoProvider.base64Encode(
    JSON.stringify({
      csrfToken: req.session.csrfToken,
      redirectTo: "/",
    })
  );

  // Generate PKCE Codes before starting the authorization flow
  const { verifier, challenge } = await cryptoProvider.generatePkceCodes();

  // Set generated PKCE codes and method as session vars
  const pkceCodes = {
    challengeMethod: "S256",
    verifier: verifier,
    challenge: challenge,
  };

  const authCodeUrlRequest = {
    state,
    redirectUri,
    responseMode: "form_post" as any, // recommended for confidential clients
    codeChallenge: pkceCodes.challenge,
    codeChallengeMethod: pkceCodes.challengeMethod,
    scopes: [scope],
  };

  // Get url to sign user in and consent to scopes needed for application
  try {
    const authCodeUrlResponse = await pca.getAuthCodeUrl(authCodeUrlRequest);
    res.redirect(authCodeUrlResponse);
  } catch (error) {
    console.error(error);
  }
}

export default withIronSessionApiRoute(signIn, sessionOptions);
