import { ICachePlugin, TokenCacheContext } from "@azure/msal-node";
import { createClient } from "redis";

const redisMsalKey = process.env.REDIS_MSAL_KEY as string;
const redisHostName = process.env.REDIS_HOST_NAME as string;
const redisPassword = process.env.REDIS_PASSWORD as string;

if (!redisMsalKey || !redisHostName || !redisPassword)
  throw new Error("env not set");

const client = createClient({
  url: `rediss://${redisHostName}:6380`,
  password: redisPassword,
});
type ClientType = typeof client;
client.on("error", (err) => console.error("Redis Client Error", err));
export class RedisCachePlugin implements ICachePlugin {
  client: ClientType;
  constructor(client: ClientType) {
    this.client = client;
  }
  async beforeCacheAccess(cacheContext: TokenCacheContext): Promise<void> {
    const cacheData = await this.client.get(redisMsalKey);
    if (cacheData === null) return;

    cacheContext.tokenCache.deserialize(cacheData);
  }

  async afterCacheAccess(cacheContext: TokenCacheContext): Promise<void> {
    if (cacheContext.cacheHasChanged) {
      const serialized = cacheContext.tokenCache.serialize();
      await this.client.set(redisMsalKey, serialized);
    }
  }
}

export async function getRedisCachePlugin() {
  await client.connect();
  return new RedisCachePlugin(client);
}
