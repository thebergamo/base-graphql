import shortId from "shortid";

import * as facebookProvider from "social-providers/facebook";
import Controller from "core/base-controller";
import { generateToken } from "core/base-auth";

export default class User extends Controller {
  constructor(context) {
    super(context);

    this.Model = this.database.Users;
    this.resourceName = "user";
    this.cache = context.cache;
    // TODO: Add loader
  }

  async createSession(user) {
    const token = generateToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      user,
      token,
      refreshToken
    };
  }

  async generateRefreshToken({ id }) {
    const newRefreshToken = shortId.generate();

    await this.cache.setRefreshToken(newRefreshToken, id);

    return newRefreshToken;
  }

  async create(token) {
    const profile = await facebookProvider.getProfile(token);

    const existingUser = await this.getByWhere({ fbId: profile.fbId });

    if (existingUser) {
      return this.createSession(existingUser);
    }

    return this.createSession(
      await this._create({ ...profile, nickname: shortId.generate() })
    );
  }

  async refreshToken(refreshToken) {
    const userId = await this.cache.getRefreshToken(refreshToken);

    if (!userId) {
      throw new ResourceError({
        message: "Invalid Refresh Token"
      });
    }

    const user = await this.get(userId);

    if (!user) {
      throw new ResourceError({
        message: "Invalid Refresh Token"
      });
    }

    await this.cache.removeRefreshToken(refreshToken);

    return this.createSession(user);
  }
}
