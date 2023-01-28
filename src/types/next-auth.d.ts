import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      username: string;
      emailVerified: Date?;
      email: string;
    } & DefaultSession["user"];
  }
  interface User {
    email: string;
    username: string;
    emailVerified: Date?;
  }
  interface AdapterUser {
    email: string;
    username: string;
    emailVerified: Date?;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    email: string;
    id: string;
    username: string;
    emailVerified: Date?;
  }
}
