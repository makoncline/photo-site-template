import { useRouter } from "next/router";
import React from "react";
import { z } from "zod";
import { useStatus } from "~/hooks/useStatus";
import { useZodForm } from "~/hooks/useZodForm";
import { toast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { Icons } from "./icons";
import { buttonVariants } from "./ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const verificationFormSchema = z.object({ code: z.string().min(6) });
type VerificationFormValues = z.infer<typeof verificationFormSchema>;

type VerificationStepProps = {
  email: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const VerificationStep = ({
  email,
  className,
  ...props
}: VerificationStepProps) => {
  const router = useRouter();
  const { setStatus, isLoading } = useStatus();
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useZodForm({
    schema: verificationFormSchema,
  });
  const onSubmit = async ({ code }: VerificationFormValues) => {
    setStatus("loading");
    const res = await fetch(
      `/api/auth/callback/email?email=${encodeURIComponent(
        email
      )}&token=${code}`
    );
    if (!res.ok) {
      setStatus("error");
      return toast({
        title: "Something went wrong.",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      });
    }
    router.reload();
  };
  return (
    <>
      <div className={cn("grid gap-2", className)} {...props}>
        <form
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values);
            reset();
          })}
        >
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="code">
                Code:
              </Label>
              <Input
                id="code"
                placeholder="ABC123"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                {...register("code")}
              />
              {errors?.code && (
                <p className="px-1 text-xs text-red-600">
                  {errors.code.message}
                </p>
              )}
            </div>
            <button className={cn(buttonVariants())} disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
