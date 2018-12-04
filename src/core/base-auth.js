import jwt from "jsonwebtoken";
import authJWT from "hapi-auth-jwt2";

import config from "../config";

export function validate(decoded) {
  // Not valid token or credentials
  if (!decoded.id) {
    return { isValid: false };
  }

  return { isValid: true, id: decoded.id };
}

const auth = {
  name: "auth-jwt",
  version: "1.0.0",
  register: async (server, h) => {
    await server.register(authJWT);

    server.auth.strategy("jwt", "jwt", {
      key: config.server.jwt,
      validate,
      verifyOptions: { algorithms: ["HS256"] }
    });

    server.auth.default("jwt");

    server.log(["auth"], "Plugin Auth registred");
  }
};

export function generateToken({ id }) {
  const secretKey = config.server.jwt;

  return jwt.sign(
    {
      id
    },
    secretKey,
    { expiresIn: "72h" }
  );
}

export default auth;
