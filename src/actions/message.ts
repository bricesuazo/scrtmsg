'use server';

import { getSession } from '@/auth';
import { db } from '@/db';
import { message, reply } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function deleteMessage({ messageId }: { messageId: string }) {
  return db.delete(message).where(eq(message.id, messageId));
}

export async function replyMessage({
  messageId,
  reply: replyMessage,
}: {
  messageId: string;
  reply: string;
}) {
  const session = await getSession();

  if (!session) throw new Error('Session not found');

  return db.insert(reply).values({
    id: nanoid(),
    reply: replyMessage,
    createdAt: new Date(),
    userId: session.user.userId,
    messageId,
  });
}

export async function sendMessageToUsername({
  username,
  message: input,
  codeName,
}: {
  username: string;
  message: string;
  codeName: string | null;
}) {
  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  });

  if (!user) throw new Error('User not found');

  await db.insert(message).values({
    id: nanoid(),
    message: input,
    codeName: codeName,
    userId: user.id,
    createdAt: new Date(),
  });
}
