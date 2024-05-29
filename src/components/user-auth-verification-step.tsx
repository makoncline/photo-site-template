import { useRouter } from "next/router";
import React from "react";
import { z } from "zod";
import { useStatus } from "~/hooks/useStatus";
import { useZodForm } from "~/hooks/useZodForm";
import { toast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { Icons } from "./icons";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import register from "~/pages/auth/register";

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
  const form = useZodForm({
    schema: verificationFormSchema,
    defaultValues: { code: "" },
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
    <div className={cn(className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Code:</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    {...field}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Verify
          </Button>
        </form>
      </Form>
    </div>
  );
};
