import * as React from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import * as z from "zod";

import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "~/components/ui/use-toast";
import { Icons } from "~/components/icons";
import { useZodForm } from "~/hooks/useZodForm";
import { useStatus } from "~/hooks/useStatus";

const emailFormSchema = z.object({ email: z.string().email() });
type EmailFormValues = z.infer<typeof emailFormSchema>;

type EmailStepProps = {
  onSuccess: (email: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export function EmailStep({ onSuccess, className, ...props }: EmailStepProps) {
  const { setStatus, isLoading } = useStatus();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useZodForm({
    schema: emailFormSchema,
  });
  const onSubmit = async ({ email }: EmailFormValues) => {
    setStatus("loading");
    const signInResult = await signIn("email", {
      email: email.toLowerCase(),
      redirect: false,
      callbackUrl: searchParams?.get("from") || "/dashboard",
    });
    if (!signInResult?.ok) {
      setStatus("error");
      return toast({
        title: "Something went wrong.",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      });
    }
    onSuccess(email);

    return toast({
      title: "Check your email",
      description: "We sent you a login code. Be sure to check your spam too.",
    });
  };
  const searchParams = useSearchParams();

  return (
    <div className={cn(className)} {...props}>
      <form
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values);
          reset();
        })}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </button>
        </div>
      </form>
    </div>
  );
}
