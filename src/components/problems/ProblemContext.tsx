"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { useCompletedLessonSlugs } from "@/lib/content/progress";
import { DIFFICULTY_LABEL } from "@/lib/content/types";
import { PROBLEM_TO_DIFFICULTY } from "@/lib/problems/types";
import type { ProblemDifficulty, ProblemType } from "@/lib/problems/types";
import { TYPE_LABEL } from "./problemDisplay";

/**
 * ============================================================
 * The metadata that used to sit on top of the problem
 * ============================================================
 * Measured in headless Chrome at 375x812, a problem page opened with 420px of
 * chrome above its own problem statement: a two-row breadcrumb, a
 * difficulty/type/time badge strip, and the "Before you start · 0 / 1
 * complete" prerequisite readout. The statement itself began at y=557 of an
 * 812px screen, so roughly a fifth of the first screen carried the one thing
 * the page exists for, and the answer field was off it entirely.
 *
 * None of that metadata is junk. The prerequisite readout in particular
 * answers "can I attempt this yet?", which a reader arriving from the catalog,
 * from search or from a shared link genuinely cannot answer any other way. But
 * *useful* and *first* are different claims, and everything here was making
 * the second one.
 *
 * So this component makes exactly one line of it, and puts the rest one press
 * away. The summary is the metadata — difficulty, answer type, minutes, and
 * how many prerequisites this reader still has open — not a "More info"
 * label, so a reader who never opens it has still read the facts. The panel
 * below it is where the detail lives: the four-rung difficulty ladder with
 * what the rung means, and the full `PrerequisiteReadout` with its per-lesson
 * done/not-done chips and its distance line.
 *
 * A native `<details>`, like `LessonMetaStrip` and `LessonObjectives`: real
 * keyboard operation, real find-in-page, and it works before hydration.
 *
 * ============================================================
 * Why this is a client component, and what stays on the server
 * ============================================================
 * Only the summary's prerequisite phrase needs the reader. Progress lives in
 * `localStorage`, so the server and the first client render both see an empty
 * set, and a returning reader must not watch "1 prerequisite still open" get
 * corrected to "complete" a frame later. `hydrated` splits the phrase the
 * same way `PrerequisiteReadout` splits its distance line: before hydration it
 * says only what the graph says, which is true for everyone; after, it says
 * what is true for this reader.
 *
 * Everything expensive stays server-rendered and arrives as `children` —
 * `ProblemLayout` resolves the prerequisite lessons and the upstream chain
 * from the curriculum registry and passes the finished `PrerequisiteReadout`
 * down. The only cross-boundary import here is `lib/content/progress`, which
 * docs/DESIGN_SYSTEM.md §10 names explicitly as allowed (client-side storage,
 * not a content registry), plus two label maps that carry no data. That is the
 * same shape `PrerequisiteReadout` itself already has, and
 * `clientBoundary.test.ts` walks it.
 */

/** Stable no-op subscription: the snapshot pair is the whole point. */
function subscribeToNothing() {
  return () => {};
}

/**
 * The prerequisite half of the summary line, in the two voices.
 *
 * Exported and pure so every state a reader can be in is testable without a
 * DOM or a storage mock — the same reason `upstreamDistance` is exported from
 * `PrerequisiteReadout`.
 */
export function prerequisitePhrase({
  total,
  done,
  hydrated,
}: {
  total: number;
  done: number;
  hydrated: boolean;
}): string | null {
  if (total === 0) return null;
  const noun = total === 1 ? "prerequisite" : "prerequisites";
  // Pre-hydration: a fact about the problem, true for every reader.
  if (!hydrated) return `${total} ${noun}`;
  if (done >= total) return total === 1 ? "Prerequisite complete" : "Prerequisites complete";
  const open = total - done;
  return `${open} ${open === 1 ? "prerequisite" : "prerequisites"} not yet complete`;
}

