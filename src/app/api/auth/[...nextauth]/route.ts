import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

interface User {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  password?: string | null;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as User).role;
      }

      // Handle OAuth account linking
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: token.email! },
        });

        if (existingUser) {
          // Update the user's Google account link
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: account.providerAccountId,
              },
            },
            update: {
              userId: existingUser.id,
            },
            create: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: (account.refresh_token as string) || null,
              access_token: (account.access_token as string) || null,
              expires_at: (account.expires_at as number) || null,
              token_type: (account.token_type as string) || null,
              scope: (account.scope as string) || null,
              id_token: (account.id_token as string) || null,
              session_state: (account.session_state as string) || null,
            },
          });

          token.role = existingUser.role as UserRole;
        }
      }

      return token;
    },
    async signIn({ user, account, profile }) {
      // Allow OAuth sign in
      if (account?.provider === "google") {
        return true;
      }

      // Allow credentials sign in
      if (account?.type === "credentials") {
        return true;
      }

      return false;
    },
  },
  events: {
    async linkAccount({ user, account, profile }) {
      // Handle account linking
      console.log("Account linked:", {
        userId: user.id,
        provider: account.provider,
      });
    },
  },
});
