// lucia.ts
import { lucia } from "lucia";
import { libsql } from "@lucia-auth/adapter-sqlite";
import { client } from "@/db";
import { nextjs_future } from "lucia/middleware";
import { google } from "@lucia-auth/oauth/providers";
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

  getSessionAttributes: (data) => {
    return data;
  },
});

export const googleAuth = google(auth, {
  clientId: process.env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  redirectUri: "/dashboard",
});

export const getSession = cache(() => {
  const authRequest = auth.handleRequest("GET", context);
  return authRequest.validate();
});
