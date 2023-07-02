import { cn } from "~/lib/utils";

type ErrorProps = {
  title: string;
  statusCode: number;
  className?: string;
  children?: React.ReactNode;
};
export const Error = ({
  title,
  statusCode,
  className,
  children,
  ...props
}: ErrorProps) => {
  return (
    <div
      className={cn("flex flex-col items-center justify-center", className)}
      {...props}
    >
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-xl">{statusCode}</p>
      {children}
    </div>
  );
};
