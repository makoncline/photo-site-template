import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const imageRouter = createTRPCRouter({
  addToPost: protectedProcedure
    .input(z.object({ postId: z.string(), imageKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { postId, imageKey } = input;
      const userId = ctx.session.user.id;

      const post = await db.post.findUnique({ where: { id: postId } });
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      if (userId !== post.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this post",
        });
      }

      const imageOrdersCount = await db.imageOrder.count({
        where: { postId },
      });

      const image = await db.image.create({
        data: {
          key: imageKey,
          published: true,
          userId,
          postId,
          imageOrder: {
            create: {
              order: imageOrdersCount + 1,
              postId,
            },
          },
        },
      });
      return image;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const image = await db.image.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          imageOrder: true,
        },
      });
      if (userId !== image.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this image",
        });
      }
      const imageOrderToDelete = image.imageOrder?.order;
      if (imageOrderToDelete) {
        await db.$transaction([
          db.imageOrder.delete({
            where: { id: image.imageOrder?.id },
          }),
          db.image.delete({
            where: { id: input.id },
          }),
        ]);
        const remainingImageOrders = await db.imageOrder.findMany({
          where: { postId: image.postId },
          orderBy: { order: "asc" },
        });
        for (const imageOrder of remainingImageOrders) {
          if (imageOrder.order > imageOrderToDelete) {
            await db.imageOrder.update({
              where: { id: imageOrder.id },
              data: { order: imageOrder.order - 1 },
            });
          }
        }
      }
      return true;
    }),
  changeOrder: protectedProcedure
    .input(z.object({ id: z.string(), increment: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const image = await db.image.findUniqueOrThrow({
        where: { id: input.id },
      });

      // Ensure the user is authorized to change the order of this image.
      if (userId !== image.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to change the order of this image",
        });
      }

      const imageOrder = await db.imageOrder.findFirstOrThrow({
        where: { imageId: image.id },
      });

      const totalImages = await db.imageOrder.count({
        where: { postId: image.postId },
      });
      const oldOrder = imageOrder ? imageOrder.order : totalImages + 1;
      let newOrder = oldOrder + input.increment;
      console.log({ oldOrder, newOrder });

      // Ensure the new order is within valid bounds
      if (newOrder < 1) {
        newOrder = 1;
      } else if (newOrder > totalImages + 1) {
        newOrder = totalImages + 1;
      }

      // Get all image orders for the post and sort them
      const allImages = await db.imageOrder.findMany({
        where: { postId: image.postId },
        orderBy: { order: "asc" },
      });

      // Remove the image being moved from the array
      const otherImages = allImages.filter((img) => img.imageId !== image.id);

      // Insert the image at its new position. Adjust the index based on the increment.
      const insertIndex = newOrder - 1;
      otherImages.splice(insertIndex, 0, { ...imageOrder, order: newOrder });

      // Update all image orders to match their position in the array
      const updates = otherImages.map((img, index) =>
        db.imageOrder.update({
          where: { id: img.id },
          data: { order: index + 1 },
        })
      );

      // Perform all updates in a single transaction.
      await db.$transaction(updates);

      return true;
    }),
});
