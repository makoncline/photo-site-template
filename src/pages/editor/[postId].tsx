import type { NextPage } from "next";
import Head from "next/head";
import { DashboardHeader } from "~/components/dashboard-header";
import { DashboardShell } from "~/components/dashboard-shell";
import { DashboardLayout } from "~/layouts/dashboard-layout";
import { withProtectedAuth } from "~/lib/withAuth";
import type { WithAuthProps } from "~/lib/withAuth";
import { type RouterResults, api } from "~/utils/api";
import { useRouter } from "next/router";
import { CardSkeleton } from "~/components/card-skeleton";
import { EditPostForm } from "~/components/edit-post-form";
import { Error } from "~/components/error";

type RenderComponentProps = {
  postQuery: RouterResults<"post", "readPrivate">;
};
const RenderComponent = ({ postQuery }: RenderComponentProps) => {
  if (postQuery.error) {
    return (
      <Error
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  } else if (postQuery.status !== "success") {
    return <CardSkeleton />;
  } else {
    return <EditPostForm post={postQuery.data} />;
  }
};

const EditPost: NextPage<WithAuthProps> = () => {
  const router = useRouter();
  const postId = router.query.postId as string;
  const postQuery = api.post.readPrivate.useQuery(
    { id: postId },
    { enabled: Boolean(postId) }
  );
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
          <DashboardHeader heading="Edit Post" text="" />
          <RenderComponent postQuery={postQuery} />
        </DashboardShell>
      </DashboardLayout>
    </>
  );
};

export default withProtectedAuth(EditPost);
