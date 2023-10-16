"use server";

import { auth, getSession } from "@/auth";
import { sendEmailVerificationLink, sendPasswordResetLink } from "@/auth/email";
import { db } from "@/db";
import { signInSchema, signUpSchema } from "@/lib/zod-schema";
import { LibsqlError } from "@libsql/client";
import { LuciaError } from "lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import z from "zod";

export async function signUp(formData: FormData) {
  // const unparsedEmail = formData.get("email");
  const unparsedIsValidCaptcha = Boolean(formData.get("isValidCaptcha"));
  const unparsedUsername = formData.get("username");
  const unparsedUassword = formData.get("password");
  // basic check

  const { username, password, isValidCaptcha } = signUpSchema.parse({
    // email: unparsedEmail,
    username: unparsedUsername,
    password: unparsedUassword,
    isValidCaptcha: unparsedIsValidCaptcha,
  });

  if (!isValidCaptcha) {
    return {
      error: "Invalid captcha",
    };
  }

  try {
    const user = await auth.createUser({
      key: {
        providerId: "username", // auth method
        providerUserId: username.toLowerCase(), // unique id when using "username" auth method
        password, // hashed by Lucia
      },
      attributes: {
        username,
        // email,
        // emailVerified: null,
      },
    });
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest("POST", context);
    authRequest.setSession(session);
    // const token = await generateEmailVerificationToken(user.userId);
    // await sendEmailVerificationLink(token);
    NextResponse.redirect("/verify");
    return {};
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

  const { username, password } = signInSchema.parse({
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
    NextResponse.redirect("/");
    return {};
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

// export async function sendEmailVerification() {
//   const session = await getSession();
//   if (!session) {
//     return {
//       error: "Unauthorized",
//     };
//   }
//   if (session.user.emailVerified) {
//     return {
//       error: "Email already verified",
//     };
//   }
//   try {
//     const token = await generateEmailVerificationToken(session.user.userId);
//     await sendEmailVerificationLink(token);
//     return new Response();
//   } catch {
//     return {
//       error: "An unknown error occurred",
//     };
//   }
// }

// export async function validateEmailVerification({ token }: { token: string }) {
//   try {
//     const userId = await validateEmailVerificationToken(token);
//     const user = await auth.getUser(userId);
//     await auth.invalidateAllUserSessions(user.userId);
//     await auth.updateUserAttributes(user.userId, {
//       emailVerified: new Date().getTime(),
//     });
//     const session = await auth.createSession({
//       userId: user.userId,
//       attributes: {},
//     });
//     const authRequest = auth.handleRequest("POST", context);
//     authRequest.setSession(session);
//   } catch {
//     return { error: "Invalid email verification link" };
//   }
// }

// export async function sendResetPassword(formData: FormData) {
//   const unparsedEmail = formData.get("email");

//   const { email } = z
//     .object({
//       email: z.string().email({
//         message: "Invalid email.",
//       }),
//     })
//     .parse({
//       email: unparsedEmail,
//     });

//   try {
//     const storedUser = await db.query.user.findFirst({
//       where: (users, { eq }) => eq(users.email, email),
//     });
//     if (!storedUser) {
//       return {
//         error: "User does not exist",
//       };
//     }
//     const user = auth.transformDatabaseUser(storedUser);
//     const token = await generatePasswordResetToken(user.userId);
//     await sendPasswordResetLink(token);
//   } catch (e) {
//     return {
//       error: "An unknown error occurred",
//     };
//   }
// }

// export async function validateResetPassword(
//   formData: FormData,
//   { token }: { token: string }
// ) {
//   const unparsedPassword = formData.get("password");
//   // basic check
//   const { password } = z
//     .object({
//       password: z
//         .string()
//         .min(8, {
//           message: "Password must be at least 8 characters long.",
//         })
//         .max(100, {
//           message: "Password must be at most 100 characters long.",
//         }),
//     })
//     .parse({
//       password: unparsedPassword,
//     });

//   try {
//     const userId = await validatePasswordResetToken(token);
//     let user = await auth.getUser(userId);
//     await auth.invalidateAllUserSessions(user.userId);
//     await auth.updateKeyPassword("email", user.email, password);
//     if (!user.emailVerified) {
//       user = await auth.updateUserAttributes(user.userId, {
//         emailVerified: new Date().getTime(),
//       });
//     }
//     const session = await auth.createSession({
//       userId: user.userId,
//       attributes: {},
//     });
//     const authRequest = auth.handleRequest("POST", context);
//     authRequest.setSession(session);
//   } catch (e) {
//     return {
//       error: "Invalid or expired password reset link",
//     };
//   }
// }

export async function verifyCaptcha(token: string | null) {
  const res = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    { method: "POST" }
  );
  if (res.ok) {
    return "success!";
  } else {
    throw new Error("Failed Captcha");
  }
}
