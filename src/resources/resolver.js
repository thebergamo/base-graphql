import { merge } from "lodash";
import path from "path";
import glob from "glob";

const baseDir = __dirname.indexOf("build") !== -1 ? "build" : "src";
const pattern = `${baseDir}/resources/**/resolver.js`;

const resolvers = [];

glob.sync(pattern).forEach(file => {
  const root = path.join(__dirname, "..", "..", file);

  // eslint-disable-next-line
  const resolver = require(root).default;
  if (resolver) {
    resolvers.push(resolver);
  }
});

export default merge.apply(this, resolvers);
