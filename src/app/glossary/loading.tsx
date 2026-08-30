import { Section } from "@/components/ui/Section";

// Static skeleton (no client state, no animation logic) shown for the brief
// window while Next.js fetches the RSC payload for a /glossary navigation.
// The page itself is fully static (getAllLessonsMeta() is the only await),
// so this is purely a perceived-performance nicety.
//
// Shape mirrors GlossaryPage + GlossaryFilter: eyebrow/title/lede, then the
// "Start here" panel, then the alphabet rail beside the search input and the
// term rows.
//
// The "Start here" panel is the load-bearing part. It renders whenever the
// filter is empty, which is always, on arrival, and it is a ~550px block:
// a heading, a paragraph, and fifteen linked cards in a two-to-three column
// grid. The skeleton omitted it entirely and drew the A-Z immediately under
// the lede, so the letter rail and every term row slid half a screen down the
// moment the real page arrived. A skeleton that predicts the wrong layout
// costs more than no skeleton at all.
export default function GlossaryLoading() {
  return (
    <Section className="animate-pulse">
      {/* The skeleton is a wall of empty boxes: it announces nothing, so a
          screen-reader user got silence for the whole navigation while a
          sighted one got a clear "something is coming" signal. Same pattern
          the in-page skeleton in DailyPuzzleClient.tsx already uses: a
          `role="status"` region carrying one sr-only line. The shimmer bars
          below stay unlabelled; they are decoration, not content. */}
      <p role="status" className="sr-only">
        Loading the glossary…
      </p>
      <div className="h-3 w-16 rounded bg-surface-muted" />
      <div className="mt-3 h-11 w-full max-w-xs rounded bg-surface-muted" />
      <div className="mt-4 h-5 w-full max-w-2xl rounded bg-surface-muted" />
      <div className="mt-2 h-5 w-full max-w-2xl rounded bg-surface-muted" />
      <div className="mt-2 h-5 w-2/3 max-w-xl rounded bg-surface-muted" />

      <div className="mt-10 rounded-panel border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div>
            <div className="h-2.5 w-20 rounded bg-surface-muted" />
            <div className="mt-1.5 h-6 w-44 rounded bg-surface-muted" />
          </div>
          <div className="h-2.5 w-40 rounded bg-surface-muted" />
        </div>
        <div className="mt-3 h-4 w-full max-w-reading rounded bg-surface-muted" />
        <div className="mt-2 h-4 w-3/4 max-w-xl rounded bg-surface-muted" />
        <div className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="border-l border-border pl-3">
              <div className="h-4 w-2/3 rounded bg-surface-muted" />
              <div className="mt-2 h-3.5 w-full rounded bg-surface-muted" />
              <div className="mt-1.5 h-3.5 w-full rounded bg-surface-muted" />
              <div className="mt-1.5 h-3.5 w-1/2 rounded bg-surface-muted" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 lg:grid lg:grid-cols-[2.75rem_1fr] lg:gap-10">
        <div className="hidden flex-col items-center gap-0.5 lg:flex">
          {Array.from({ length: 26 }).map((_, i) => (
            <div key={i} className="h-6 w-6 rounded bg-surface-muted" />
          ))}
        </div>

        <div>
          <div className="h-11 w-full rounded-(--radius-tight) bg-surface-muted" />
          <div className="mt-2 h-3 w-20 rounded bg-surface-muted" />

          <div className="mt-6 space-y-5 divide-y divide-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="pt-5 first:pt-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="h-5 w-40 rounded bg-surface-muted" />
                  <div className="h-5 w-20 rounded-full bg-surface-muted" />
                </div>
                <div className="mt-2 h-4 w-full max-w-lg rounded bg-surface-muted" />
                <div className="mt-1.5 h-4 w-2/3 max-w-md rounded bg-surface-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
