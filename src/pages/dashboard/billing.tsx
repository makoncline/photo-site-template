import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { BillingForm } from "~/components/billing-form";
import { DashboardHeader } from "~/components/dashboard-header";
import { Icons } from "~/components/icons";
import { DashboardShell } from "~/components/dashboard-shell";
import type { NextPage } from "next";
import { withProtectedAuth } from "~/lib/withAuth";
import type { WithAuthProps } from "~/lib/withAuth";
import { api } from "~/utils/api";
import { CardSkeleton } from "~/components/card-skeleton";
import Head from "next/head";
import { DashboardLayout } from "~/layouts/dashboard-layout";

const metadata = {
  title: "Billing",
  description: "Manage billing and your subscription plan.",
};

const BillingPage: NextPage<WithAuthProps> = () => {
  const { data: subscriptionPlan, isError } =
    api.subscription.getUserSubscriptionPlan.useQuery();

  const Fallback = isError ? BillingError : BillingLoading;

  return (
    <>
      <Head>
        <title>Photo App Template</title>
        <meta name="description" content="template for making a photo app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="referrer" content="no-referrer" />
      </Head>
      <DashboardLayout>
        <DashboardShell>
          <DashboardHeader
            heading={metadata.title}
            text={metadata.description}
          />
          <div className="grid gap-8">
            <Alert className="!pl-14">
              <Icons.warning />
              <AlertTitle>This is a demo app.</AlertTitle>
              <AlertDescription>
                This app is a demo app using a Stripe test environment. You can
                find a list of test card numbers on the{" "}
                <a
                  href="https://stripe.com/docs/testing#cards"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-8"
                >
                  Stripe docs
                </a>
                .
              </AlertDescription>
            </Alert>
            {subscriptionPlan ? (
              <BillingForm subscriptionPlan={subscriptionPlan} />
            ) : (
              <Fallback />
            )}
          </div>
        </DashboardShell>
      </DashboardLayout>
    </>
  );
};

export default withProtectedAuth(BillingPage);

function BillingLoading() {
  return (
    <div className="grid gap-10">
      <CardSkeleton />
    </div>
  );
}

function BillingError() {
  return (
    <div className="grid gap-10">
      <Alert className="!pl-14">
        <Icons.warning />
        <AlertTitle>Something went wrong.</AlertTitle>
        <AlertDescription>
          We were unable to load your subscription plan. Please try again later.
        </AlertDescription>
      </Alert>
    </div>
  );
}
