'use server';

import { db } from '@/db';
import { notAllowedUsername } from '@/lib/utils';

export async function getAllMessagesWithReplies({
  username,
}: {
  username: string;
}) {
  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  });

  if (!user) throw new Error('User not found');

  const messages = await db.query.message.findMany({
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

  return messages;
}

export async function isUsernameExists({ username }: { username: string }) {
  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  });

  return !!user;
}

export async function getUserByUsername({ username }: { username: string }) {
  if (notAllowedUsername.includes(username.toLowerCase())) return null;

  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  });

  if (!user) return null;

  return user;
}

export async function getAllPublicMessages({ username }: { username: string }) {
  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  });

  if (!user) throw new Error('User not found');

  return db.query.message.findMany({
    // where: {
    //   replies: {
    //     some: {
    //       user: {
    //         username: input.username,
    //       },
    //     },
    //   },
    // },

    where: (message, { eq }) => eq(message.userId, user.id),
    orderBy: (message, { desc }) => desc(message.createdAt),
    with: {
      replies: true,
    },
  });
}
