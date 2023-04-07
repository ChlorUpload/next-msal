import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { getMsalClient, scope } from "@/auth/msalSession/msalClient";
import { sessionOptions } from "@/auth/msalSession/ironSession";
import { makeSession } from "@/auth/msalSession/makeSession";

export async function session(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.account) {
    res.send({
      error: "Unauthorized",
    });
    return;
  }

  const pca = await getMsalClient();
  const tokenCache = pca.getTokenCache();

  const account = req.session.account.homeAccountId
    ? await tokenCache.getAccountByHomeId(req.session.account.homeAccountId)
    : await tokenCache.getAccountByLocalId(req.session.account.localAccountId);
  if (!account) {
    res.send({
      error: "TokenCacheExpired",
    });
    return;
  }

  const silentRequest = {
    account: account,
    scopes: [scope],
  };
  const tokenResponse = await pca.acquireTokenSilent(silentRequest);

  if (!tokenResponse || tokenResponse.accessToken.length === 0) {
    // In B2C scenarios, sometimes an access token is returned empty.
    // In that case, we will acquire token interactively instead.
    if (!req.session.account) {
      res.send({
        error: "SessionExpired",
      });
      return;
    }
  }

  const idTokenClaims = tokenResponse!.idTokenClaims as any;
  const accessToken = tokenResponse!.accessToken!;
  const session = makeSession(accessToken, idTokenClaims);
  req.session = {
    ...req.session,
    ...session,
  };
  await req.session.save();
  res.send(session);
}

export default withIronSessionApiRoute(session, sessionOptions);
