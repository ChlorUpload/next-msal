import { Configuration, PublicClientApplication } from "@azure/msal-node";

export const tenantName = process.env.TENANT_NAME;
export const clientId = process.env.CLIENT_ID;
export const signInSignUpPolicy = process.env.SIGN_IN_SIGN_UP_POLICY;
export const baseUrl = process.env.BASE_URL;

if (!tenantName || !clientId || !signInSignUpPolicy || !baseUrl)
  throw new Error("environment variables not set");

const authorityBase = `https://${tenantName}.b2clogin.com/tfp/${tenantName}.onmicrosoft.com`;
const authorityMap = {
  signInSignUp: `${authorityBase}/${signInSignUpPolicy}`,
};

export const clientConfig: Configuration = {
  auth: {
    clientId,
    authority: authorityMap.signInSignUp,
    knownAuthorities: Object.values(authorityMap),
    clientSecret: "",
  },
};

export const scope = `https://${tenantName}.onmicrosoft.com/${clientId}/api offline_access openid`;
export const pca = new PublicClientApplication(clientConfig);
export const redirectUri = `${baseUrl}/api/auth/redirect`;
