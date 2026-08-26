import type { ReactNode } from "react";
import type { Pillar } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * Tints one homepage section with a pillar's identity color without
 * declaring a background-field regime.
 *
 * The homepage's canvas field stays in the single `journey` regime for the
 * entire scroll (declared once, by the top-level `<PillarScope>` in
 * `page.tsx`) so the wave -> state -> lattice -> graph -> operator ->
 * frontier crossfade tracks document scroll position smoothly. Nesting a
 * second `<PillarScope pillar="...">` per section would each mount a
 * `FieldRegimeSetter` that overwrites that global regime on mount — since
 * every section mounts together on first paint, the field would just freeze
 * on whichever section happens to mount last, instead of crossfading.
 *
 * So sections get their color identity — `--pillar-accent`, `--pillar-edge`,
 * `border-pillar-edge`, focus rings, etc. — from a bare `data-pillar`
 * attribute (which globals.css's `[data-pillar="..."]` selectors key off
 * directly), and leave the animated field alone.
 */
export function PillarBand({
  pillar,
  className,
  children,
}: {
  pillar: Pillar;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div data-pillar={pillar} className={cn("relative", className)}>
      {children}
    </div>
  );
}
