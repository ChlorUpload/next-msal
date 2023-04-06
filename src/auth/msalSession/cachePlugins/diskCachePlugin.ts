import { TokenCacheContext } from "@azure/msal-node";
import {
  DataProtectionScope,
  PersistenceCachePlugin,
  PersistenceCreator,
} from "@azure/msal-node-extensions";

const cachePath = "./cache.json";
const persistenceConfiguration = {
  cachePath,
  dataProtectionScope: DataProtectionScope.CurrentUser,
  serviceName: "serviceName",
  accountName: "accountName",
  usePlaintextFileOnLinux: false,
};

export async function getDiskCachePlugin() {
  const persistence = await PersistenceCreator.createPersistence(
    persistenceConfiguration
  );
  const plugin = new PersistenceCachePlugin(persistence);
  //  return plugin;
  return {
    async beforeCacheAccess(cacheContext: TokenCacheContext) {
      console.log("SERIALIZE_BEFORE", cacheContext.tokenCache.serialize());
      await plugin.beforeCacheAccess(cacheContext);
    },
    async afterCacheAccess(cacheContext: TokenCacheContext) {
      await plugin.afterCacheAccess(cacheContext);
    },
  };
}
