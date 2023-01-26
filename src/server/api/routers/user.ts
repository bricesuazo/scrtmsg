import { z } from "zod";
import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "../../../env/server.mjs";
import { generateToken } from "../../../utils/generateToken";
import { getBaseUrl } from "../../../utils/api";

const notAllowedUsername = [
  "signin",
  "signup",
  "settings",
  "api",
  "verify",
  "forgot-password",
  "reset-password",
];

export const userRouter = createTRPCRouter({
  forgotPassword: publicProcedure
    .input(
      z.object({
        input: z.string().trim().min(3),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          OR: [
            {
              username: input.input,
            },
            {
              email: input.input,
            },
          ],
        },
        select: {
          id: true,
          email: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const token = generateToken(32);

      await ctx.prisma.token.create({
        data: {
          token,
          identifier: "PASSWORD_RESET",
          expires: new Date(Date.now() + 1000 * 60 * 60 * 3),
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      sgMail.setApiKey(env.SENDGRID_API_KEY);
      await sgMail
        .send({
          to: user.email,
          from: "scrtmsg@bricesuazo.com",
          subject: "Reset your password",
          html: `
        <h1>Reset your password</h1>
        <p>Click the link below to reset your password</p>
        <a href="${getBaseUrl()}/reset-password?token=${token}">Reset password</a>
        `,
        })
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error("error lods", error);
        });

      return true;
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await ctx.prisma.token.findUnique({
        where: {
          token: input.token,
        },
        select: {
          id: true,
          userId: true,
          identifier: true,
          expires: true,
        },
      });

      if (!token) {
        throw new Error("Token not found");
      }

      if (token.expires < new Date()) {
        throw new Error("Token expired");
      }

      if (token.identifier !== "PASSWORD_RESET") {
        throw new Error("Token not valid");
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      await ctx.prisma.user.update({
        where: {
          id: token.userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      await ctx.prisma.token.deleteMany({
        where: {
          AND: [
            {
              userId: token.userId,
              identifier: "PASSWORD_RESET",
            },
          ],
        },
      });

      return true;
    }),
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      const token = await ctx.prisma.token.findUnique({
        where: {
          token: input.token,
        },
        select: {
          id: true,
          userId: true,
          identifier: true,
          expires: true,
        },
      });

      if (!token) {
        throw new Error("Token not found");
      }

      if (token.expires < new Date()) {
        throw new Error("Token expired");
      }

      if (token.identifier !== "EMAIL_VERIFICATION") {
        throw new Error("Token not valid");
      }

      await ctx.prisma.user.update({
        where: {
          id: token.userId,
        },
        data: {
          emailVerified: new Date(),
        },
      });

      await ctx.prisma.token.delete({
        where: {
          id: token.id,
        },
      });

      return true;
    }),
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

      sgMail
        .send({
          to: input.email, // Change to your recipient
          from: "scrtmsg@bricesuazo.com", // Change to your verified sender
          subject: "Sending with SendGrid is Fun",
          text: "and easy to do anywhere, even with Node.js",
          html: `<strong>and easy to do anywhere, even with Node.js</strong>token:${token.token}`,
        })
        .then(() => {
          console.log("Email sent");
          return true;
        })
        .catch((error) => {
          console.error("error lods", error);
          throw new Error("Error sending email");
        });
    }),
});
