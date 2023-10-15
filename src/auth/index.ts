// lucia.ts
import { lucia } from "lucia";
import { libsql } from "@lucia-auth/adapter-sqlite";
import { client } from "@/db";
import { nextjs_future } from "lucia/middleware";
import { cache } from "react";
import * as context from "next/headers";

export const auth = lucia({
  adapter: libsql(client, {
    key: "user_key",
    session: "user_session",
    user: "user",
  }),
  env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },
  experimental: {
    debugMode: true,
  },
  getUserAttributes: (data) => {
    return {
      username: data.username,
      email: data.email,
      emailVerified: data.emailVerified,
    };
  },
});

// export const googleAuth = google(auth, {
//   clientId: process.env.GOOGLE_CLIENT_ID ?? "",
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
//   redirectUri: process.env.GOOGLE_REDIRECT_URI ?? "",
// });

export const getSession = cache(() => {
  const authRequest = auth.handleRequest("GET", context);
  return authRequest.validate();
});

export type Auth = typeof auth;
