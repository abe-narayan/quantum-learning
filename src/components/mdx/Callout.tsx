import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalloutType = "note" | "warning" | "mistake";

const STYLES: Record<CalloutType, string> = {
  note: "border-brand/30 bg-brand/5",
  warning: "border-warning/30 bg-warning/5",
  mistake: "border-danger/30 bg-danger/5",
};

const LABELS: Record<CalloutType, string> = {
  note: "Note",
  warning: "Careful",
  mistake: "Common mistake",
};

export function Callout({
  type = "note",
  children,
}: {
  type?: CalloutType;
  children: ReactNode;
}) {
  return (
    <div className={cn("not-prose my-6 rounded-xl border p-4 text-sm", STYLES[type])}>
      <p className="font-semibold text-foreground">{LABELS[type]}</p>
      <div className="mt-1 space-y-2 text-muted-foreground">{children}</div>
    </div>
  );
}
