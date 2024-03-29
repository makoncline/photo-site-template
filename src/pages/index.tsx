import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { MarketingLayout } from "~/layouts/marketing-layout";
import { useSignedInUser } from "~/hooks/useSignedInUser";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { user } = useSignedInUser();
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: Boolean(user) }
  );

  return (
    <>
      <Head>
        <title>Photo App Template</title>
        <meta name="description" content="template for making a photo app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="referrer" content="no-referrer" />
      </Head>
      <MarketingLayout>
        <main className="flex min-h-screen flex-col items-center justify-center">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            {hello.data?.greeting}
            {user && <span>Logged in as {user.email}</span>}
            {secretMessage && <span> {secretMessage}</span>}
          </div>
        </main>
      </MarketingLayout>
    </>
  );
};

export default Home;
