import { sessionOptions } from "@/auth/ironSession";
import { pca, redirectUri, scope } from "@/auth/msalClient";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

// no top-level navigation: no cookie sent!
async function redirect(req: NextApiRequest, res: NextApiResponse) {
  console.log("SESSION!!!", req.session, req.body, req.cookies);

  res.send({
    session: req.session,
    body: req.body,
    cookies: req.cookies,
  });

  // const authCodeRequest = {
  //   redirectUri,
  //   scopes: [scope],
  //   code: req.body.code,
  //   codeVerifier: req.session.pkceCodes.verifier,
  // };

  // try {
  //   const tokenResponse = await pca.acquireTokenByCode(authCodeRequest);
  //   const state = tokenResponse.state;
  //   console.log(state);
  //   req.session.accessToken = tokenResponse.accessToken;
  //   req.session.idToken = tokenResponse.idToken;
  //   req.session.account = tokenResponse.account;
  //   req.session.isAuthenticated = true;
  //   await req.session.save();

  //   res.redirect("/");
  // } catch (error) {
  //   console.error(error);
  //   res.end();
  // }
}

export default withIronSessionApiRoute(redirect, sessionOptions);
