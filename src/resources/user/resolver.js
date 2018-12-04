import baseResolver, { authResolver } from "core/base-resolver";

import UserController from "./controller";

const resolver = {
  Query: {
    user: authResolver.createResolver((root, { id }, context) => {
      const userController = new UserController(context);

      return userController.get(id);
    }),
    searchUser: authResolver.createResolver((root, { term }, context) => {
      const userController = new UserController(context);

      return userController._get({ term });
    })
  },
  Mutation: {
    signUpFacebook: baseResolver.createResolver((root, { token }, context) => {
      const userController = new UserController(context);

      return userController.create(token);
    }),
    updateUser: authResolver.createResolver((root, { id, input }, context) => {
      const userController = new UserController(context);

      return userController.update(id, input);
    }),
    refreshToken: baseResolver.createResolver(
      (root, { refreshToken }, context) => {
        const userController = new UserController(context);

        return userController.refreshToken(refreshToken);
      }
    )
  }
};

export default resolver;
