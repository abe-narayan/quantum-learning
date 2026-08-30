import { Section } from "@/components/ui/Section";

// Static skeleton (no client state, no animation logic) shown for the brief
// window while Next.js fetches the RSC payload for a /simulators navigation.
// The page is fully static, every simulator below it is a client component
// lazy-loaded on the page itself, so this is purely a perceived-performance
// nicety. Shape mirrors SimulatorsPage: eyebrow/title/description, the three
// readouts, the "try the first one" row, the grouped bench directory, then a
// stack of section groups, each with a heading, description, and one large
// placeholder per simulator (the page stacks full-width explorer panels per
// section rather than a card grid).
export default function SimulatorsLoading() {
  return (
    <Section className="animate-pulse">
      {/* The skeleton is a wall of empty boxes: it announces nothing, so a
          screen-reader user got silence for the whole navigation while a
          sighted one got a clear "something is coming" signal. Same pattern
          the in-page skeleton in DailyPuzzleClient.tsx already uses: a
          `role="status"` region carrying one sr-only line. The shimmer bars
          below stay unlabelled; they are decoration, not content. */}
      <p role="status" className="sr-only">
        Loading the simulator bench…
      </p>
      <div className="h-4 w-24 rounded bg-surface-muted" />
      <div className="mt-3 h-12 w-full max-w-lg rounded bg-surface-muted" />
      <div className="mt-4 h-5 w-full max-w-2xl rounded bg-surface-muted" />
      <div className="mt-2 h-5 w-5/6 max-w-2xl rounded bg-surface-muted" />
      <div className="mt-2 h-5 w-1/2 max-w-xl rounded bg-surface-muted" />

      {/* Instruments / Groups / Areas covered, then the "Try the first one"
          button beside its reassurance paragraph. Both rows were missing
          here, so the bench directory below them arrived ~140px higher than
          the skeleton had drawn it and the whole page jumped on load. */}
      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="h-2.5 w-24 rounded bg-surface-muted" />
            <div className="h-6 w-12 rounded bg-surface-muted" />
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="h-11 w-72 rounded-(--radius-tight) bg-surface-muted" />
        <div className="max-w-sm flex-1 space-y-1.5">
          <div className="h-3 w-full rounded bg-surface-muted" />
          <div className="h-3 w-5/6 rounded bg-surface-muted" />
          <div className="h-3 w-2/3 rounded bg-surface-muted" />
        </div>
      </div>

      {/* The bench directory. It is not a flat row of pills, it is five
          labelled groups of link *cards* (instrument name, one-line physics,
          level), which is several hundred pixels taller than the single pill
          row this used to draw. The group sizes below match SIMULATOR_GROUPS
          in ./page.tsx; if a simulator is added there, add it here. */}
      <div className="mt-10 rounded-panel border border-border bg-surface p-6">
        <div className="h-4 w-72 rounded bg-surface-muted" />
        <div className="mt-4 space-y-6">
          {[4, 3, 3, 3, 1].map((count, group) => (
            <div key={group}>
              <div className="h-2.5 w-40 rounded bg-surface-muted" />
              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: count }).map((_, i) => (
                  <div key={i} className="space-y-1 rounded-panel border border-border p-3">
                    <div className="h-4 w-2/3 rounded bg-surface-muted" />
                    <div className="h-3 w-full rounded bg-surface-muted" />
                    <div className="h-3 w-16 rounded bg-surface-muted" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 space-y-20">
        {Array.from({ length: 2 }).map((_, sectionIndex) => (
          <div key={sectionIndex}>
            <div className="h-7 w-64 rounded bg-surface-muted" />
            <div className="mt-3 h-5 w-full max-w-2xl rounded bg-surface-muted" />

            <div className="mt-8 space-y-16">
              {Array.from({ length: 2 }).map((_, itemIndex) => (
                <div key={itemIndex}>
                  <div className="h-3 w-20 rounded bg-surface-muted" />
                  <div className="mt-2 h-6 w-56 rounded bg-surface-muted" />
                  <div className="mt-2 h-4 w-full max-w-2xl rounded bg-surface-muted" />
                  <div className="mt-2 h-4 w-2/3 max-w-xl rounded bg-surface-muted" />
                  <div className="mt-6 h-80 w-full rounded-panel border border-border bg-surface-muted/30" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
