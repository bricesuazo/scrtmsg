"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { reply } from "@/db/schema";

export async function deleteReply({ replyId }: { replyId: string }) {
  return db.delete(reply).where(eq(reply.id, replyId));
}
