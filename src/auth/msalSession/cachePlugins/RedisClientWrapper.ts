/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ICacheClient } from "@azure/msal-node";
import { RedisClientType } from "redis";

/**
 * Simple persistence client helper, using Redis (node-redis). You must have redis installed
 * on your machine and have redis server listening. Note that this is only for illustration,
 * and you'll likely need to consider cache eviction policies and handle cache server connection
 * issues. For more information, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/caching.md
 */
class RedisClientWrapper implements ICacheClient {
  cacheClient: RedisClientType;

  constructor(cacheClient: RedisClientType) {
    this.cacheClient = cacheClient;
  }

  public async get(key: string): Promise<string> {
    let value = "";

    try {
      value = (await this.cacheClient.get(key)) || value;
    } catch (error) {
      console.log(error);
    }

    return value;
  }

  public async set(key: string, value: string): Promise<string> {
    let result = "";

    try {
      result = (await this.cacheClient.set(key, value)) || result;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
}

export default RedisClientWrapper;
