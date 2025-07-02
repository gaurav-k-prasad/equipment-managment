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

export async function createContext(): Promise<Context> {
  return {
    prisma: new PrismaClient(),
    // Add user authentication logic here if needed
  };
}
