import { Configuration, PublicClientApplication } from "@azure/msal-node";
import { getDiskCachePlugin } from "./cachePlugins/diskCachePlugin";
import { getRedisCachePlugin } from "./cachePlugins/redisCachePlugin";

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

let _pca: PublicClientApplication | null = null;

export async function getMsalClient() {
  if (_pca) return _pca;

  let cachePlugin;
  // if (process.env.NODE_ENV === "production") {
  cachePlugin = await getRedisCachePlugin();
  // } else {
  // cachePlugin = await getDiskCachePlugin();
  // }

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

  _pca = new PublicClientApplication(clientConfig);
  return _pca;
}
