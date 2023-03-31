import { clientConfig } from "@/auth/msalClient";
import { NextApiRequest, NextApiResponse } from "next";

export default function logout(req: NextApiRequest, res: NextApiResponse) {
  /**
   * Construct a logout URI and redirect the user to end the
   * session with Azure AD. For more information, visit:
   * https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
   */
  // const logoutUri = `${clientConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${POST_LOGOUT_REDIRECT_URI}`;
  const logoutUri = `${clientConfig.auth.authority}/oauth2/v2.0/logout`;

  req.session.destroy();
  res.redirect(logoutUri);
}
