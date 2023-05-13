import { type NextPage } from "next";
import Head from "next/head";
import { DashboardHeader } from "~/components/dashboard-header";
import { DashboardShell } from "~/components/dashboard-shell";
import { EmptyPlaceholder } from "~/components/empty-placeholder";
import { Icon } from "~/components/icon";
import { buttonVariants } from "~/components/ui/button";
import type { ButtonProps } from "~/components/ui/button";
import { DashboardLayout } from "~/layouts/dashboard-layout";
import { cn } from "~/lib/utils";
import { withProtectedAuth } from "~/lib/withAuth";
import type { WithAuthProps } from "~/lib/withAuth";

const Dashboard: NextPage<WithAuthProps> = () => {
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
          <DashboardHeader heading="Posts" text="Create and manage posts.">
            <PostCreateButton />
          </DashboardHeader>
          <div>
            <EmptyPlaceholder>
              <EmptyPlaceholder.Icon name="post" />
              <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
              <EmptyPlaceholder.Description>
                You don&apos;t have any posts yet. Start creating content.
              </EmptyPlaceholder.Description>
              <PostCreateButton variant="outline" />
            </EmptyPlaceholder>
          </div>
        </DashboardShell>
      </DashboardLayout>
    </>
  );
};

export default withProtectedAuth(Dashboard);

type PostCreateButtonProps = ButtonProps;

export function PostCreateButton({
  className,
  variant,
  ...props
}: PostCreateButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({ variant: variant ?? "default" }),
        className
      )}
      {...props}
    >
      <Icon.add className="mr-2 h-4 w-4" />
      New post
    </button>
  );
}
