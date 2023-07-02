import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { subscriptionRouter } from "./routers/subscription";
import { userRouter } from "./routers/user";
import { postRouter } from "./routers/post";
import { imageRouter } from "./routers/image";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  subscription: subscriptionRouter,
  user: userRouter,
  post: postRouter,
  image: imageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
