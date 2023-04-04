import { Configuration, PublicClientApplication } from "@azure/msal-node";
import {
  DataProtectionScope,
  PersistenceCachePlugin,
  PersistenceCreator,
} from "@azure/msal-node-extensions";

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

const cachePath = "./cache.json";
const persistenceConfiguration = {
  cachePath,
  dataProtectionScope: DataProtectionScope.CurrentUser,
  serviceName: "serviceName",
  accountName: "accountName",
  usePlaintextFileOnLinux: false,
};

export const scope = `https://${tenantName}.onmicrosoft.com/${clientId}/api`;
export const redirectUri = `${baseUrl}/api/auth/redirect`;

let _pca: PublicClientApplication | null = null;

export async function getMsalClient() {
  if (_pca) return _pca;

  const persistence = await PersistenceCreator.createPersistence(
    persistenceConfiguration
  );

  const clientConfig: Configuration = {
    auth: {
      clientId,
      authority: authorityMap.signInSignUp,
      knownAuthorities: Object.values(authorityMap),
      clientSecret: "",
    },
    cache: {
      cachePlugin: new PersistenceCachePlugin(persistence),
    },
  };

  _pca = new PublicClientApplication(clientConfig);
  return _pca;
}
