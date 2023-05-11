import Link from "next/link";

import { marketingConfig } from "~/config/marketing";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import { MainNav } from "~/components/main-nav";
import { ModeToggle } from "~/components/mode-toggle";
import { signOut } from "next-auth/react";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={marketingConfig.mainNav} />
          <div className="flex gap-6">
            <ModeToggle />
            <nav>
              <Link
                href="/auth/sign-in"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "px-4"
                )}
              >
                Login
              </Link>
              <button onClick={() => signOut()}>sign out</button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
