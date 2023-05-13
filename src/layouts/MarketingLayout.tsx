import Link from "next/link";

import { marketingConfig } from "~/config/marketing";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import { MainNav } from "~/components/main-nav";
import { ModeToggle } from "~/components/mode-toggle";
import { useSession } from "next-auth/react";
import { UserAccountNav } from "~/components/user-account-nav";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  const { data: sessionData } = useSession();
  const user = sessionData?.user;
  const isUserLoggedIn = user !== undefined;
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={marketingConfig.mainNav} />
          <div className="flex gap-6">
            <ModeToggle />
            <nav>
              {isUserLoggedIn ? (
                <UserAccountNav user={user} />
              ) : (
                <Link
                  href="/auth/sign-in"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "px-4"
                  )}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
