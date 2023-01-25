import { z } from "zod";
import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "../../../env/server.mjs";
import { generateToken } from "../../../utils/generateToken";

const notAllowedUsername = ["signin", "signup", "settings", "api"];

export const userRouter = createTRPCRouter({
  isUsernameExists: publicProcedure
    .input(z.object({ username: z.string().trim().min(3).max(20) }))
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
    .input(z.object({ username: z.string().trim().min(3).max(20) }))
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
        username: z.string().trim().min(3).max(20),
        email: z.string().email(),
        password: z.string().min(8),
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

      const user = await ctx.prisma.user.create({
        data: {
          username: input.username,
          password: hashedPassword,
          email: input.email,
        },
        select: {
          id: true,
        },
      });

      // create a token verification
      const token = await ctx.prisma.token.create({
        data: {
          identifier: "EMAIL_VERIFICATION",
          userId: user.id,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours
          token: generateToken(32),
        },
        select: {
          token: true,
        },
      });

      sgMail.setApiKey(env.SENDGRID_API_KEY);
      const msg = {
        to: input.email, // Change to your recipient
        from: "bricesuazo@gmail.com", // Change to your verified sender
        subject: "Sending with SendGrid is Fun",
        text: "and easy to do anywhere, even with Node.js",
        html: `<strong>and easy to do anywhere, even with Node.js</strong>token:${token.token}`,
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error("error lods", error);
        });

      return true;
    }),
});
