import { Section } from "@/components/ui/Section";

// Static skeleton (no client state, no animation logic) shown for the brief
// window while Next.js fetches the RSC payload for a /problems/[slug]
// navigation. Every route here is statically generated (`dynamicParams =
// false`), so this is purely a perceived-performance nicety, not a cover for
// real loading time. Shape mirrors ProblemLayout: breadcrumb, readouts strip,
// title, the prompt panel, then the answer widget.
export default function ProblemLoading() {
  return (
    <Section width="reading" className="animate-pulse">
      <div className="h-3 w-32 rounded bg-surface-muted" />

      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
        <div className="h-8 w-20 rounded bg-surface-muted" />
        <div className="h-8 w-24 rounded bg-surface-muted" />
        <div className="h-8 w-16 rounded bg-surface-muted" />
      </div>
      <div className="mt-4 h-px w-full max-w-[14rem] rounded-full bg-surface-muted" />

      <div className="mt-7 h-10 w-full max-w-lg rounded bg-surface-muted" />

      <div className="mt-8 space-y-3 rounded-[--radius-panel] border border-border bg-surface-muted/60 p-6">
        <div className="h-4 w-full rounded bg-surface-muted" />
        <div className="h-4 w-5/6 rounded bg-surface-muted" />
        <div className="h-4 w-2/3 rounded bg-surface-muted" />
      </div>

      <div className="mt-8 space-y-3">
        <div className="h-11 w-full rounded-lg bg-surface-muted" />
        <div className="h-11 w-full rounded-lg bg-surface-muted" />
        <div className="h-11 w-2/3 rounded-lg bg-surface-muted" />
      </div>
    </Section>
  );
}
