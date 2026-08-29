import { Section } from "@/components/ui/Section";

// Static skeleton (no client state, no animation logic) shown for the brief
// window while Next.js fetches the RSC payload for a /map navigation. The
// page itself is fully static (getAllLessonsMeta() is the only await, and
// the graph and its rendering are entirely client-side), so this is purely a
// perceived-performance nicety.
//
// Shape mirrors MapPage + ConceptMapExplorer. The three stacked header rows
// below are not padding for its own sake: the explorer grew an orientation
// block ("Every box is one idea…" plus the Graph/List switch, the "Start at
// the beginning" button and the "Show me the path to" picker), a
// legend/zoom-controls row, and a status line — roughly 220px of chrome —
// while this skeleton still drew the single 57px toolbar it had before any of
// that existed. The whole point of a skeleton is that nothing moves when the
// real thing arrives, and this one shifted the graph viewport up the page by
// most of its own height on every /map navigation. When the explorer's header
// changes, this has to change with it.
export default function MapLoading() {
  return (
    <Section className="animate-pulse">
      {/* The skeleton is a wall of empty boxes: it announces nothing, so a
          screen-reader user got silence for the whole navigation while a
          sighted one got a clear "something is coming" signal. Same pattern
          the in-page skeleton in DailyPuzzleClient.tsx already uses: a
          `role="status"` region carrying one sr-only line. The shimmer bars
          below stay unlabelled; they are decoration, not content. */}
      <p role="status" className="sr-only">
        Loading the concept map…
      </p>
      <div className="h-3 w-10 rounded bg-surface-muted" />
      <div className="mt-3 h-12 w-full max-w-md rounded bg-surface-muted" />
      <div className="mt-4 h-5 w-full max-w-2xl rounded bg-surface-muted" />
      <div className="mt-3 h-4 w-full max-w-prose rounded bg-surface-muted" />
      <div className="mt-2 h-4 w-2/3 max-w-prose rounded bg-surface-muted" />

      <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-panel border border-border bg-surface">
          {/* Orientation block: the explanatory sentence and the view switch
              on one wrapping row, then the two entry-point controls. */}
          <div className="border-b border-border px-4 py-4">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full max-w-prose rounded bg-surface-muted" />
                <div className="h-4 w-2/3 max-w-prose rounded bg-surface-muted" />
              </div>
              <div className="h-11 w-[8.5rem] shrink-0 rounded-(--radius-tight) bg-surface-muted" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <div className="h-11 w-52 rounded-(--radius-tight) bg-surface-muted" />
              <div className="h-11 w-64 rounded-(--radius-tight) bg-surface-muted" />
            </div>
          </div>

          {/* Pillar legend on the left, zoom and path controls on the right. */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border px-4 py-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-3 w-24 rounded bg-surface-muted" />
              ))}
            </div>
            <div className="h-11 w-64 rounded-full bg-surface-muted" />
          </div>

          {/* The "what is selected" status line. */}
          <div className="border-b border-border px-4 py-2">
            <div className="h-4 w-full max-w-md rounded bg-surface-muted" />
          </div>

          <div className="h-[420px] bg-surface-muted/30 sm:h-[560px]" />
        </div>
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-panel border border-border bg-surface p-6 lg:max-h-[652px]">
          <div className="h-4 w-48 rounded bg-surface-muted" />
          <div className="h-4 w-56 rounded bg-surface-muted" />
        </div>
      </div>
    </Section>
  );
}
