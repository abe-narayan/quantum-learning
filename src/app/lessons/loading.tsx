import { Section } from "@/components/ui/Section";

// Static skeleton for `/lessons` — the flat "All lessons" index — shown for
// the brief window while Next.js fetches its RSC payload. The page is fully
// static (`getAllLessonsMeta()` is the only await), so this is purely a
// perceived-performance nicety.
//
// This file used to hold the *lesson-page* skeleton, which meant the index
// announced itself with a silhouette it never grows into: a breadcrumb, a
// lesson title, an objectives block and a prose-plus-table-of-contents split,
// none of which exist here. That skeleton now lives in `[...slug]/loading.tsx`
// where it belongs, and this one mirrors what actually loads: the measured
// intro column (eyebrow, title, lede, the four readouts, the "recommended
// order" line), then `LessonIndex`'s "Find a lesson" instrument — its label
// and count readout on one row, the search field, the two chip rails — then
// the grouped lesson list.
export default function LessonsIndexLoading() {
  return (
    <>
      <Section width="reading" tight className="animate-pulse">
        {/* The skeleton is a wall of empty boxes: it announces nothing, so a
            screen-reader user got silence for the whole navigation while a
            sighted one got a clear "something is coming" signal. Same pattern
            the in-page skeleton in DailyPuzzleClient.tsx already uses: a
            `role="status"` region carrying one sr-only line. The shimmer bars
            below stay unlabelled; they are decoration, not content. */}
        <p role="status" className="sr-only">
          Loading the lesson index…
        </p>
        <div className="h-3 w-24 rounded bg-surface-muted" />
        <div className="mt-4 h-12 w-full max-w-lg rounded bg-surface-muted" />
        <div className="mt-5 h-5 w-full max-w-2xl rounded bg-surface-muted" />
        <div className="mt-2 h-5 w-3/4 max-w-xl rounded bg-surface-muted" />

        {/* The four readouts: Lessons / Courses with content / Tracks /
            Reading time, each a label above a value. */}
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="h-2.5 w-20 rounded bg-surface-muted" />
              <div className="h-6 w-14 rounded bg-surface-muted" />
            </div>
          ))}
        </div>

        <div className="mt-6 h-4 w-full max-w-md rounded bg-surface-muted" />
      </Section>

      <Section width="wide" tight className="animate-pulse">
        <div className="overflow-hidden rounded-panel border border-border bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5 sm:px-5">
            <div className="h-3 w-40 rounded bg-surface-muted" />
            <div className="h-3 w-28 rounded bg-surface-muted" />
          </div>
          <div className="space-y-5 p-4 sm:p-5">
            <div className="max-w-md">
              <div className="h-2.5 w-56 rounded bg-surface-muted" />
              <div className="mt-2 h-11 w-full rounded-(--radius-tight) bg-surface-muted" />
            </div>
            {/* Two chip rails: pillar, then difficulty. */}
            {Array.from({ length: 2 }).map((_, rail) => (
              <div key={rail} className="flex flex-wrap gap-2">
                {Array.from({ length: rail === 0 ? 7 : 5 }).map((_, i) => (
                  <div key={i} className="h-11 w-28 rounded-full bg-surface-muted" />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-10">
          {Array.from({ length: 3 }).map((_, group) => (
            <div key={group}>
              <div className="h-6 w-56 rounded bg-surface-muted" />
              <div className="mt-4 space-y-3 divide-y divide-border">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="pt-3 first:pt-0">
                    <div className="h-4 w-2/3 max-w-sm rounded bg-surface-muted" />
                    <div className="mt-2 h-3.5 w-full max-w-lg rounded bg-surface-muted" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
