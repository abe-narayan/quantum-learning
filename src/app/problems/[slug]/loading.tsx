import { Section } from "@/components/ui/Section";

// Static skeleton (no client state, no animation logic) shown for the brief
// window while Next.js fetches the RSC payload for a /problems/[slug]
// navigation. Every route here is statically generated (`dynamicParams =
// false`), so this is purely a perceived-performance nicety, not a cover for
// real loading time.
//
// It lives in the `[slug]` segment, not in `/problems`. A `loading.tsx` wraps
// its own segment's page as well as everything nested under it, so from
// `/problems` this single-problem silhouette — breadcrumb, readouts strip,
// prompt panel, answer widget — was also what a reader saw on the way to the
// *catalog*, which is an intro column above a filter panel and a grid of
// cards. The catalog has its own skeleton now and this one covers only
// individual problems.
//
// Shape mirrors ProblemLayout: breadcrumb, readouts strip,
// title, the prompt panel, then the answer widget.
export default function ProblemLoading() {
  return (
    <Section width="reading" className="animate-pulse">
      {/* The skeleton is a wall of empty boxes: it announces nothing, so a
          screen-reader user got silence for the whole navigation while a
          sighted one got a clear "something is coming" signal. Same pattern
          the in-page skeleton in DailyPuzzleClient.tsx already uses: a
          `role="status"` region carrying one sr-only line. The shimmer bars
          below stay unlabelled; they are decoration, not content. */}
      <p role="status" className="sr-only">
        Loading the problem…
      </p>
      <div className="h-3 w-32 rounded bg-surface-muted" />

      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
        <div className="h-8 w-20 rounded bg-surface-muted" />
        <div className="h-8 w-24 rounded bg-surface-muted" />
        <div className="h-8 w-16 rounded bg-surface-muted" />
      </div>
      <div className="mt-4 h-px w-full max-w-[14rem] rounded-full bg-surface-muted" />

      <div className="mt-7 h-10 w-full max-w-lg rounded bg-surface-muted" />

      <div className="mt-8 space-y-3 rounded-panel border border-border bg-surface-muted/60 p-6">
        <div className="h-4 w-full rounded bg-surface-muted" />
        <div className="h-4 w-5/6 rounded bg-surface-muted" />
        <div className="h-4 w-2/3 rounded bg-surface-muted" />
      </div>

      <div className="mt-8 space-y-3">
        <div className="h-11 w-full rounded-(--radius-tight) bg-surface-muted" />
        <div className="h-11 w-full rounded-(--radius-tight) bg-surface-muted" />
        <div className="h-11 w-2/3 rounded-(--radius-tight) bg-surface-muted" />
      </div>
    </Section>
  );
}
