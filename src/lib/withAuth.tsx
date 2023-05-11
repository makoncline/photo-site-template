import { signIn, useSession } from "next-auth/react";
import type { ComponentType } from "react";
import { Icon } from "~/components/icon";

export function withProtectedAuth<T extends Record<string, unknown>>(
  Component: ComponentType<T>
) {
  const AuthenticatedComponent = (props: T) => {
    const { status } = useSession();
    if (status === "unauthenticated") {
      void signIn("google");
    }
    if (status !== "authenticated")
      // maybe show a prompt to sign in instead of just redirecting
      return (
        <div className="flex h-full w-full items-center justify-center p-10">
          <Icon.spinner className="mr-2 h-4 w-4 animate-spin" />
        </div>
      );
    return <Component {...props} />;
  };

  return AuthenticatedComponent;
}

export default withProtectedAuth;
