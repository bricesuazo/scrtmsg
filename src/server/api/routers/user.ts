import { z } from "zod";
import bcrypt from "bcrypt";

import { createTRPCRouter, publicProcedure } from "../trpc";

const notAllowedUsername = ["signin", "signup", "settings", "contact"];

export const userRouter = createTRPCRouter({
  isUsernameExists: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (notAllowedUsername.includes(input.username.toLowerCase()))
        return true;

      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });
      return !!user;
    }),

  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (notAllowedUsername.includes(input.username.toLowerCase()))
        return null;

      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
        select: {
          username: true,
          email: true,
          id: true,
        },
      });
      return user;
    }),

  signUp: publicProcedure
    .input(
      z.object({
        username: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (notAllowedUsername.includes(input.username.toLowerCase()))
        throw new Error("Username not allowed");

      const emailInUse = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (emailInUse) {
        throw new Error("Email already in use");
      }

      // check if username is already in use
      const usernameInUse = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });
      if (usernameInUse) {
        throw new Error("Username already in use");
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      await ctx.prisma.user.create({
        data: {
          username: input.username,
          password: hashedPassword,
          email: input.email,
        },
      });
      return true;
    }),
});
