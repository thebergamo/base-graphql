import Path from "path";
import { fileLoader, mergeTypes } from "merge-graphql-schemas";

const opts = { recursive: true, extensions: [".graphql"] };
const typesArray = fileLoader(Path.join(__dirname, "../resources"), opts);

export default mergeTypes(typesArray);
