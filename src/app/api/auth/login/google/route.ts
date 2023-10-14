import { auth, googleAuth } from "@/lib/auth";
import * as context from "next/headers";

import type { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const authRequest = auth.handleRequest(request.method, context);
  const session = await authRequest.validate();
  if (session) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }
  const [url, state] = await googleAuth.getAuthorizationUrl();
  const cookieStore = context.cookies();
  cookieStore.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
};
