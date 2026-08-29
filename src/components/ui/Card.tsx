import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The quiet box: a plain, unadorned container on the same token ladder as
 * everything else (`--surface`, `--border`, `--radius-panel`) but with none
 * of `Panel`/`Instrument`'s (`src/components/ui/Panel.tsx`) machined-face
 * highlight, corner ticks or pillar tinting. Reach for `Card` for a simple
 * grouping box; reach for `Panel`/`Instrument` for anything that should read
 * as equipment — and if a whole page is built only from `Card`s, that's the
 * "another grid of cards" the design system asks you not to ship (see
 * docs/DESIGN_SYSTEM.md §4-5).
 */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-panel border border-border bg-surface p-6 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
