import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "brand" | "accent" | "neutral" | "warning" | "danger" | "success";

// Hairline-bordered, mono, uppercase, tracked — the same voice as
// `.tech-label` in globals.css — so a badge reads as an instrument readout
// chip ("ADVANCED", "12 MIN", "SOLVED") rather than a soft color-wash pill.
const TONE_CLASSES: Record<BadgeTone, string> = {
  brand: "border-brand/30 bg-brand/10 text-brand",
  accent: "border-accent/30 bg-accent/10 text-accent",
  neutral: "border-border bg-surface-muted text-muted-foreground",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
  success: "border-success/30 bg-success/10 text-success",
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
        "inline-flex items-center gap-1 rounded-[var(--radius-tight)] border px-2 py-0.5 font-tech text-[0.6875rem] font-medium uppercase tracking-[0.08em]",
        TONE_CLASSES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
