import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children: ReactNode;
}) {
  // `...rest` passes through native div attributes — LessonLayout stamps
  // `data-difficulty` on its container so globals.css can shift density.
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...rest}>
      {children}
    </div>
  );
}
