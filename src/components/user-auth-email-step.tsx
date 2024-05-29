import * as React from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import * as z from "zod";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/use-toast";
import { Icons } from "~/components/icons";
import { useZodForm } from "~/hooks/useZodForm";
import { useStatus } from "~/hooks/useStatus";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

const emailFormSchema = z.object({ email: z.string().email() });
type EmailFormValues = z.infer<typeof emailFormSchema>;

type EmailStepProps = {
  onSuccess: (email: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export function EmailStep({ onSuccess, className, ...props }: EmailStepProps) {
  const { setStatus, isLoading } = useStatus();
  const form = useZodForm({
    schema: emailFormSchema,
    defaultValues: { email: "" },
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </form>
      </Form>
    </div>
  );
}
