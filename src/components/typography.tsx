import React from "react";

import { cn } from "@/lib/utils.ts";

type CommonProps = {
  className?: string;
  children?: React.ReactNode;
};

type H1Props = CommonProps;
type H2Props = CommonProps;

export const H1 = ({ children, className, ...props }: H1Props) => (
  <h1
    className={cn(
      "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      className,
    )}
    {...props}
  >
    {children}
  </h1>
);

export const H2 = ({ children, className, ...props }: H2Props) => (
  <h1
    className={cn(
      "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
      className,
    )}
    {...props}
  >
    {children}
  </h1>
);
