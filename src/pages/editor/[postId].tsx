import type { NextPage } from "next";
import Head from "next/head";
import { DashboardHeader } from "~/components/dashboard-header";
import { DashboardShell } from "~/components/dashboard-shell";
import { DashboardLayout } from "~/layouts/dashboard-layout";
import { withProtectedAuth } from "~/lib/withAuth";
import type { WithAuthProps } from "~/lib/withAuth";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { notFound } from "next/navigation";
import { CardSkeleton } from "~/components/card-skeleton";
import { EditPostForm } from "~/components/edit-post-form";

const EditPost: NextPage<WithAuthProps> = () => {
  const router = useRouter();
  const postId = router.query.postId as string;
  const { data: post, isError } = api.post.readPrivate.useQuery({ id: postId });
  if (isError) {
    notFound();
  }
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
            heading="Edit Post"
            text="Make changes to your post here. Click save when you're done."
          />
          <div className="grid gap-10">
            {post ? <EditPostForm post={post} /> : <CardSkeleton />}
          </div>
        </DashboardShell>
      </DashboardLayout>
    </>
  );
};

export default withProtectedAuth(EditPost);
