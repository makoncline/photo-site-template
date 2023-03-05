import { signIn, useSession } from "next-auth/react";
import { Spinner } from "~/components/spinner";
import type { ComponentType } from "react";

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
          <Spinner />
        </div>
      );
    return <Component {...props} />;
  };

  return AuthenticatedComponent;
}

export default withProtectedAuth;
