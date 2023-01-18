import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const messageRouter = createTRPCRouter({
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

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany();
  }),
});
