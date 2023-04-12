import { Configuration, PublicClientApplication } from "@azure/msal-node";
import { getRedisCachePlugin } from "./cachePlugins/redisCachePlugin";
import { NextApiRequest } from "next";
import { getDiskCachePlugin } from "./cachePlugins/diskCachePlugin";

export const tenantName = process.env.TENANT_NAME!;
export const clientId = process.env.CLIENT_ID!;
export const signInSignUpPolicy = process.env.SIGN_IN_SIGN_UP_POLICY!;
export const resetPasswordPolicy = process.env.RESET_PASSWORD_POLICY!;
export const baseUrl = process.env.BASE_URL!;

if (
  !tenantName ||
  !clientId ||
  !signInSignUpPolicy ||
  !resetPasswordPolicy ||
  !baseUrl
)
  throw new Error("environment variables not set");

export const authorityBase = `https://${tenantName}.b2clogin.com/tfp/${tenantName}.onmicrosoft.com`;
export const authorityMap = {
  signInSignUp: `${authorityBase}/${signInSignUpPolicy}`,
  resetPassword: `${authorityBase}/${resetPasswordPolicy}`,
};

export const scope = `https://${tenantName}.onmicrosoft.com/${clientId}/api`;
export const redirectUri = `${baseUrl}/api/auth/redirect`;

const isUsingRedisCache = true;
// const isUsingRedisCache = process.env.NODE_ENV === "production";

export async function getMsalClient(req: NextApiRequest) {
  let cachePlugin;
  if (isUsingRedisCache) {
    cachePlugin = await getRedisCachePlugin(req);
  } else {
    cachePlugin = await getDiskCachePlugin();
  }

  const clientConfig: Configuration = {
    auth: {
      clientId,
      authority: authorityMap.signInSignUp,
      knownAuthorities: Object.values(authorityMap),
      clientSecret: "",
    },
    cache: {
      cachePlugin,
    },
  };

  return new PublicClientApplication(clientConfig);
}
