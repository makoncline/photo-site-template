import { useSession } from "next-auth/react";

export const useSignedInUser = () => {
  const { data, status } = useSession();
  return {
    user: data?.user,
    isLoading: status === "loading",
    status,
  };
};
