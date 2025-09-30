import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "./app/libs/prismadb";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (
        credentials: Partial<Record<"email" | "password", unknown>>,
        req: Request
      ) => {
        try {
          // Validate types
          if (
            !credentials?.email ||
            typeof credentials.email !== "string" ||
            !credentials?.password ||
            typeof credentials.password !== "string"
          ) {
            throw new Error("Invalid credentials");
          }

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          // Check user existence and password hash
          if (!user || !user.hashedPassword) {
            throw new Error("Invalid credentials");
          }

          // Compare passwords
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isCorrectPassword) {
            throw new Error("Invalid credentials");
          }

          return user;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});
