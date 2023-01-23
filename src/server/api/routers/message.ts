import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const messageRouter = createTRPCRouter({
  reply: protectedProcedure
    .input(z.object({ messageId: z.string(), reply: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.reply.create({
        data: {
          reply: input.reply,
          message: {
            connect: {
              id: input.messageId,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  sendMessageToUsername: publicProcedure
    .input(z.object({ username: z.string(), message: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.message.create({
        data: {
          message: input.message,
          user: {
            connect: {
              username: input.username,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.message.delete({
        where: {
          id: input.id,
        },
      });
    }),

  getAllPublicMessages: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.message.findMany({
        where: {
          // AND: [
          // {
          replies: {
            some: {
              user: {
                username: input.username,
              },
            },
          },
          // },
          // {
          //   status: "PUBLIC",
          // },
          // ],
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          replies: true,
        },
      });
    }),

  getAllMessagesWithReplies: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany({
      where: {
        user: {
          username: ctx.session.user.username,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        replies: {
          include: {
            user: true,
          },
        },
      },
    });
  }),
  deleteReply: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.reply.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
