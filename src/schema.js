import { makeExecutableSchema } from "graphql-tools";

import schemas from "./core/base-schema";
import resolvers from "./resources/resolver";

export default makeExecutableSchema({
  typeDefs: schemas,
  resolvers
});
