import { Container } from "@/components/ui/Container";

// Static skeleton (no client state, no animation logic) shown for the brief
// window while Next.js fetches the RSC payload for a /lessons/[...slug]
// navigation. Every route here is statically generated (`dynamicParams =
// false`), so this is purely a perceived-performance nicety, not a cover for
// real loading time.
//
// It lives in the `[...slug]` segment, not in `/lessons`, which is where it
// used to sit. A `loading.tsx` wraps its own segment's page as well as
// everything nested under it, so from `/lessons` this lesson-shaped
// skeleton (breadcrumb, instrument readouts, title, objectives, and a
// prose-and-ToC split) was also what a reader saw on the way to the *index* page, whose
// real shape is an intro column above a filter panel and a grouped list.
// Flashing the wrong page's silhouette is worse than flashing none, so the
// index has its own skeleton now and this one covers only lessons.
//
// Shape mirrors the current LessonLayout: breadcrumb,
// instrument readouts + progress rung, title, lede, objectives block, the
// lineage instrument, then a two-column prose + table-of-contents rail.
// Deliberately no pillar tint here, which pillar this lesson belongs to is
// exactly the thing not yet loaded, so every block uses the neutral
// `surface-muted` fill rather than guessing a `data-pillar`.
export default function LessonLoading() {
  return (
    <Container className="animate-pulse pb-20 pt-10 sm:pt-14">
      {/* The skeleton is a wall of empty boxes: it announces nothing, so a
          screen-reader user got silence for the whole navigation while a
          sighted one got a clear "something is coming" signal. Same pattern
          the in-page skeleton in DailyPuzzleClient.tsx already uses: a
          `role="status"` region carrying one sr-only line. The shimmer bars
          below stay unlabelled; they are decoration, not content. */}
      <p role="status" className="sr-only">
        Loading the lesson…
      </p>
      <div className="h-3 w-48 rounded bg-surface-muted" />

      <div className="mt-6 max-w-reading">
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-2.5 w-14 rounded bg-surface-muted" />
              <div className="h-4 w-16 rounded bg-surface-muted" />
            </div>
          ))}
        </div>
        <div className="mt-4 h-px w-full max-w-[14rem] rounded-full bg-surface-muted" />

        <div className="mt-7 h-11 w-full max-w-xl rounded bg-surface-muted" />
        <div className="mt-3 h-11 w-2/3 max-w-md rounded bg-surface-muted" />
        <div className="mt-6 h-5 w-full max-w-2xl rounded bg-surface-muted" />
        <div className="mt-2 h-5 w-3/4 max-w-xl rounded bg-surface-muted" />

        <div className="mt-8 space-y-2.5 border-l-2 border-border pl-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-3.5 rounded bg-surface-muted" style={{ width: i === 2 ? "70%" : "92%" }} />
          ))}
        </div>
      </div>

      <div className="mt-8 max-w-reading rounded-panel border border-border p-5">
        <div className="h-2.5 w-16 rounded bg-surface-muted" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="h-4 w-3/4 rounded bg-surface-muted" />
          <div className="h-4 w-2/3 rounded bg-surface-muted" />
        </div>
      </div>

      <div className="mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-10">
        <div className="max-w-reading space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded bg-surface-muted"
              style={{ width: i % 3 === 2 ? "60%" : "100%" }}
            />
          ))}
        </div>
        <div className="mt-10 hidden space-y-2 lg:mt-0 lg:block">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 w-full rounded bg-surface-muted" />
          ))}
        </div>
      </div>
    </Container>
  );
}
