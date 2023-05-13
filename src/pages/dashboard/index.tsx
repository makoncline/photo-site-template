import { type NextPage } from "next";
import Head from "next/head";
import DashboardLayout from "~/layouts/DashboardLayout";

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Photo App Template</title>
        <meta name="description" content="template for making a photo app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="referrer" content="no-referrer" />
      </Head>
      <DashboardLayout>
        <main className="flex min-h-screen flex-col items-center justify-center">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            dis da dash
          </div>
        </main>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
