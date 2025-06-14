import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

export interface Context {
  prisma: PrismaClient;
  user?: {
    id: string;
    role: string;
  };
}

export class AuthenticationError extends Error {
  constructor(message: string = "Not authenticated") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = "Not authorized") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export async function createContext({
  req,
}: {
  req: NextRequest;
}): Promise<Context> {
  const prisma = new PrismaClient();

  // Get the token from the Authorization header
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  let user;
  if (token) {
    try {
      // Verify token and get user info
      // This is a placeholder - implement your actual token verification logic
      user = {
        id: "user-id",
        role: "user-role",
      };
    } catch (error) {
      throw new AuthenticationError("Invalid token");
    }
  }

  return {
    prisma,
    user,
  };
}
