import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { Logo } from "./logo";
import { HamburgerIcon } from "./hamburgerIcon";
import { SignIn } from "./signIn";
import { Separator } from "./separator";

export const Navigation = ({
  links,
}: {
  links: { href: string; label: string }[];
}) => {
  const NavLinks = () => (
    <>
      {links.map((link, i) => (
        <NavigationMenuPrimitive.Item key={i}>
          <Link
            className="inline-block rounded-lg py-1 px-2 text-sm  hover:bg-glint/10"
            href={link.href}
          >
            {link.label}
          </Link>
        </NavigationMenuPrimitive.Item>
      ))}
    </>
  );
  return (
    <header className="py-10">
      <NavigationMenuPrimitive.Root className="relative flex w-full justify-center">
        <NavigationMenuPrimitive.List className="flex w-screen items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <NavigationMenuPrimitive.Item>
              <Link aria-label="Home" href="/">
                <Logo />
              </Link>
            </NavigationMenuPrimitive.Item>
            <div className="hidden md:flex md:gap-x-6">
              <NavLinks />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NavigationMenuPrimitive.Item className="hidden md:block">
              <SignIn />
            </NavigationMenuPrimitive.Item>
            <NavigationMenuPrimitive.Item className="md:hidden">
              <NavigationMenuPrimitive.Trigger asChild>
                <button
                  className="flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
                  aria-label="Toggle Navigation"
                  type="button"
                  aria-expanded="false"
                >
                  <HamburgerIcon />
                </button>
              </NavigationMenuPrimitive.Trigger>
              <NavigationMenuPrimitive.Content className="absolute left-0 top-full flex w-screen justify-end">
                <div className="m-3 w-3/4 max-w-xs rounded bg-surface-2 p-4 shadow-sm">
                  <ul className=" flex w-full list-none flex-col gap-1">
                    {links.length ? (
                      <>
                        <NavLinks />
                        <Separator />
                      </>
                    ) : null}
                    <SignIn />
                  </ul>
                </div>
              </NavigationMenuPrimitive.Content>
            </NavigationMenuPrimitive.Item>
          </div>
          <NavigationMenuPrimitive.Indicator />
        </NavigationMenuPrimitive.List>
      </NavigationMenuPrimitive.Root>
    </header>
  );
};
