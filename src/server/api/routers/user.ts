import { z } from "zod";
import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { env } from "../../../env/server.mjs";
import { generateToken } from "../../../utils/generateToken";

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
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html lang="en"><head><meta http-equiv="Content-Type" content="text/html charset=UTF-8"/></head><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Please verify your email<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div></div><table style="width:100%;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody><tr><td><div><!--[if mso | IE]>
            <table role="presentation" width="100%" align="center" style="max-width:37.5em;margin:0 auto;padding:20px 0 48px;"><tr><td></td><td style="width:37.5em;background:#ffffff">
          <![endif]--></div><div style="max-width:37.5em;margin:0 auto;padding:20px 0 48px"><a target="_blank" style="color:#067df7;text-decoration:none" href="https://scrtmsg.me/"><img alt="scrtmsg-logo" src="https://raw.githubusercontent.com/bricesuazo/scrtmsg/main/public/images/scrtmsg-logo.png" width="128" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto"/></a><p style="font-size:16px;line-height:26px;margin:16px 0">Hi @${
            input.input
          },</p><p style="font-size:16px;line-height:26px;margin:16px 0">Someone recently requested a password change for your scrtmsg.me account. If this was you, you can set a new password here:</p><table style="width:100%;text-align:center" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody><tr><td><a href="${
            env.DOMAIN + "/reset-password?token=" + token
          }" target="_blank" style="background:linear-gradient(138deg, rgba(167,121,223,1) 0%, rgba(59,45,228,1) 100%);border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:inline-block;p-x:12px;p-y:12px;line-height:100%;max-width:100%;padding:12px 12px"><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%;mso-text-raise:18" hidden>&nbsp;</i><![endif]--></span><span style="background:linear-gradient(138deg, rgba(167,121,223,1) 0%, rgba(59,45,228,1) 100%);border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:inline-block;p-x:12px;p-y:12px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:9px">Reset password</span><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td></tr></tbody></table><p style="font-size:14px;line-height:24px;margin:16px 0">or copy and paste this URL into your browser:<br/><a href="${
            env.DOMAIN + "/reset-password?token=" + token
          }" target="_blank" style="color:#067df7;text-decoration:none" href="">${
            env.DOMAIN + "/reset-password?token=" + token
          }</a></p><p style="font-size:14px;line-height:24px;margin:16px 0">If you don&#x27;t want to change your password or didn&#x27;t request this, just ignore and delete this message.</p><p style="font-size:16px;line-height:26px;margin:16px 0">Best,<br/><a target="_blank" style="color:black;text-decoration:none;&amp;:hover:[object Object]" href="https://bricesuazo.com">Brice Suazo</a> - Creator of scrtmsg.me</p></div><div><!--[if mso | IE]>
          </td><td></td></tr></table>
          <![endif]--></div></td></tr></tbody></table></html>`,
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
  resendVerificationEmail: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.emailVerified) {
        throw new Error("Email already verified");
      }
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          username: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.emailVerified) {
        throw new Error("Email already verified");
      }

      const token = await ctx.prisma.token.create({
        data: {
          identifier: "EMAIL_VERIFICATION",
          token: generateToken(32),
          expires: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      sgMail.setApiKey(env.SENDGRID_API_KEY);

      sgMail
        .send({
          to: input.email, // Change to your recipient
          from: "scrtmsg@bricesuazo.com", // Change to your verified sender
          subject: "Verify your email",
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html lang="en"><head><meta http-equiv="Content-Type" content="text/html charset=UTF-8"/></head><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Please verify your email<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div></div><table style="width:100%;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody><tr><td><div><!--[if mso | IE]>
            <table role="presentation" width="100%" align="center" style="max-width:37.5em;margin:0 auto;padding:20px 0 48px;"><tr><td></td><td style="width:37.5em;background:#ffffff">
          <![endif]--></div><div style="max-width:37.5em;margin:0 auto;padding:20px 0 48px"><a target="_blank" style="color:#067df7;text-decoration:none" href="https://scrtmsg.me/"><img alt="scrtmsg-logo" src="https://raw.githubusercontent.com/bricesuazo/scrtmsg/main/public/images/scrtmsg-logo.png" width="128" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto"/></a><p style="font-size:16px;line-height:26px;margin:16px 0">Hi @${
            user.username
          },</p><p style="font-size:16px;line-height:26px;margin:16px 0">You&#x27;re almost set! Verify your email by tapping the button. Don&#x27;t wait, this message is valid for 3 hours.</p><table style="width:100%;text-align:center" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody><tr><td><a href="${
            env.DOMAIN + "/verify?token=" + token.token
          }" target="_blank" style="background:linear-gradient(138deg, rgba(167,121,223,1) 0%, rgba(59,45,228,1) 100%);border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:inline-block;p-x:12px;p-y:12px;line-height:100%;max-width:100%;padding:12px 12px"><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%;mso-text-raise:18" hidden>&nbsp;</i><![endif]--></span><span style="background:linear-gradient(138deg, rgba(167,121,223,1) 0%, rgba(59,45,228,1) 100%);border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:inline-block;p-x:12px;p-y:12px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:9px">Verify email</span><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td></tr></tbody></table><div><!--[if mso | IE]>
            <table role="presentation" width="100%" align="center" style="max-width:37.5em;"><tr><td></td><td style="width:37.5em;background:#ffffff">
          <![endif]--></div><div style="max-width:37.5em"><p style="font-size:14px;line-height:24px;margin:16px 0">or copy and paste this URL into your browser:<br/><a target="_blank" style="color:#067df7;text-decoration:none" href="${
            env.DOMAIN + "/verify?token=" + token.token
          }">${
            env.DOMAIN + "/verify?token=" + token.token
          }</a></p></div><div><!--[if mso | IE]>
          </td><td></td></tr></table>
          <![endif]--></div><p style="font-size:16px;line-height:26px;margin:16px 0">Best,<br/><a target="_blank" style="color:black;text-decoration:none;&amp;:hover:[object Object]" href="https://bricesuazo.com">Brice Suazo</a> - Creator of scrtmsg.me</p></div><div><!--[if mso | IE]>
          </td><td></td></tr></table>
          <![endif]--></div></td></tr></tbody></table></html>`,
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

      await ctx.prisma.token.deleteMany({
        where: {
          userId: token.userId,
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
          subject: "Verify your email",
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html lang="en"><head><meta http-equiv="Content-Type" content="text/html charset=UTF-8"/></head><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Please verify your email<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div></div><table style="width:100%;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody><tr><td><div><!--[if mso | IE]>
            <table role="presentation" width="100%" align="center" style="max-width:37.5em;margin:0 auto;padding:20px 0 48px;"><tr><td></td><td style="width:37.5em;background:#ffffff">
          <![endif]--></div><div style="max-width:37.5em;margin:0 auto;padding:20px 0 48px"><a target="_blank" style="color:#067df7;text-decoration:none" href="https://scrtmsg.me/"><img alt="scrtmsg-logo" src="https://raw.githubusercontent.com/bricesuazo/scrtmsg/main/public/images/scrtmsg-logo.png" width="128" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto"/></a><p style="font-size:16px;line-height:26px;margin:16px 0">Hi @${
            input.username
          },</p><p style="font-size:16px;line-height:26px;margin:16px 0">You&#x27;re almost set! Verify your email by tapping the button. Don&#x27;t wait, this message is valid for 3 hours.</p><table style="width:100%;text-align:center" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody><tr><td><a href="${
            env.DOMAIN + "/verify?token=" + token.token
          }" target="_blank" style="background:linear-gradient(138deg, rgba(167,121,223,1) 0%, rgba(59,45,228,1) 100%);border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:inline-block;p-x:12px;p-y:12px;line-height:100%;max-width:100%;padding:12px 12px"><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%;mso-text-raise:18" hidden>&nbsp;</i><![endif]--></span><span style="background:linear-gradient(138deg, rgba(167,121,223,1) 0%, rgba(59,45,228,1) 100%);border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:inline-block;p-x:12px;p-y:12px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:9px">Verify email</span><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td></tr></tbody></table><div><!--[if mso | IE]>
            <table role="presentation" width="100%" align="center" style="max-width:37.5em;"><tr><td></td><td style="width:37.5em;background:#ffffff">
          <![endif]--></div><div style="max-width:37.5em"><p style="font-size:14px;line-height:24px;margin:16px 0">or copy and paste this URL into your browser:<br/><a target="_blank" style="color:#067df7;text-decoration:none" href="${
            env.DOMAIN + "/verify?token=" + token.token
          }">${
            env.DOMAIN + "/verify?token=" + token.token
          }</a></p></div><div><!--[if mso | IE]>
          </td><td></td></tr></table>
          <![endif]--></div><p style="font-size:16px;line-height:26px;margin:16px 0">Best,<br/><a target="_blank" style="color:black;text-decoration:none;&amp;:hover:[object Object]" href="https://bricesuazo.com">Brice Suazo</a> - Creator of scrtmsg.me</p></div><div><!--[if mso | IE]>
          </td><td></td></tr></table>
          <![endif]--></div></td></tr></tbody></table></html>`,
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
