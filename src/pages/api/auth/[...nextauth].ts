import { prisma } from "./../../../server/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import NextAuth, { type NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials?.username },
        });

        if (!user) return null;
        console.log("🚀 ~ file: [...nextauth].ts:34 ~ authorize ~ user", user);
        const passwordMatch = await bcrypt.compare(
          credentials?.password,
          user.password
        );

        if (passwordMatch) {
          console.log("match");
          return user;
        }

        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
