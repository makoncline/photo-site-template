import React from "react";

export const useStatus = () => {
  const [status, setStatus] = React.useState<"idle" | "loading" | "error">(
    "idle"
  );
  const isIdle = status === "idle";
  const isLoading = status === "loading";
  const isError = status === "error";
  return { status, setStatus, isIdle, isLoading, isError };
};
