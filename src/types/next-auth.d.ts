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
    } & DefaultSession["user"];
  }
  interface User {
    username: string;
    emailVerified: Date?;
  }
  interface AdapterUser {
    username: string;
    emailVerified: Date?;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    username: string;
    emailVerified: Date?;
  }
}
