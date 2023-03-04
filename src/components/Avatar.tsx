import * as AvatarPrimitive from "@radix-ui/react-avatar";
import Image from "next/image";

export const Avatar = ({
  imageUrl,
  fallback,
}: {
  imageUrl?: string | null;
  fallback?: string | null;
}) => {
  if (!imageUrl && !fallback) return null;
  return (
    <AvatarPrimitive.Root className="inline-flex h-12 w-12 select-none items-center justify-center overflow-hidden rounded-full align-middle">
      {imageUrl && (
        <AvatarPrimitive.Image
          src={imageUrl}
          className="h-full w-full rounded-full border border-solid border-hairline object-cover"
          asChild
        >
          <Image
            src={imageUrl}
            alt="User avatar"
            width={128}
            height={128}
            referrerPolicy="no-referrer"
          />
        </AvatarPrimitive.Image>
      )}
      <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center rounded-full border border-solid border-hairline bg-surface-2 text-text-2">
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};
