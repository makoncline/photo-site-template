import { z } from "zod";
import { validationSchema } from "~/pages/kitchen-sink/form";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

const items = [
  {
    id: "1",
    title: "Hello tRPC",
    text: "Hello world",
  },
];

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  list: publicProcedure.query(() => {
    return items;
  }),

  add: publicProcedure.input(validationSchema).mutation(({ input }) => {
    const id = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .slice(0, 6);
    const item = {
      id,
      ...input,
    };
    items.push(item);
    return item;
  }),
});
