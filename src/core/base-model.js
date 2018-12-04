import uuid from "uuid/v4";
import { Model, compose } from "objection";
import ObjectionGuid from "objection-guid";

const applyPlugins = compose([ObjectionGuid()]);

export default class BaseModel extends applyPlugins(Model) {
  $beforeInsert(context) {
    console.log("ID COLUMN", context);
    this.id = this.id || uuid();
    this.created_at = new Date().toISOString();
    this.updated_at = new Date().toDateString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toDateString();

    if (this.deleted) {
      this.deleted_at = new Date().toISOString();
    }
  }

  $beforeDelete() {
    this.deleted_at = new Date().toISOString();
  }
}
