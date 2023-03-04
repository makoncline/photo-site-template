import { useSession, signOut, signIn } from "next-auth/react";
import { Avatar } from "./Avatar";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

export const SignIn: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {sessionData?.user.name ? (
        <HoverCardPrimitive.Root>
          <HoverCardPrimitive.Trigger asChild>
            <button onClick={() => void signOut()}>
              <Avatar
                imageUrl={sessionData.user.image}
                name={sessionData.user.name}
              />
            </button>
          </HoverCardPrimitive.Trigger>
          <HoverCardPrimitive.Portal>
            <HoverCardPrimitive.Content className="rounded-md bg-white p-4 shadow-md">
              <HoverCardPrimitive.Arrow className="fill-white" />
              <div className="flex flex-col items-start gap-1 ">
                <p>{sessionData.user.name}</p>
                <p>{sessionData.user.email}</p>
                <button
                  className="inline-block self-end rounded-lg py-1 px-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  onClick={() => void signOut()}
                >
                  Sign out
                </button>
              </div>
            </HoverCardPrimitive.Content>
          </HoverCardPrimitive.Portal>
        </HoverCardPrimitive.Root>
      ) : (
        <button
          className="inline-block rounded-lg py-1 px-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          onClick={
            sessionData ? () => void signOut() : () => void signIn("google")
          }
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      )}
    </div>
  );
};
