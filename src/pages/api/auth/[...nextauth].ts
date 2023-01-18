import { prisma } from "./../../../server/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import NextAuth, { type NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
  },
  jwt: {
    secret: "super-secret",
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },

  // pages: {
  //   signIn: "/signin",
  // },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { username: usernameCredential, password: passwordCredential } =
          credentials as {
            username: string;
            password: string;
          };

        const user = await prisma.user.findUnique({
          where: { username: usernameCredential },
        });

        if (!user) return null;
        const passwordMatch = await bcrypt.compare(
          passwordCredential,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid username or password");
        }

        const { password, emailVerified, ...rest } = user;

        return rest;
      },
    }),
  ],
};

export default NextAuth(authOptions);
