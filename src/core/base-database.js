import path from "path";
import glob from "glob";
import Knex from "knex";
import { Model, knexSnakeCaseMappers } from "objection";
import config from "../config";

const knex = new Knex({
  ...config.database,
  ...knexSnakeCaseMappers()
});

Model.knex(knex);

let database = {};

const baseDir = __dirname.indexOf("build") !== -1 ? "build" : "src";
const pattern = `${baseDir}/**/model.js`;

glob.sync(pattern).forEach(file => {
  const root = path.join(__dirname, "..", "..", file);
  const model = require(root).default;

  console.log(model.modelName);
  database[model.modelName] = model;
});

export default database;
