import { Section } from "@/components/ui/Section";

// Static skeleton (no client state, no animation logic) shown for the brief
// window while Next.js fetches the RSC payload for a /map navigation. The
// page itself is fully static (getAllLessonsMeta() is the only await, and
// the graph and its rendering are entirely client-side), so this is purely a
// perceived-performance nicety. Shape mirrors MapPage + ConceptMapExplorer:
// eyebrow/title/lede, then the toolbar + graph viewport, and the detail panel.
export default function MapLoading() {
  return (
    <Section className="animate-pulse">
      <div className="h-3 w-10 rounded bg-surface-muted" />
      <div className="mt-3 h-12 w-full max-w-md rounded bg-surface-muted" />
      <div className="mt-4 h-5 w-full max-w-2xl rounded bg-surface-muted" />
      <div className="mt-2 h-5 w-2/3 max-w-xl rounded bg-surface-muted" />

      <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-[--radius-panel] border border-border bg-surface">
          <div className="h-[57px] border-b border-border" />
          <div className="h-[420px] bg-surface-muted/30 sm:h-[560px]" />
        </div>
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-[--radius-panel] border border-border bg-surface p-6 lg:max-h-[652px]">
          <div className="h-4 w-48 rounded bg-surface-muted" />
          <div className="h-4 w-56 rounded bg-surface-muted" />
        </div>
      </div>
    </Section>
  );
}
