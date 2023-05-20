import { type NextPage } from "next";
import Head from "next/head";
import { DashboardHeader } from "~/components/dashboard-header";
import { DashboardShell } from "~/components/dashboard-shell";
import { DashboardLayout } from "~/layouts/dashboard-layout";
import { UserSettingsForm } from "~/components/user-settings-form";
import { withProtectedAuth } from "~/lib/withAuth";
import type { WithAuthProps } from "~/lib/withAuth";

const Settings: NextPage<WithAuthProps> = ({ user }) => {
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
            heading="Settings"
            text="Manage account and website settings."
          />
          <div className="grid gap-10">
            <UserSettingsForm user={{ name: user.name || null }} />
          </div>
        </DashboardShell>
      </DashboardLayout>
    </>
  );
};

export default withProtectedAuth(Settings);
