import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
})
 
// Export Next.js handler for the graphql integration
export const GET = startServerAndCreateNextHandler(server)
export const POST = startServerAndCreateNextHandler(server)
