import { cryptoProvider } from "@/auth/msalSession/cryptoProvider";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/auth/msalSession/ironSession";
import { withIronSessionApiRoute } from "iron-session/next";
import { redirectPkceAuthCodeUrl } from "@/auth/msalSession/redirectPkceAuthCodeUrl";

export async function login(req: NextApiRequest, res: NextApiResponse) {
  const { redirectTo } = req.query;
  const state = cryptoProvider.base64Encode(
    JSON.stringify({
      redirectTo: redirectTo ?? "/",
    })
  );
  await redirectPkceAuthCodeUrl(req, res, state);
}

export default withIronSessionApiRoute(login, sessionOptions);
