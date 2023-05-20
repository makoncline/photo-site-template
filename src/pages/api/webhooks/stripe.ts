import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";

import { env } from "~/env.mjs";
import { getErrorMessage } from "~/lib/utils";
import { db } from "~/server/db";
import { stripe } from "~/server/stripe/client";

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const rawBody = (await buffer(req)) as unknown as string;
  const signature = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log("error", error);
    res.status(400).send(`Webhook Error: ${getErrorMessage(error)}`);
    return;
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Update the user stripe into in our database.
    // Since this is the initial subscription, we need to update
    // the subscription id and customer id.
    await db.user.update({
      where: {
        id: session?.metadata?.userId,
      },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Update the price id and set the new period end.
    await db.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return res.status(200).json({ received: true });
}
