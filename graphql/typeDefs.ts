import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import path from 'path';

const schemaPath = path.join(process.cwd(), 'graphql/schema.graphql');

const typeDefs = loadSchemaSync(schemaPath, {
  loaders: [new GraphQLFileLoader()],
});

export default typeDefs;