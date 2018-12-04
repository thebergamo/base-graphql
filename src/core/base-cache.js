import Promise from "bluebird";
import redis from "redis";

import config from "../config";

Promise.promisifyAll(redis.RedisClient.prototype);

class Cache {
  constructor() {
    this.ttl = {
      token: config.cache.token,
      refreshToken: config.cache.refreshToken
    };

    this._client = redis.createClient(config.cache);

    this._client.on("connect", () => console.log("Redis connected")); // eslint-disable-line no-console
    this._client.on("error", err => console.log(`Redis Error: ${err}`)); // eslint-disable-line no-console
  }

  addToken(token) {
    return this._get("token", token);
  }

  setToken(token, data) {
    return this._set("token", token, data);
  }

  removeToken(token) {
    return this._remove("token", token);
  }

  getRefreshToken(token) {
    return this._get("refreshToken", token);
  }

  setRefreshToken(token, data) {
    return this._set("refreshToken", token, data);
  }

  removeRefreshToken(token) {
    return this._remove("refreshToken", token);
  }

  _get(prefix, token, isObject = false) {
    const key = `${prefix}.${token}`;

    return isObject
      ? this._client.hgetallAsync(key)
      : this._client.getAsync(key);
  }

  async _set(prefix, token, metadata, isObject = false) {
    let defaultMetadata = metadata;

    if (!metadata) {
      defaultMetadata = token;
    }

    try {
      if (!isObject) {
        await this._client.setAsync(`${prefix}.${token}`, defaultMetadata);
      } else {
        await this._client.hmsetAsync(`${prefix}.${token}`, defaultMetadata);
      }

      await this._client.expireAsync(`${prefix}.${token}`, this.ttl[prefix]);
    } catch (err) {
      throw err;
    }
  }

  _remove(prefix, token) {
    return this._client.delAsync(`${prefix}.${token}`);
  }
}

export default Cache;
