import type { ReactNode } from "react";
import type { Pillar } from "@/lib/content/types";
import { PILLAR_VISUALS, type FieldRegime } from "@/lib/design/pillars";
import { cn } from "@/lib/utils";
import { FieldRegimeSetter } from "./FieldRegimeSetter";

/**
 * ============================================================
 * Pillar scope
 * ============================================================
 * Wraps a page (or a section) in one curriculum pillar's visual identity.
 *
 * Three jobs, in decreasing order of importance:
 *
 * 1. **Retint everything inside.** Setting `data-pillar` re-resolves the
 *    whole `--pillar-*` ramp in globals.css for this subtree: accents,
 *    focus rings, equation-slab edges, prose link color, heading rules. One
 *    attribute, no per-component color plumbing.
 *
 * 2. **Paint the atmosphere.** A fixed, `pointer-events: none` gradient layer
 *    behind everything (`z-index: -20`, below the canvas field). This is
 *    deliberately pure CSS rendered on the *server*: it is the half of the
 *    background that must survive `prefers-reduced-motion`, a data-saver
 *    connection, a JS failure, and the moment before hydration. Apex looks
 *    like Apex in the very first painted frame, not one tick later.
 *
 * 3. **Declare the canvas regime**, via the one-line client component
 *    `FieldRegimeSetter`, so the animated field matches the pillar.
 *
 * This is a Server Component. That matters: `data-pillar` is present in the
 * server-rendered HTML, so there is no flash of default-pillar color on any
 * page, which is exactly why the pillar is *not* set from JavaScript.
 */
export function PillarScope({
  pillar,
  regime,
  className,
  children,
}: {
  /** Omit for pages that belong to no single pillar (glossary, map, learn,
   *  problems catalog, about). */
  pillar?: Pillar;
  /**
   * Defaults to the pillar's own environment, or, for a bare `<PillarScope>`
   * with no `pillar`, the neutral `atlas` regime (see regimes.ts). `journey`
   * (the homepage's curriculum-order crossfade) is never inferred; it means
   * something only for a page whose scroll position tracks a descent through
   * the curriculum, so the one page that wants it (`src/app/page.tsx`)
   * passes `regime="journey"` explicitly rather than relying on a fallback
   * every other bare `<PillarScope>` would silently inherit too.
   */
  regime?: FieldRegime;
  className?: string;
  children: ReactNode;
}) {
  const visual = pillar ? PILLAR_VISUALS[pillar] : undefined;
  const resolvedRegime: FieldRegime = regime ?? visual?.regime ?? "atlas";

  return (
    <div {...(pillar ? { "data-pillar": pillar } : null)} className={cn("relative", className)}>
      <FieldRegimeSetter regime={resolvedRegime} pillar={pillar ?? null} />

      {/* Atmosphere. Two soft pillar-tinted pools plus a vertical density
          ramp, so the page has depth even with every animation disabled.
          `--atmosphere-strength` (globals.css) scales the whole layer per
          theme and pushes it up for Apex. */}
      <div
        aria-hidden="true"
        data-decorative=""
        className="atmosphere"
        style={{
          backgroundImage: [
            "radial-gradient(60rem 40rem at 12% -8%, var(--pillar-glow), transparent 60%)",
            "radial-gradient(48rem 34rem at 92% 6%, var(--pillar-wash), transparent 58%)",
            "linear-gradient(180deg, color-mix(in srgb, var(--depth-1) 55%, transparent), transparent 34%, color-mix(in srgb, var(--depth-0) 70%, transparent))",
          ].join(", "),
        }}
      />

      {children}
    </div>
  );
}
