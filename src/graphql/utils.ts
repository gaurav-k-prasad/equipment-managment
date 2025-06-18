import { Context } from "./context";
import { AuthenticationError, AuthorizationError } from "./context";

export function requireAuth(context: Context) {
  if (!context.user) {
    throw new AuthenticationError();
  }
  return context.user;
}

export function requireRole(context: Context, roles: string[]) {
  const user = requireAuth(context);
  if (!roles.includes(user.role)) {
    throw new AuthorizationError();
  }
  return user;
}

export function validatePagination(limit?: number, offset?: number) {
  if (limit && (limit < 1 || limit > 100)) {
    throw new Error("Limit must be between 1 and 100");
  }
  if (offset && offset < 0) {
    throw new Error("Offset must be greater than or equal to 0");
  }
}

export function buildWhereClause(filters: Record<string, unknown>) {
  const where: Record<string, unknown> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      where[key] = value;
    }
  });

  return where;
}

export function buildOrderByClause(sort?: { field: string; order: string }) {
  if (!sort) return undefined;

  return {
    [sort.field.toLowerCase()]: sort.order.toLowerCase(),
  };
}

export function handlePrismaError(error: Error & { code?: string }) {
  if (error.code === "P2002") {
    throw new Error("A record with this value already exists");
  }
  if (error.code === "P2025") {
    throw new Error("Record not found");
  }
  throw error;
}

export class GraphQLError extends Error {
  constructor(
    message: string,
    public code: string = "INTERNAL_SERVER_ERROR",
    public status: number = 500
  ) {
    super(message);
    this.name = "GraphQLError";
  }
}

export function withErrorHandling<TArgs, TResult>(
  resolver: (_: unknown, args: TArgs) => Promise<TResult>
): (_: unknown, args: TArgs) => Promise<TResult> {
  return async (_, args) => {
    try {
      return await resolver(_, args);
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }

      if (error instanceof Error) {
        // Handle Prisma errors
        if (error.message.includes("Record to update does not exist")) {
          throw new GraphQLError("Record not found", "NOT_FOUND", 404);
        }
        if (error.message.includes("Unique constraint failed")) {
          throw new GraphQLError(
            "A record with this value already exists",
            "CONFLICT",
            409
          );
        }

        // Handle other known errors
        throw new GraphQLError(error.message);
      }

      // Handle unknown errors
      throw new GraphQLError("An unexpected error occurred");
    }
  };
}
