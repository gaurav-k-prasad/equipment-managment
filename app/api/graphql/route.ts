import resolvers from "@/graphql/resolvers";
import typeDefs from "@/graphql/typeDefs";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { createContext } from "@/graphql/context";
import { GraphQLError } from "graphql";
import { plugins } from "@/graphql/middleware";
import { NextRequest } from "next/server";

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    // Don't expose internal errors to clients
    if (error.extensions?.code === "UNAUTHENTICATED") {
      return new GraphQLError("Not authenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }
    if (error.extensions?.code === "FORBIDDEN") {
      return new GraphQLError("Not authorized", {
        extensions: { code: "FORBIDDEN" },
      });
    }
    if (error.extensions?.code === "BAD_USER_INPUT") {
      return new GraphQLError(error.message, {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // Log the error for debugging
    console.error("GraphQL Error:", error);

    // Return a generic error message
    return new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  },
  plugins,
});

// Export Next.js handler for the graphql integration
export const GET = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => createContext({ req }),
});

export const POST = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => createContext({ req }),
});
