import Image from "next/image";

import { cn } from "~/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { Icons } from "./icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { imageConfig } from "~/config/image";
import { api } from "~/utils/api";
import { toast } from "./ui/use-toast";
import { toCloudinaryBlurUrl, toCloudinaryUrl } from "~/lib/cloudinary";

type ImageManageProps = React.HTMLAttributes<HTMLDivElement> & {
  image: { id: string; key: string; alt: string };
};

export function ImageManage({ image, className, ...props }: ImageManageProps) {
  const [showFullImage, setShowFullImage] = React.useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const deleteImageMutation = api.image.delete.useMutation();
  const changeOrderMutation = api.image.changeOrder.useMutation();
  const handleImageDelete = async () => {
    try {
      await deleteImageMutation.mutateAsync({ id: image.id });
    } catch (error) {
      console.error(error);
      toast({
        title: "Something went wrong.",
        description: "Your image was not deleted. Please try again.",
        variant: "destructive",
      });
    }
  };
  const handleChangeOrder = async (increment: number) => {
    try {
      const result = await changeOrderMutation.mutateAsync({
        id: image.id,
        increment,
      });
      console.log(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Something went wrong.",
        description: "Your image was not moved. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu modal={false}>
        <ContextMenuTrigger onClick={() => setShowFullImage(true)}>
          <div className="relative overflow-hidden rounded-md border">
            <div
              className="absolute top-0 left-0 z-0 h-full w-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${toCloudinaryBlurUrl(image.key)} `,
              }}
            />
            <div className="relative z-10 h-thumbnail w-thumbnail">
              <Image
                src={toCloudinaryUrl(
                  image.key,
                  imageConfig.thumbnail.square.size
                )}
                alt={image.alt || "post image"}
                fill={true}
                className={cn(
                  "object-cover transition-all hover:scale-105",
                  "aspect-square"
                )}
                unoptimized={true}
              />
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem onClick={() => handleChangeOrder(-1)}>
            <Icons.arrowLeft className="mr-2 h-4 w-4" />
            Move left
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleChangeOrder(1)}>
            <Icons.arrowRight className="mr-2 h-4 w-4" />
            Move right
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => setShowDeleteAlert(true)}
            className="text-destructive focus:text-destructive"
          >
            <Icons.trash className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <Dialog
        open={showFullImage}
        onOpenChange={(open) => setShowFullImage(open)}
      >
        <DialogContent>
          <div className="flex h-full w-full items-center justify-center">
            <div className="relative">
              <div
                className="absolute top-0 left-0 z-0 h-image w-image bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${toCloudinaryBlurUrl(image.key)} `,
                }}
              />
              <div className="relative z-10 h-image w-image">
                <Image
                  src={toCloudinaryUrl(image.key)}
                  alt={image.alt}
                  fill={true}
                  className={cn("object-cover")}
                  unoptimized={true}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={showDeleteAlert}
        onOpenChange={(open) => {
          setShowDeleteAlert(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              image and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleImageDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
