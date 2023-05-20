import { userSettingsFormSchema } from "~/components/user-settings-form";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const userRouter = createTRPCRouter({
  updateSettings: protectedProcedure
    .input(userSettingsFormSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
        },
      });
      return user;
    }),
});
