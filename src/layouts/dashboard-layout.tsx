import { redirect, usePathname } from "next/navigation";

import { dashboardConfig } from "~/config/dashboard";
import { MainNav } from "~/components/main-nav";
import { SidebarNav } from "~/components/sidebar-nav";
import { UserAccountNav } from "~/components/user-account-nav";
import { ModeToggle } from "~/components/mode-toggle";
import { useSignedInUser } from "~/hooks/useSignedInUser";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useSignedInUser();
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav} />
          <div className="flex gap-6">
            <ModeToggle />
            <UserAccountNav user={user} />
          </div>
        </div>
      </header>
      <div className="grid flex-1 grid-cols-[auto_1fr]">
        <div className="border-r px-4 pt-6">
          <SidebarNav items={dashboardConfig.sidebarNav} />
        </div>
        <main className="container flex w-full flex-1 flex-col overflow-hidden pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
