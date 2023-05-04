import { signIn } from "next-auth/react";
import React from "react";
import { z } from "zod";
import { useZodForm } from "~/hooks/useZodForm";

const emailFormSchema = z.object({ email: z.string().email() });
type EmailFormValues = z.infer<typeof emailFormSchema>;
export const EmailStep = ({
  onSuccess,
}: {
  onSuccess: (email: string) => void;
}) => {
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
    schema: emailFormSchema,
  });
  const handleEmailLogin = async ({ email }: EmailFormValues) => {
    setStatus("loading");
    const res = await signIn("email", {
      email: email,
      redirect: false,
    });
    if (!res?.ok) {
      setStatus("error");
      return;
    }
    onSuccess(email);
  };
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-medium text-text-1">Sign In</h1>
      <form
        onSubmit={handleSubmit(async (values) => {
          await handleEmailLogin(values);
          reset();
        })}
        className="space-y-6"
      >
        <div className="space-y-2">
          <label
            htmlFor="code"
            className="mb-2 block text-sm font-medium text-text-1"
          >
            Email address:
          </label>
          <input
            {...register("email")}
            placeholder="hello@example.com"
            className="block w-full rounded-lg border border-surface-4 bg-surface-3  p-2.5 text-sm text-text-1 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-400">{errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-brand-2 py-2.5 text-text-1 hover:bg-brand-1"
        >
          {isLoading ? "Please wait..." : "Send code"}
        </button>
        {isError && (
          <p className="text-red-400">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};
