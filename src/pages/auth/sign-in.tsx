import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import { EmailStep } from "~/components/EmailStep";
import { VerificationStep } from "~/components/VerificationStep";

const SignIn = () => {
  const [email, setEmail] = React.useState<string | null>(null);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="shadowsm:p-6 w-full max-w-sm rounded-lg border  border-surface-2 bg-surface-1 p-4 md:p-8">
          {email ? (
            <VerificationStep email={email} />
          ) : (
            <EmailStep
              onSuccess={(email) => {
                setEmail(email);
              }}
            />
          )}
        </div>
      </div>
    </main>
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
        destination: "/",
      },
    };
  }
  return { props: {} };
};
