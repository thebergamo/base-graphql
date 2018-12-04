require("dotenv").config();
// Loading extra .env (used in production)
require("dotenv").config({ path: "./envs/.env" });

module.exports = {
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || "development",
    jwt: process.env.JWT || "stubJWT"
  },
  database: {
    client: process.env.DB_DIALECT || "pg",
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || "5432",
      user: process.env.DB_USERNAME || "project",
      password: process.env.DB_PASSWORD || "project",
      database: process.env.DB_NAME || "project"
    },
    debug: process.env.NODE_ENV !== "production"
  },
  cache: {
    token: 3 * (24 * (60 * 1000)), // 3d
    refreshToken: 14 * (24 * (60 * 1000)), // 14d
    url: process.env.REDIS_URL || "redis://localhost:6379"
  },

  providers: {
    facebook: {
      clientSecret: "3689a19ce800acdd7d3b604733d43e1e",
      endpoint: "https://graph.facebook.com/v3.2/me"
    }
  }
};
