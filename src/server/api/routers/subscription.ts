import { TRPCError } from "@trpc/server";
import { proPlan } from "~/config/subscriptions";
import { absoluteUrl } from "~/lib/utils";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { stripe } from "~/server/stripe/client";
import { getUserSubscriptionPlan } from "~/server/stripe/getSubscriptionPlan";

export const subscriptionRouter = createTRPCRouter({
  getUserSubscriptionPlan: protectedProcedure.query(async ({ ctx }) => {
    return getUserSubscriptionPlan(ctx.session.user.id);
  }),
  getStripeSession: protectedProcedure.query(async ({ ctx }) => {
    const billingUrl = absoluteUrl("/dashboard/billing");
    const subscriptionPlan = await getUserSubscriptionPlan(ctx.session.user.id);

    // The user is on the pro plan.
    // Create a portal session to manage subscription.
    if (subscriptionPlan.isPro && subscriptionPlan.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: billingUrl,
      });
      return { url: stripeSession.url };
    }

    // The user is on the free plan.
    // Create a checkout session to upgrade.
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: ctx.session.user.email || "",
      line_items: [
        {
          price: proPlan.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: ctx.session.user.id,
      },
    });
    if (!stripeSession.url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Stripe session URL is missing",
      });
    }
    return { url: stripeSession.url };
  }),
});
