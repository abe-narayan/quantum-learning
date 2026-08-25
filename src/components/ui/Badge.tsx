import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "brand" | "accent" | "neutral" | "warning" | "danger";

const TONE_CLASSES: Record<BadgeTone, string> = {
  brand: "bg-brand/10 text-brand",
  accent: "bg-accent/10 text-accent",
  neutral: "bg-surface-muted text-muted-foreground",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONE_CLASSES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
