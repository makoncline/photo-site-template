import type { User } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import type { ComponentType } from "react";
import { Icons } from "~/components/icons";

export type WithAuthProps = { user: User };

export function withProtectedAuth<T extends Record<string, unknown>>(
  Component: ComponentType<T>
) {
  const AuthenticatedComponent = (props: T & WithAuthProps) => {
    const { status, data: session } = useSession();
    if (status === "unauthenticated") {
      return signIn();
    }
    if (status !== "authenticated")
      return (
        <div className="flex h-full w-full items-center justify-center p-10">
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        </div>
      );
    return <Component {...props} user={session.user} />;
  };

  return AuthenticatedComponent;
}
