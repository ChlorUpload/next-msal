import { NextApiRequest, NextApiResponse } from "next";
import { authorityMap } from "@/auth/msalSession/msalClient";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/auth/msalSession/ironSession";

export function logout(req: NextApiRequest, res: NextApiResponse) {
  /**
   * Construct a logout URI and redirect the user to end the
   * session with Azure AD. For more information, visit:
   * https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
   */
  const logoutUri = `${authorityMap.signInSignUp}/oauth2/v2.0/logout?post_logout_redirect_uri=${process.env.BASE_URL}`;

  req.session.destroy();
  res.redirect(logoutUri);
}

export default withIronSessionApiRoute(logout, sessionOptions);
