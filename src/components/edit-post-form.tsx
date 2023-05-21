import * as React from "react";
import type { Post, User } from "@prisma/client";
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

interface EditPostFormProps extends React.HTMLAttributes<HTMLFormElement> {
  post: Pick<Post, "id" | "title">;
}

export const editPostFormSchema = z.object({ title: z.string().min(1) });
type FormData = z.infer<typeof editPostFormSchema>;
export function EditPostForm({ post, className, ...props }: EditPostFormProps) {
  const mutation = api.post.update.useMutation();
  const form = useZodForm({
    schema: editPostFormSchema,
    defaultValues: { title: post.title },
  });
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  async function onSubmit(data: FormData) {
    setIsSaving(true);
    try {
      await mutation.mutateAsync({ ...data, id: post.id });
      toast({
        description: "Your post has been updated.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Your post was not updated. Please try again.",
        variant: "destructive",
      });
    }
    setIsSaving(false);
  }

  return (
    <Form {...form}>
      <form
        className={cn("space-y-8", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the title of your post.
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
