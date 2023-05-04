import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { Navigation } from "~/components/navigation";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { data: sessionData } = useSession();
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const links = [
    { href: "/#", label: "One" },
    { href: "/#", label: "Two" },
    { href: "/#", label: "Three" },
  ];

  return (
    <>
      <Head>
        <title>Photo App Template</title>
        <meta name="description" content="template for making a photo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation links={links} />
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {hello.data?.greeting}
          {sessionData && <span>Logged in as {sessionData.user?.email}</span>}
          {secretMessage && <span> {secretMessage}</span>}
        </div>
      </main>
    </>
  );
};

export default Home;
