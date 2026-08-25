import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalloutType = "note" | "warning" | "mistake";

// Weight escalates with severity: `note` is the lowest-weight type (a
// left-border-only accent, no full border) so it doesn't compete visually
// with `warning`/`mistake`, which get a full border that gets heavier still
// for `mistake` — the type students most need to notice while scanning.
const STYLES: Record<CalloutType, string> = {
  note: "border-l-4 border-brand bg-brand/5",
  warning: "border-2 border-warning/40 bg-warning/5",
  mistake: "border-2 border-danger/50 bg-danger/5",
};

const LABELS: Record<CalloutType, string> = {
  note: "Note",
  warning: "Careful",
  mistake: "Common mistake",
};

// Label color picks up the tone instead of always reading as plain
// foreground text — otherwise "Common mistake" and "Note" render visually
// identical apart from a faint background tint.
const LABEL_STYLES: Record<CalloutType, string> = {
  note: "text-brand",
  warning: "text-warning",
  mistake: "text-danger",
};

export function Callout({
  type = "note",
  children,
}: {
  type?: CalloutType;
  children: ReactNode;
}) {
  return (
    <div className={cn("not-prose my-6 rounded-xl p-4 text-sm", STYLES[type])}>
      <p className={cn("font-semibold", LABEL_STYLES[type])}>{LABELS[type]}</p>
      <div className="mt-1 space-y-2 text-muted-foreground">{children}</div>
    </div>
  );
}
