import { prisma } from "../../../server/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import NextAuth, { type NextAuthOptions } from "next-auth";
import sgMail from "@sendgrid/mail";
import { generateToken } from "../../../utils/generateToken";
import { env } from "../../../env/server.mjs";
import EmailVerification from "../../../../emails/EmailVerification";
import { render } from "@react-email/render";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.emailVerified = user.emailVerified;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const user = await prisma.user.findUnique({
          where: { id: token.id },
        });
        if (user) {
          session.user.id = user.id;
          session.user.email = user.email;
          session.user.username = user.username;
          session.user.emailVerified = user.emailVerified;
        }
      }
      // if (session.user) {
      //   session.user.id = token.id;
      //   session.user.username = token.username;
      //   session.user.emailVerified = token.emailVerified;
      // }
      return session;
    },
  },
  jwt: {
    secret: "super-secret",
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },

  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username: usernameCredential, password: passwordCredential } =
          credentials as {
            username: string;
            password: string;
          };

        const tempUser = await prisma.temporaryUser.findUnique({
          where: { username: usernameCredential },
          select: { id: true, email: true, username: true },
        });

        if (
          tempUser &&
          (await bcrypt.compare(passwordCredential, tempUser.id))
        ) {
          await prisma.token.deleteMany({
            where: {
              userId: tempUser.id,
              identifier: "EMAIL_VERIFICATION",
            },
          });

          const token = await prisma.token.create({
            data: {
              identifier: "EMAIL_VERIFICATION",
              userId: tempUser.id,
              expires: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours
              token: generateToken(32),
            },
            select: {
              token: true,
            },
          });

          sgMail.setApiKey(env.SENDGRID_API_KEY);

          await sgMail
            .send({
              to: tempUser.email, // Change to your recipient
              from: "scrtmsg@bricesuazo.com", // Change to your verified sender
              subject: "Verify your email",
              html: render(
                <EmailVerification
                  username={tempUser.username}
                  token={token.token}
                />
              ),
            })
            .then(() => {
              console.log("Email sent");
              return true;
            })
            .catch((error) => {
              console.error("error lods", error);
              throw new Error("Error sending email");
            });

          throw new Error("Please verify your email address");
        }

        const user = await prisma.user.findUnique({
          where: { username: usernameCredential },
        });

        if (!user) throw new Error("Invalid username or password");

        const passwordMatch = await bcrypt.compare(
          passwordCredential,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid username or password");
        }

        const { password, ...rest } = user;

        return rest;
      },
    }),
  ],
};

export default NextAuth(authOptions);
