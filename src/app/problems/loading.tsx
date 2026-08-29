import { Section } from "@/components/ui/Section";

// Static skeleton for `/problems` — the catalog — shown for the brief window
// while Next.js fetches its RSC payload. The page is fully static, so this is
// purely a perceived-performance nicety.
//
// This file used to hold the *single-problem* skeleton, which meant the
// catalog announced itself with a silhouette it never grows into: a
// breadcrumb, one prompt panel and an answer widget. That skeleton now lives
// in `[slug]/loading.tsx` where it belongs, and this one mirrors what
// actually loads: the measured intro column (eyebrow, title, lede, the
// counts line), then `ProblemsCatalog`'s "New here?" instrument, its filter
// panel — a label-and-count header row above four chip rails — and the card
// grid.
//
// The "New here?" block is drawn because it is what a *first* visit renders
// (a returning reader gets the recommendation panel in roughly the same box),
// and a first visit is the one where the skeleton is most likely to be seen
// at all.
export default function ProblemsIndexLoading() {
  return (
    <>
      <Section width="reading" className="animate-pulse pt-4 sm:pt-8">
        {/* The skeleton is a wall of empty boxes: it announces nothing, so a
            screen-reader user got silence for the whole navigation while a
            sighted one got a clear "something is coming" signal. Same pattern
            the in-page skeleton in DailyPuzzleClient.tsx already uses: a
            `role="status"` region carrying one sr-only line. The shimmer bars
            below stay unlabelled; they are decoration, not content. */}
        <p role="status" className="sr-only">
          Loading the problem catalog…
        </p>
        <div className="h-3 w-20 rounded bg-surface-muted" />
        <div className="mt-3 h-12 w-full max-w-lg rounded bg-surface-muted" />
        <div className="mt-4 h-5 w-full max-w-2xl rounded bg-surface-muted" />
        <div className="mt-2 h-5 w-5/6 max-w-2xl rounded bg-surface-muted" />
        <div className="mt-4 h-4 w-full max-w-2xl rounded bg-surface-muted" />
        <div className="mt-2 h-4 w-2/3 max-w-xl rounded bg-surface-muted" />
      </Section>

      <Section width="wide" tight className="animate-pulse">
        <div className="mb-10 rounded-panel border border-border bg-surface p-5">
          <div className="h-2.5 w-24 rounded bg-surface-muted" />
          <div className="mt-4 h-4 w-full max-w-xl rounded bg-surface-muted" />
          <div className="mt-2 h-4 w-2/3 max-w-lg rounded bg-surface-muted" />
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
            <div className="h-11 w-64 rounded-(--radius-tight) bg-surface-muted" />
            <div className="h-11 w-56 rounded-(--radius-tight) bg-surface-muted" />
          </div>
        </div>

        <div className="overflow-hidden rounded-panel border border-border bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5 sm:px-5">
            <div className="h-3 w-16 rounded bg-surface-muted" />
            <div className="h-3 w-24 rounded bg-surface-muted" />
          </div>
          {/* Four chip rails: Topic, Difficulty, Type, and the status rail. */}
          <div className="space-y-5 p-4 sm:p-5">
            {[7, 4, 3, 3].map((chips, rail) => (
              <div key={rail}>
                <div className="h-2.5 w-20 rounded bg-surface-muted" />
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.from({ length: chips }).map((_, i) => (
                    <div key={i} className="h-11 w-28 rounded-full bg-surface-muted" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-10">
          {Array.from({ length: 2 }).map((_, group) => (
            <div key={group}>
              <div className="h-6 w-56 rounded bg-surface-muted" />
              <div className="mt-3 grid gap-5 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-panel border border-border p-5">
                    <div className="h-4 w-3/4 rounded bg-surface-muted" />
                    <div className="mt-3 h-3.5 w-full rounded bg-surface-muted" />
                    <div className="mt-1.5 h-3.5 w-2/3 rounded bg-surface-muted" />
                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className="h-5 w-20 rounded-full bg-surface-muted" />
                      <div className="h-5 w-16 rounded-full bg-surface-muted" />
                    </div>
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
