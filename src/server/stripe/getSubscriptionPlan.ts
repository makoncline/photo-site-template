import { z } from "zod";
import { proPlan, freePlan } from "~/config/subscriptions";

import { db } from "~/server/db";
import { stripe } from "~/server/stripe/client";

export const getUserSubscriptionPlan = async (userId: string) => {
  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPro = z
    .boolean()
    .parse(
      (user.stripePriceId || false) &&
        (user.stripeCurrentPeriodEnd?.getTime() || 0) + 86_400_000 > Date.now()
    );

  const plan = isPro ? proPlan : freePlan;

  let isCanceled = false;
  const stripeSubscriptionId = user.stripeSubscriptionId;
  if (stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      stripeSubscriptionId
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }
  return {
    ...user,
    ...plan,
    stripeCurrentPeriodEnd: z
      .number()
      .parse(user.stripeCurrentPeriodEnd?.getTime() || 0),
    isPro,
    isCanceled,
  };
};
