import { Configuration, PublicClientApplication } from "@azure/msal-node";

export const tenantName = "sabanab2c";
export const clientId = "91a65dc5-f32f-4678-bd2e-212ff379932e";
export const signInSignUpPolicy = "B2C_1_SignUpSignIn1";
export const baseUrl = "http://localhost:3000";

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
