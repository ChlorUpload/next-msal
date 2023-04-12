import {
  DistributedCachePlugin,
  ICacheClient,
  IPartitionManager,
} from "@azure/msal-node";
import { RedisClientType, createClient } from "redis";
import RedisClientWrapper from "./RedisClientWrapper";
import { AccountEntity } from "@azure/msal-common";
import { NextApiRequest } from "next";

const redisMsalKey = process.env.REDIS_MSAL_KEY as string;
const redisHostName = process.env.REDIS_HOST_NAME as string;
const redisPassword = process.env.REDIS_PASSWORD as string;

if (!redisMsalKey || !redisHostName || !redisPassword)
  throw new Error("env not set");

const redisClient = createClient({
  url: `rediss://${redisHostName}:6380`,
  password: redisPassword,
});
redisClient.on("error", (err) => console.error("Redis Client Error", err));

export class IronSessionPartitionManager implements IPartitionManager {
  private _req: NextApiRequest;

  constructor(req: NextApiRequest) {
    this._req = req;
  }

  private _makeKey(homeAccountId: string) {
    let key: string = "";
    if (homeAccountId) {
      key = `${redisMsalKey}-${homeAccountId}`;
    }
    console.log(key);
    return key;
  }

  async getKey(): Promise<string> {
    if (!this._req) throw new Error("request not set");

    const homeAccountId = this._req.session.account?.homeAccountId;
    return this._makeKey(homeAccountId!);
  }

  async extractKey(accountEntity: AccountEntity): Promise<string> {
    return this._makeKey(accountEntity.homeAccountId!);
  }
}

/**
 * A web app service holds multiple users.
 * Web app services can be distributed to many devices.
 */
export class RedisCachePlugin extends DistributedCachePlugin {
  constructor(client: ICacheClient, manager: IPartitionManager) {
    super(client, manager);
  }
}

let _connected = false;
const client = new RedisClientWrapper(redisClient as RedisClientType);

export async function getRedisCachePlugin(req: NextApiRequest) {
  if (!_connected) {
    await redisClient.connect();
    _connected = true;
  }

  const manager = new IronSessionPartitionManager(req);
  const plugin = new RedisCachePlugin(client, manager);
  return plugin;
}
