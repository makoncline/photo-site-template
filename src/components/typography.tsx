import * as React from "react";
import { cn } from "~/lib/utils";

export interface TypographyProps extends React.AllHTMLAttributes<HTMLElement> {}

const Typography = {
  h1: React.forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ children, className, ...props }, ref) => (
      <h1
        className={cn(
          "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </h1>
    )
  ),
  h2: React.forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ children, className, ...props }, ref) => (
      <h2
        className={cn(
          "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </h2>
    )
  ),

  h3: React.forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ children, className, ...props }, ref) => (
      <h3
        className={cn(
          "scroll-m-20 text-2xl font-semibold tracking-tight",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </h3>
    )
  ),

  h4: React.forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ children, className, ...props }, ref) => (
      <h4
        className={cn(
          "scroll-m-20 text-xl font-semibold tracking-tight",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </h4>
    )
  ),

  p: React.forwardRef<HTMLParagraphElement, TypographyProps>(
    ({ children, className, ...props }, ref) => (
      <p
        className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    )
  ),

  blockquote: React.forwardRef<HTMLQuoteElement, TypographyProps>(
    ({ children, className, ...props }, ref) => (
      <blockquote
        className={cn("mt-6 border-l-2 pl-6 italic", className)}
        ref={ref}
        {...props}
      >
        {children}
      </blockquote>
    )
  ),

  code: React.forwardRef<HTMLPreElement, TypographyProps>(
    ({ children, className, ...props }, ref) => (
      <code
        className={cn(
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </code>
    )
  ),

  lead: React.forwardRef<HTMLParagraphElement, TypographyProps>(
    ({ children, className, ...props }, ref) => (
      <p
        className={cn("text-xl text-muted-foreground", className)}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    )
  ),

  large: React.forwardRef<HTMLDivElement, TypographyProps>(
    ({ children, className, ...props }, ref) => (
      <div
        className={cn("text-lg font-semibold", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  ),

  small: React.forwardRef<HTMLMapElement, TypographyProps>(
    ({ children, className, ...props }, ref) => (
      <small
        className={cn("text-sm font-medium leading-none", className)}
        ref={ref}
        {...props}
      >
        {children}
      </small>
    )
  ),

  muted: React.forwardRef<HTMLParagraphElement, TypographyProps>(
    ({ children, className, ...props }, ref) => (
      <p
        className={cn("text-sm text-muted-foreground", className)}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    )
  ),
  ul: React.forwardRef<HTMLUListElement, TypographyProps>(
    ({ children, className, ...props }, ref) => (
      <ul
        className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
        ref={ref}
        {...props}
      >
        {children}
      </ul>
    )
  ),
};

Typography.h1.displayName = "Typography.h1";
Typography.h2.displayName = "Typography.h2";
Typography.h3.displayName = "Typography.h3";
Typography.h4.displayName = "Typography.h4";
Typography.p.displayName = "Typography.p";
Typography.blockquote.displayName = "Typography.blockquote";
Typography.code.displayName = "Typography.code";
Typography.lead.displayName = "Typography.lead";
Typography.large.displayName = "Typography.large";
Typography.small.displayName = "Typography.small";
Typography.muted.displayName = "Typography.muted";
Typography.ul.displayName = "Typography.ul";

export default Typography;
