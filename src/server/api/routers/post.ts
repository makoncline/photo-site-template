import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { getUserSubscriptionPlan } from "~/server/stripe/getSubscriptionPlan";

const DEFAULT_POST_TITLE = "Untitled Post";
const MAX_FREE_POSTS = 3;

export const postRouter = createTRPCRouter({
  readPrivate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const post = await db.post.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          imageOrders: {
            include: {
              image: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      });
      if (userId !== post.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to view this post",
        });
      }
      const images = post.imageOrders.map((imageOrder) => imageOrder.image);
      return { ...post, images };
    }),
  readAllPrivate: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const posts = await db.post.findMany({
      where: {
        userId: userId,
      },
    });
    return posts;
  }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const subscriptionPlan = await getUserSubscriptionPlan(userId);
    if (!subscriptionPlan.isPro) {
      const count = await db.post.count({
        where: {
          userId: userId,
        },
      });
      if (count >= MAX_FREE_POSTS) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "You have reached the maximum number of posts for your subscription plan",
        });
      }
    }
    const post = await db.post.create({
      data: {
        userId,
        title: DEFAULT_POST_TITLE,
      },
      select: { id: true },
    });
    return post;
  }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const post = await db.post.findUniqueOrThrow({
        where: { id: input.id },
      });
      if (userId !== post.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this post",
        });
      }
      const updatedPost = await db.post.update({
        where: { id: input.id },
        data: {
          title: input.title,
        },
      });
      return updatedPost;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const post = await db.post.findUniqueOrThrow({
        where: { id: input.id },
      });
      if (userId !== post.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this post",
        });
      }
      await db.post.delete({
        where: { id: input.id },
      });
      return true;
    }),
});
