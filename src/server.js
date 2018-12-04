import R from "ramda";
import Hapi from "hapi";
import { ApolloServer } from "apollo-server-hapi";

import db from "./core/base-database";
import auth from "./core/base-auth";
import getLoaders from "./core/helper-dataloader";

import Cache from "./core/base-cache";

import config from "./config";

import schema from "./schema";

export const isAuthenticated = request =>
  R.pathOr(false, ["auth", "isAuthenticated"], request);

export const getAuthContext = request =>
  R.pathOr(false, ["auth", "credentials"], request);

const debug = R.propEq("development", "NODE_ENV", process.env)
  ? { request: ["*"], log: ["*"] }
  : {};

async function StartServer() {
  const cache = new Cache();

  const server = new ApolloServer({
    schema,
    introspection: true,
    context: ({ request }) => ({
      db,
      cache,
      user: getAuthContext(request),
      loaders: getLoaders(db),
      isAuthenticated: isAuthenticated(request)
    })
  });

  const app = new Hapi.server({
    port: config.server.port,
    debug: {
      ...debug
    },
    routes: {
      cors: true,
      auth: {
        mode: "optional"
      }
    }
  });

  await app.register(auth);

  await server.applyMiddleware({
    app
  });

  await app.start();

  console.log(`🚀  Server ready at ${app.info.uri}`);
}

process.on("unhandledRejection", err => {
  console.error(err);
  process.exit(1);
});

StartServer();
