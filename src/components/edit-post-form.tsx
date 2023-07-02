import * as React from "react";
import type { Post } from "@prisma/client";
import * as z from "zod";
import Image from "next/image";

import { cn, toBase64 } from "~/lib/utils";
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
import { type RouterOutputs, api } from "~/utils/api";
import { ImageUpload } from "./image-upload";
import { ImageManage } from "./image-manage";
import { env } from "~/env.mjs";

interface EditPostFormProps extends React.HTMLAttributes<HTMLFormElement> {
  post: RouterOutputs["post"]["readPrivate"];
}

export const editPostFormSchema = z.object({ title: z.string().min(1) });
type FormData = z.infer<typeof editPostFormSchema>;
export function EditPostForm({ post, className, ...props }: EditPostFormProps) {
  const [uploads, setUploads] = React.useState<
    Record<
      string,
      {
        file: File;
        previewImage: string;
        status: "idle" | "uploading" | "error";
      }
    >
  >({});
  const updatePostMutation = api.post.update.useMutation();
  const addImageMutation = api.image.addToPost.useMutation();
  const form = useZodForm({
    schema: editPostFormSchema,
    defaultValues: { title: post.title },
  });
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  async function onSubmit(data: FormData) {
    setIsSaving(true);
    try {
      await updatePostMutation.mutateAsync({ ...data, id: post.id });
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

  const handleUpload = async (file: File) => {
    const id = `${file.name}-${new Date().getTime()}`;
    const previewImage = await toBase64(file);
    setUploads((prev) => ({
      ...prev,
      [id]: { file, previewImage, status: "uploading" },
    }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const cloudinaryUploadResponseSchema = z.object({
        public_id: z.string(),
      });
      const { public_id } = cloudinaryUploadResponseSchema.parse(
        await res.json()
      );
      await addImageMutation.mutateAsync({
        postId: post.id,
        imageKey: public_id,
      });
      setUploads((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Your image was not uploaded. Please try again.",
        variant: "destructive",
      });
      setUploads((prev) => ({
        ...prev,
        [id]: { file, previewImage, status: "error" },
      }));
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          className={cn("space-y-8", className)}
          onSubmit={form.handleSubmit(onSubmit)}
          {...props}
        >
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>
                Make changes to your post here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>
            View, add, delete, and re-arrange your images. Right click or long
            press for options.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-row space-x-4">
            {post.images.map((image) => {
              return (
                <ImageManage
                  key={image.id}
                  image={{
                    id: image.id,
                    key: image.key,
                    alt: "post image",
                  }}
                />
              );
            })}
            {Object.entries(uploads).map(([id, upload]) => {
              return (
                <div className="relative" key={id}>
                  <div className="relative h-thumbnail w-thumbnail overflow-hidden rounded-md grayscale filter">
                    <Image
                      src={upload.previewImage}
                      alt="uploading"
                      fill={true}
                      className={cn("object-cover")}
                      unoptimized
                    />
                  </div>
                  <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center ">
                    {upload.status === "uploading" && (
                      <Icons.spinner className="h-6 w-6 animate-spin text-primary-foreground" />
                    )}
                    {upload.status === "error" && (
                      <Icons.warning className="h-24 w-24 text-destructive" />
                    )}
                  </div>
                </div>
              );
            })}
            <ImageUpload id="image-upload" onConfirm={handleUpload}>
              <div className="flex aspect-square h-32 flex-col items-center justify-center rounded-lg border border-input hover:cursor-pointer">
                <Icons.add className="h-8 w-8" />
                <span className="text-sm">Upload Image</span>
              </div>
            </ImageUpload>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
