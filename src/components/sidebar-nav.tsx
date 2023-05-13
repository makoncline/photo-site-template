import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/utils";
import { Icon } from "~/components/icon";
import type { SidebarNavItem } from "~/types";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface SidebarNavProps {
  items: SidebarNavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  const Nav = () => (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const NavItemIcon = Icon[item.icon || "arrowRight"];
        return (
          item.href && (
            <Link key={index} href={item.disabled ? "/" : item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <NavItemIcon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="hidden flex-col md:flex">
        <Nav />
      </aside>
      <aside className="flex-col md:hidden">
        <Sheet>
          <SheetTrigger>
            <Icon.sidebarOpen className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent position="left">
            <Nav />
          </SheetContent>
        </Sheet>
      </aside>
    </>
  );
}
