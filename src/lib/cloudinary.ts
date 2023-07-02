import { buildUrl } from "cloudinary-build-url";
import { imageConfig } from "~/config/image";
import { env } from "~/env.mjs";

const baseOptions = {
  cloud: {
    cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
};

export const toCloudinaryUrl = (
  key: string,
  size: number | undefined = imageConfig.main.square.size
) =>
  buildUrl(key, {
    ...baseOptions,
    transformations: {
      resize: {
        type: "fill",
        width: size * 2,
        height: size * 2,
        aspectRatio: "1:1",
      },
      quality: 100,
      format: "webp",
    },
  });

export const toCloudinaryBlurUrl = (imageId: string) =>
  buildUrl(imageId, {
    ...baseOptions,
    transformations: {
      effect: { name: "blur", value: 1000 },
      quality: 1,
      format: "webp",
    },
  });
