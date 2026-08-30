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
 * `FieldRegimeSetter` that overwrites that global regime on mount, since
 * every section mounts together on first paint, the field would just freeze
 * on whichever section happens to mount last, instead of crossfading.
 *
 * So sections get their color identity (`--pillar-accent`, `--pillar-edge`,
 * `border-pillar-edge`, focus rings, and the rest) from a bare `data-pillar`
 * attribute, which globals.css's `[data-pillar="..."]` selectors key off
 * directly, and leave the animated field alone.
 *
 * What they do give the field is a *position*. Each band also stamps
 * `data-journey-stop`, and `QuantumField` collects those, measures where they
 * sit in the document, and scores the crossfade against them instead of
 * against the raw fraction of the page scrolled (see `measureStops` there).
 * The two are only the same thing when the six track sections are evenly
 * spaced through the document, which they are not: the page opens with three
 * sections belonging to no track and carries a detour between two of them, so
 * the unanchored version was drawing lattice while the reader was still in
 * wave mechanics. One attribute per band, no JavaScript, and every other route
 * on the site declares no stops and keeps the old behavior exactly.
 *
 * A band therefore means one thing, and the field can rely on it: this is one
 * track's section, on the homepage, in curriculum order.
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
    <div data-pillar={pillar} data-journey-stop={pillar} className={cn("relative", className)}>
      {children}
    </div>
  );
}
