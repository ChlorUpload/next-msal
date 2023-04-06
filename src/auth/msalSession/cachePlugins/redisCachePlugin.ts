import { ICachePlugin, TokenCacheContext } from "@azure/msal-node";
import { createClient } from "redis";

const redisKey = "msal-cache";

const client = createClient();
type ClientType = typeof client;
client.on("error", (err) => console.log("Redis Client Error", err));

export class RedisCachePlugin implements ICachePlugin {
  client: ClientType;
  constructor(client: ClientType) {
    this.client = client;
  }
  async beforeCacheAccess(cacheContext: TokenCacheContext): Promise<void> {
    const cacheData = await this.client.get(redisKey);
    if (cacheData === null) return;

    cacheContext.tokenCache.deserialize(cacheData);
  }

  async afterCacheAccess(cacheContext: TokenCacheContext): Promise<void> {
    if (cacheContext.cacheHasChanged) {
      const serialized = cacheContext.tokenCache.serialize();
      await this.client.set(redisKey, serialized);
    }
  }
}

export async function getRedisCachePlugin() {
  await client.connect();
  return new RedisCachePlugin(client);
}
