import * as AvatarPrimitive from "@radix-ui/react-avatar";
import Image from "next/image";

export const Avatar = ({
  imageUrl,
  name,
}: {
  imageUrl?: string | null;
  name: string;
}) => (
  <>
    <AvatarPrimitive.Root className="inline-flex h-12 w-12 select-none items-center justify-center overflow-hidden rounded-full align-middle">
      {imageUrl && (
        <AvatarPrimitive.Image
          src={imageUrl}
          className="h-full w-full rounded-full object-cover"
          asChild
        >
          <Image
            src={imageUrl}
            alt={name}
            width={128}
            height={128}
            referrerPolicy="no-referrer"
          />
        </AvatarPrimitive.Image>
      )}
      <AvatarPrimitive.Fallback
        delayMs={600}
        className="flex h-full w-full items-center justify-center bg-black text-white "
      >
        {name.substring(0, 1).toUpperCase()}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  </>
);
