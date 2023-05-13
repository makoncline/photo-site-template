import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { createTransport } from "nodemailer";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config.cjs";
import { z } from "zod";

const fullConfig = resolveConfig(tailwindConfig);
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
  pages: {
    signIn: "/auth/sign-in",
  },
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
    EmailProvider({
      maxAge: 5 * 60,
      generateVerificationToken() {
        const tokenLength = 6;
        const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const token = Array(tokenLength)
          .fill("")
          .map(() => digits[Math.floor(Math.random() * digits.length)])
          .join("");
        return token;
      },
      async sendVerificationRequest(params) {
        const { identifier, token } = params;
        console.log("token", token);
        const url = new URL(params.url);
        url.searchParams.delete("token");
        const signInURL = new URL(
          `/auth/email?${url.searchParams.toString()}`,
          url.origin
        );
        const escapedHost = signInURL.host.replace(/\./g, "&#8203;.");
        let colors = {
          surface: {
            "1": "#0f172a",
          },
          surfaceReverse: {
            "1": "#e2e8f0",
          },
          text: {
            "1": "#e2e8f0",
          },
          textReverse: {
            "1": "#0f172a",
          },
        };
        try {
          colors = colorSchema.parse(fullConfig.theme?.colors);
        } catch (_) {
          // ignore
        }
        const surface = colors.surface?.[1];
        const surfaceReverse = colors.surfaceReverse?.[1];
        const text = colors.text?.[1];
        const textReverse = colors.textReverse?.[1];
        const result = await createTransport(env.EMAIL_SERVER).sendMail({
          to: identifier,
          from: env.EMAIL_FROM,
          subject: `Sign in to ${signInURL.host}`,
          text: `Sign in on ${signInURL.toString()} using the magic code: ${token}`,
          html: `
          <body style="background: ${surface};">
            <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${surface}; max-width: 600px; margin: auto; border-radius: 10px;">
              <tr>
                <td align="center" style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${text};">
                  Sign in to <strong>${escapedHost}</strong> using this magic code:
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <div style="background-color: ${surfaceReverse}; border-radius: 5px; padding: 20px;">
                    <p style="font-size: 24px; font-family: Helvetica, Arial, sans-serif; color: ${textReverse}; text-align: center; margin: 0;">
                      ${token}
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${text};">
                  If you did not request this email you can safely ignore it.
                </td>
              </tr>
            </table>
          </body>
          `,
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
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

const colorSchema = z.object({
  surface: z.object({
    "1": z.string(),
  }),
  surfaceReverse: z.object({
    "1": z.string(),
  }),
  text: z.object({
    "1": z.string(),
  }),
  textReverse: z.object({
    "1": z.string(),
  }),
});
