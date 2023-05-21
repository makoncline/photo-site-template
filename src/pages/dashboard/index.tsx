import { TRPCError } from "@trpc/server";
import { type NextPage } from "next";
import Head from "next/head";
import { DashboardHeader } from "~/components/dashboard-header";
import { DashboardShell } from "~/components/dashboard-shell";
import { EmptyPlaceholder } from "~/components/empty-placeholder";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import type { ButtonProps } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { DashboardLayout } from "~/layouts/dashboard-layout";
import { cn } from "~/lib/utils";
import { withProtectedAuth } from "~/lib/withAuth";
import type { WithAuthProps } from "~/lib/withAuth";
import { api } from "~/utils/api";
import { useRouter } from "next/navigation";
import { PostItem } from "~/components/post-item";

const Dashboard: NextPage<WithAuthProps> = () => {
  const { data: posts } = api.post.readAllPrivate.useQuery();
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
            {posts?.length ? (
              <div className="divide-y divide-border rounded-md border">
                {posts.map((post) => (
                  <PostItem key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon name="post" />
                <EmptyPlaceholder.Title>
                  No posts created
                </EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  You don&apos;t have any posts yet. Start creating content.
                </EmptyPlaceholder.Description>
                <PostCreateButton variant="outline" />
              </EmptyPlaceholder>
            )}
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
  const router = useRouter();
  const mutation = api.post.create.useMutation();
  const handleCreatePost = async () => {
    try {
      const post = await mutation.mutateAsync();
      router.push(`/editor/${post.id}`);
    } catch (error) {
      if (error instanceof TRPCError && error.code === "PRECONDITION_FAILED") {
        return toast({
          title: "Limit of 3 posts reached.",
          description: "Please upgrade to the PRO plan.",
          variant: "destructive",
        });
      }
      return toast({
        title: "Something went wrong.",
        description: "Your post was not created. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <Button
      variant={variant}
      className={cn(className)}
      {...props}
      onClick={handleCreatePost}
    >
      <Icons.add className="mr-2 h-4 w-4" />
      New post
    </Button>
  );
}
