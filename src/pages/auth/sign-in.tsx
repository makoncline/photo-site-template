import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Icons } from "~/components/icons";
import { UserAuthForm } from "~/components/user-auth-form";

const SignIn = () => {
  const [email, setEmail] = React.useState<string | null>(null);
  return (
    <>
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute left-4 top-4 md:left-8 md:top-8"
          )}
        >
          <>
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back
          </>
        </Link>
        <div className="mx-auto flex w-full flex-col space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2">
            {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
            <h1 className="text-2xl font-semibold tracking-tight">
              {email ? "Email sent" : "Welcome back"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {email
                ? "Enter the code we sent to your email address to sign in to your account. If you don't see the email, check your spam folder."
                : "Enter your email to sign in to your account"}
            </p>
          </div>
          <UserAuthForm email={email} setEmail={setEmail} />
          <p className="text-sm text-muted-foreground">
            <Link
              href="/auth/register"
              className="hover:text-brand underline underline-offset-4"
            >
              Don&apos;t have an account? Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      props: {},
      redirect: {
        dpermanent: false,
        destination: "/dashboard",
      },
    };
  }
  return { props: {} };
};
