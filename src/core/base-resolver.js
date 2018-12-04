import { createResolver } from "apollo-resolvers";
import { isInstance } from "apollo-errors";

import { UnknownError, UnauthenticatedError } from "./base-errors";

const baseResolver = createResolver(null, (root, args, context, error) => {
  console.log(error);
  return isInstance(error)
    ? error
    : new UnknownError({
        internalData: {
          originalErrorMessage: error.message,
          originalErrorName: error.name,
          root,
          args
        }
      });
});

export const authResolver = baseResolver.createResolver(
  (root, args, context) => {
    const { isAuthenticated } = context;

    if (!isAuthenticated) {
      throw new UnauthenticatedError();
    }
  }
);

export default baseResolver;
