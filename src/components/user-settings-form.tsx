import * as React from "react";
import type { User } from "@prisma/client";
import * as z from "zod";

import { cn } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/use-toast";
import { Icons } from "~/components/icons";
import { useZodForm } from "~/hooks/useZodForm";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

interface UsersettingsFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "name">;
}

export const userSettingsFormSchema = z.object({ name: z.string().min(1) });
type FormData = z.infer<typeof userSettingsFormSchema>;
export function UserSettingsForm({
  user,
  className,
  ...props
}: UsersettingsFormProps) {
  const { update } = useSession();
  const mutation = api.user.updateSettings.useMutation({
    onSuccess: () => {
      // eslint thinks this is any, but it's not
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      update();
    },
  });
  const form = useZodForm({
    schema: userSettingsFormSchema,
    defaultValues: { name: user.name || undefined },
  });
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  async function onSubmit(data: FormData) {
    setIsSaving(true);
    try {
      await mutation.mutateAsync(data);
      setIsSaving(false);
      toast({
        description: "Your name has been updated.",
      });
    } catch (error) {
      return toast({
        title: "Something went wrong.",
        description: "Your name was not updated. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn("space-y-8", className)}
        onSubmit={form.handleSubmit(onSubmit)}
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel hidden>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription hidden>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span>Save</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
