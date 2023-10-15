import { auth } from "@/lib/auth";
import * as context from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const authRequest = auth.handleRequest(request.method, context);

  const session = await authRequest.validate();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await auth.invalidateSession(session.sessionId);

  authRequest.setSession(null);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/sign-in",
    },
  });
};
