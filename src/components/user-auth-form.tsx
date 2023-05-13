import React from "react";
import { EmailStep } from "./user-auth-email-step";
import { VerificationStep } from "./user-auth-verification-step";

type UserAuthFormProps = {
  email: string | null;
  setEmail: (email: string) => void;
};
export const UserAuthForm = ({ email, setEmail }: UserAuthFormProps) => {
  return (
    <>
      {email ? (
        <VerificationStep email={email} />
      ) : (
        <EmailStep onSuccess={(email: string) => setEmail(email)} />
      )}
    </>
  );
};
