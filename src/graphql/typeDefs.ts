import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLSchema } from "graphql";
import path from "path";

const schemaPath = path.join(process.cwd(), "graphql/schema.graphql");

const typeDefs: GraphQLSchema = loadSchemaSync(schemaPath, {
  loaders: [new GraphQLFileLoader()],
});

export default typeDefs;
