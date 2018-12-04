import BaseModel from "core/base-model";

export default class UserModel extends BaseModel {
  static tableName = "users";
  static modelName = "Users";

  static jsonSchema = {
    type: "object",
    required: ["name", "email", "fbId", "nickname"],

    properties: {
      id: { type: "string" },

      name: { type: "string", minLength: 1 },
      email: { type: "string", minLength: 1 },
      fbId: { type: "string", minLength: 1 },
      nickname: { type: "string", minLength: 1 },

      settings: { type: "array" },
      demographics: { type: "array" },

      createdAt: { type: "datetime" },
      updatedAt: { type: "datetime" },
      deletedAt: { type: "datetime" }
    }
  };
}
