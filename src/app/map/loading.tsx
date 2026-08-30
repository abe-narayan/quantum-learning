import { Section } from "@/components/ui/Section";

// Static skeleton (no client state, no animation logic) shown for the brief
// window while Next.js fetches the RSC payload for a /map navigation. The
// page itself is fully static (getAllLessonsMeta() is the only await, and
// the graph and its rendering are entirely client-side), so this is purely a
// perceived-performance nicety.
//
// Shape mirrors MapPage + ConceptOutline, NOT ConceptMapExplorer. That is the
// change: the explorer is no longer what arrives at the end of a /map
// navigation. `ConceptMapSurface` now renders the server-rendered
// `ConceptOutline` first and hands over to the explorer only once its chunk
// has loaded, so the thing this skeleton stands in for is a single panel with
// an intro line and a running list of concepts, not a graph viewport with a
// legend row, a zoom row and a side detail panel. Mirroring the explorer's
// ~220px of chrome here would put a wall of controls on screen that the next
// paint does not contain, which is the same defect this file was last edited
// to fix, pointed the other way.
//
// The panel below is deliberately one plain block rather than a guess at the
// outline's real height: the outline runs its natural length (59 concepts) and
// no fixed skeleton can match that, so it matches the first screenful and
// stops. When ConceptOutline's header changes, this has to change with it.
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

      <div className="mt-10 overflow-hidden rounded-panel border border-border bg-surface">
        {/* ConceptOutline's intro line, above its own border. */}
        <div className="border-b border-border px-4 py-3 sm:px-5">
          <div className="h-4 w-full max-w-prose rounded bg-surface-muted" />
          <div className="mt-2 h-4 w-2/3 max-w-prose rounded bg-surface-muted" />
        </div>
        {/* One pillar heading and a few concept rows: the shape of the first
            screenful of the outline. Row height matches a concept row's title,
            definition and lesson-link lines. */}
        <div className="p-4 sm:p-5">
          <div className="h-3 w-40 rounded bg-surface-muted" />
          <div className="mt-2 space-y-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 rounded-(--radius-tight) bg-surface-muted/40" />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
