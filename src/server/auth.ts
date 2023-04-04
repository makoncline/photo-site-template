import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { createTransport } from "nodemailer";
import crypto from "node:crypto";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  // ...other properties
  // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      generateVerificationToken() {
        const random = crypto.getRandomValues(new Uint8Array(8));
        return Buffer.from(random).toString("hex").slice(0, 6);
      },
      async sendVerificationRequest(params) {
        const { identifier, token } = params;
        const url = new URL(params.url);
        url.searchParams.delete("token");
        const signInURL = new URL(
          `/auth/email?${url.searchParams.toString()}`,
          url.origin
        );
        const escapedHost = signInURL.host.replace(/\./g, "&#8203;.");
        const surface = "#020617";
        const brand = "#60a5fa";
        const text = "#e2e8f0";
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const result = await createTransport(env.EMAIL_SERVER).sendMail({
          to: identifier,
          from: env.EMAIL_FROM,
          subject: `Sign in to ${signInURL.host}`,
          text: `Sign in on ${signInURL.toString()} using the verification code: ${token}`,
          html: `<body style="background: #f9f9f9;"><table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: #fff; max-width: 600px; margin: auto; border-radius: 10px;"> <tr> <td align="center" style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #444;"> Sign in to <strong>${escapedHost}</strong> using this verification code: ${token}</td></tr><tr> <td align="center" style="padding: 20px 0;"> <table border="0" cellspacing="0" cellpadding="0"> <tr> <td align="center" style="border-radius: 5px;" bgcolor="${surface}"><a href="${signInURL.toString()}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${text}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${brand}; display: inline-block; font-weight: bold;">Sign in</a></td></tr></table> </td></tr><tr> <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #444;"> If you did not request this email you can safely ignore it. </td></tr></table></body>`,
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (failed.length) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
