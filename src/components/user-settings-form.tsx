"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { User } from "@prisma/client";
import * as z from "zod";

import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "~/components/ui/use-toast";
import { Icon } from "~/components/icon";
import { useZodForm } from "~/hooks/useZodForm";

interface UsersettingsFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "name">;
}

const userSettingsSchema = z.object({ name: z.string().min(1) });
type FormData = z.infer<typeof userSettingsSchema>;
export function UserSettingsForm({
  user,
  className,
  ...props
}: UsersettingsFormProps) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useZodForm({
    schema: userSettingsSchema,
  });
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  async function onSubmit(data: FormData) {
    setIsSaving(true);
    // actually save using trpc here
    const response = await Promise.resolve({ ok: true });
    setIsSaving(false);

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your name was not updated. Please try again.",
        variant: "destructive",
      });
    }

    toast({
      description: "Your name has been updated.",
    });

    router.refresh();
  }

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Your Name</CardTitle>
          <CardDescription>
            Please enter your full name or a display name you are comfortable
            with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className="w-[400px]"
              size={32}
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <button
            type="submit"
            className={cn(buttonVariants(), className)}
            disabled={isSaving}
          >
            {isSaving && <Icon.spinner className="mr-2 h-4 w-4 animate-spin" />}
            <span>Save</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  );
}
