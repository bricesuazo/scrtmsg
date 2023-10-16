"use server";

import { db } from "@/db";

export async function getAllMessagesWithReplies({
  username,
}: {
  username: string;
}) {
  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  });

  if (!user) throw new Error("User not found");

  const messages = await db.query.message.findMany({
    // take: 10,
    where: (message, { eq }) => eq(message.userId, user.id),
    orderBy: (message, { desc }) => desc(message.createdAt),
    with: {
      replies: {
        with: {
          user: true,
        },
      },
    },
  });

  console.log("🚀 ~ file: user.ts:30 ~ messages:", messages);
  return messages;
}
