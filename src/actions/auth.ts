"use server";

import { auth } from "@/lib/auth";
import { authSchema } from "@/lib/zod-schema";
import { LibsqlError } from "@libsql/client";
import { LuciaError } from "lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const unparsedUsername = formData.get("username");
  const unparsedUassword = formData.get("password");
  // basic check

  const { username, password } = authSchema.parse({
    username: unparsedUsername,
    password: unparsedUassword,
  });

  try {
    const user = await auth.createUser({
      key: {
        providerId: "username", // auth method
        providerUserId: username.toLowerCase(), // unique id when using "username" auth method
        password, // hashed by Lucia
      },
      attributes: {
        username,
      },
    });
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest("POST", context);
    authRequest.setSession(session);
    redirect("/");
  } catch (e) {
    console.log("🚀 ~ file: route.ts:65 ~ POST ~ e:", e);
    // this part depends on the database you're using
    // check for unique constraint error in user table
    if (e instanceof LibsqlError && e.message === "") {
      return {
        error: "Username already taken",
      };
    }
    return {
      error: "An unknown error occurred",
    };
  }
}

export async function signOut() {
  const authRequest = auth.handleRequest("POST", context);

  const session = await authRequest.validate();
  if (!session) {
    return { error: "Unauthorized" };
  }

  await auth.invalidateSession(session.sessionId);

  authRequest.setSession(null);

  redirect("/sign-in");
}

export async function signIn(formData: FormData) {
  const unparsedUsername = formData.get("username");
  const unparsedUassword = formData.get("password");
  // basic check

  const { username, password } = authSchema.parse({
    username: unparsedUsername,
    password: unparsedUassword,
  });

  try {
    // find user by key
    // and validate password
    const key = await auth.useKey("username", username.toLowerCase(), password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest("POST", context);
    authRequest.setSession(session);
    redirect("/");
  } catch (e) {
    if (
      e instanceof LuciaError &&
      (e.message === "AUTH_INVALID_KEY_ID" ||
        e.message === "AUTH_INVALID_PASSWORD")
    ) {
      // user does not exist
      // or invalid password
      return {
        error: "Incorrect username or password",
      };
    }
    return {
      error: "An unknown error occurred",
    };
  }
}
