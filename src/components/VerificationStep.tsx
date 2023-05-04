import { useRouter } from "next/router";
import React from "react";
import { z } from "zod";
import { useZodForm } from "~/hooks/useZodForm";

const verificationFormSchema = z.object({ code: z.string().min(6) });
type VerificationFormValues = z.infer<typeof verificationFormSchema>;
export const VerificationStep = ({ email }: { email: string }) => {
  const router = useRouter();
  const [status, setStatus] = React.useState<"idle" | "loading" | "error">(
    "idle"
  );
  const isLoading = status === "loading";
  const isError = status === "error";
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useZodForm({
    schema: verificationFormSchema,
  });
  const handleVerify = async ({ code }: VerificationFormValues) => {
    setStatus("loading");
    const res = await fetch(
      `/api/auth/callback/email?email=${encodeURIComponent(
        email
      )}&token=${code}`
    );
    if (!res.ok) {
      setStatus("error");
      return;
    }
    router.reload();
  };
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-medium text-text-1">Email Sent</h1>
      <p>
        Check your inbox! If we found your email address you'll have a magic
        code to login waiting for you. Sometimes this can land in SPAM! While we
        hope that isn't the case if it doesn't arrive in a minute or three,
        please check.
      </p>
      <form
        className="space-y-6"
        onSubmit={handleSubmit(async (values) => {
          await handleVerify(values);
          reset();
        })}
      >
        <div className="space-y-2">
          <label
            htmlFor="code"
            className="mb-2 block text-sm font-medium text-text-1"
          >
            Magic code:
          </label>
          <input
            {...register("code")}
            placeholder="ABC123"
            className="block w-full rounded-lg border border-surface-4 bg-surface-3  p-2.5 text-sm text-text-1 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.code && <p className="text-danger">{errors.code.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-brand-2 py-2.5 text-text-1 hover:bg-brand-1"
        >
          {isLoading ? "Please wait..." : "Verify"}
        </button>
        {isError && (
          <p className="text-danger">Invalid Code. Please try again.</p>
        )}
      </form>
    </div>
  );
};
