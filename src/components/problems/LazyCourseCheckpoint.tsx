"use client";

import { lazy, Suspense } from "react";
import type { Problem } from "@/lib/problems/types";
import { Instrument } from "@/components/ui/Panel";
import { useDeferredMount } from "@/components/motion/useDeferredMount";

/**
 * Sized stand-in for the closed checkpoint: same `Instrument` shell and
 * header label, one row-height block per problem (the real list renders
 * min-h-11 rows), so the swap to the loaded component doesn't shift the
 * page. Decorative pulse only — the accessible loading state is the
 * sr-only text, mirroring `SimulatorSkeleton`'s convention.
 */
function CheckpointSkeleton({ problemCount }: { problemCount: number }) {
  return (
    <Instrument
      className="not-prose mt-8"
      label="Checkpoint: test yourself before moving on"
      // The loaded header carries an "X of N solved" pill beside the label,
      // and `Instrument`'s header row is `flex-wrap`: at a phone width the
      // label and that pill sit on two lines, so a skeleton with no readout
      // at all was one line shorter and the swap moved the whole lesson
      // under it. A blank pill of the same size holds the row open. Never
      // the real text — it would be a count nobody has counted yet — and
      // `aria-hidden`, because the accessible loading state is the sr-only
      // line below, exactly as for the body blocks.
      readout={
        <span
          aria-hidden="true"
          className="block h-5 w-24 rounded-full bg-surface-muted motion-safe:animate-pulse"
        />
      }
      as="div"
    >
      <div role="status">
        <span className="sr-only">Loading checkpoint…</span>
        <div aria-hidden="true">
          <div className="h-4 w-full max-w-md rounded bg-surface-muted motion-safe:animate-pulse" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: problemCount }, (_, index) => (
              <div
                key={index}
                className="h-11 rounded-(--radius-tight) border border-border bg-surface motion-safe:animate-pulse"
                style={{ animationDelay: `${index * 120}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </Instrument>
  );
}

// React.lazy rather than next/dynamic: `dynamic()`'s `loading` component
// receives no props, so it could only guess at the row count (it hardcoded
// 5, which visibly jumped for courses with fewer checkpoint problems while
// the chunk fetched). A `Suspense` fallback CAN read this component's props,
// so the skeleton stays correctly sized through both waiting phases
// (pre-`ready` and chunk-in-flight) — pixel-identical, no shift. The
// `ready` gate below keeps this out of server rendering entirely (`ready`
// is always false on the server), which preserves the old `ssr: false`
// behavior without next/dynamic.
const CourseCheckpoint = lazy(() =>
  import("./CourseCheckpoint").then((mod) => ({ default: mod.CourseCheckpoint }))
);

type LazyCourseCheckpointProps = {
  courseTitle: string;
  problems: Problem[];
};

/**
 * Thin client-side lazy boundary for `CourseCheckpoint`, following the
 * `LazyCHSHBellTestExplorer` pattern: the lazy `import()` must live inside a
 * `"use client"` module for the split to actually happen (dynamic import of
 * a Client Component from a Server Component does not code-split), plus
 * `useDeferredMount` to keep the chunk off the critical path. To be precise
 * about what that gate does: it mounts on WHICHEVER comes first of
 * near-viewport, first interaction, or the idle-callback timeout (~1.2s
 * after paint) — so the chunk usually loads shortly after paint regardless
 * of scroll position; the win is that it never competes with first paint
 * and hydration, not that it waits for the user to scroll to it.
 *
 * This exists for every *other* lesson page as much as for the one that
 * renders it: `LessonLayout` statically imported `CourseCheckpoint`, which
 * reaches KaTeX (~272KB min) through `ScrollableMathText` and
 * `prerenderProblemMath` — putting that whole chain in the eager client
 * graph of all 219 lesson pages, though it renders only on a course's final
 * lesson. (The checkpoint is the one surface that still renders problem math
 * in the browser: `/problems/[slug]` does it on the server, but a Client
 * Component cannot render the Server Component that does — see
 * `CourseCheckpoint`'s header. Behind this boundary that costs nothing
 * eagerly.) Props pass through unchanged.
 *
 * (The props type is declared structurally rather than imported from
 * `./CourseCheckpoint` so that even a type-only top-level reference to that
 * module never shows up as an edge to naive import-graph walkers — the
 * clientBoundary test asserts katex is unreachable from LessonLayout.)
 */
export function LazyCourseCheckpoint(props: LazyCourseCheckpointProps) {
  const { ref, ready } = useDeferredMount<HTMLDivElement>();
  const skeleton = <CheckpointSkeleton problemCount={props.problems.length} />;

  return (
    <div ref={ref}>
      {ready ? (
        <Suspense fallback={skeleton}>
          <CourseCheckpoint {...props} />
        </Suspense>
      ) : (
        skeleton
      )}
    </div>
  );
}
