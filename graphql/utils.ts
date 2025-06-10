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

export function buildWhereClause(filters: Record<string, any>) {
  const where: Record<string, any> = {};

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

export function handlePrismaError(error: any) {
  if (error.code === "P2002") {
    throw new Error("A record with this value already exists");
  }
  if (error.code === "P2025") {
    throw new Error("Record not found");
  }
  throw error;
}