export function ProblemContext({
  id,
  difficulty,
  problemType,
  estimatedMinutes,
  prerequisiteSlugs,
  children,
}: {
  /** In-page id, so the "What this builds on" route out of a wrong answer can
   *  land here. See the effect below for why a bare fragment is not enough. */
  id: string;
  difficulty: ProblemDifficulty;
  problemType: ProblemType;
  estimatedMinutes: number;
  /** Slugs of the lessons this problem declares as prerequisites. Only the
   *  count and this reader's completion of them is read here; the links and
   *  the per-lesson state are `children`'s job. */
  prerequisiteSlugs: readonly string[];
  /** Server-rendered detail: the difficulty ladder and the full
   *  `PrerequisiteReadout`. */
  children: ReactNode;
}) {
  const completedSlugs = useCompletedLessonSlugs();
  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );

  const done = prerequisiteSlugs.filter((slug) => completedSlugs.has(slug)).length;
  const phrase = prerequisitePhrase({ total: prerequisiteSlugs.length, done, hydrated });
  const outstanding = hydrated && prerequisiteSlugs.length > 0 && done < prerequisiteSlugs.length;

  // A fragment link whose target sits inside a *closed* `<details>` is only
  // guaranteed to reveal it on browsers that implement the auto-expand
  // behaviour, and "the reader who just got the answer wrong pressed 'What
  // this builds on' and nothing appeared" is a bad way to find out which
  // browser they are on. Eight lines of JavaScript makes it certain
  // everywhere, and the panel still opens by click and by keyboard with the
  // script never running at all.
  const detailsRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const openIfTargeted = () => {
      if (window.location.hash !== `#${id}`) return;
      const node = detailsRef.current;
      if (!node) return;
      node.open = true;
      // The summary, not the panel: it is natively focusable, it is what the
      // reader now needs to be able to close again, and it puts the caret at
      // the top of what they asked to see.
      node.querySelector("summary")?.focus();
    };
    openIfTargeted();
    window.addEventListener("hashchange", openIfTargeted);
    return () => window.removeEventListener("hashchange", openIfTargeted);
  }, [id]);

  return (
    <details ref={detailsRef} id={id} className="group mt-5 scroll-mt-24">
      <summary
        className={
          "flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 " +
          "rounded-(--radius-tight) border border-border bg-surface-muted/40 px-4 py-2 " +
          "transition-colors duration-(--dur-fast) hover:bg-surface-muted " +
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2 " +
          "[&::-webkit-details-marker]:hidden"
        }
      >
        {/* The visible text is the metadata itself, so a reader who never
            opens the panel has still read it. This prefix is what tells a
            screen-reader user what pressing it would reveal, which the
            metadata alone does not say. */}
        <span className="sr-only">About this problem: </span>
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 tech-label">
          <span className="text-foreground">{DIFFICULTY_LABEL[PROBLEM_TO_DIFFICULTY[difficulty]]}</span>
          <Dot />
          <span>{TYPE_LABEL[problemType]}</span>
          <Dot />
          <span>
            <span className="tech-value text-foreground">{estimatedMinutes}</span> min
          </span>
          {phrase ? (
            <>
              <Dot />
              {/* Colour is the secondary channel here, never the only one: the
                  phrase says "not yet complete" in words. */}
              <span className={outstanding ? "text-pillar-text" : undefined}>{phrase}</span>
            </>
          ) : null}
        </span>
        <svg
          aria-hidden="true"
          data-decorative=""
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          className="h-4 w-4 shrink-0 text-pillar-text transition-transform group-open:rotate-180"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 7.5 5 5 5-5" />
        </svg>
      </summary>

      <div className="mt-3 rounded-panel border border-border bg-surface-muted/40 px-4 py-4">{children}</div>
    </details>
  );
}

function Dot() {
  return (
    <span aria-hidden="true" data-decorative="" className="text-subtle-foreground">
      ·
    </span>
  );
}
