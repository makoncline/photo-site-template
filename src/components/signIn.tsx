import { useSession, signOut, signIn } from "next-auth/react";
import { Avatar } from "./avatar";

export const SignIn: React.FC = () => {
  const { data: sessionData } = useSession();
  const { image, name } = sessionData?.user || {};
  const initial = name?.substring(0, 1).toUpperCase();

  return (
    <div className="flex w-full items-center justify-start gap-4">
      <Avatar imageUrl={image} fallback={initial} />
      <button
        className="inline-block rounded-lg py-1 px-2 text-sm hover:bg-glint/10"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
