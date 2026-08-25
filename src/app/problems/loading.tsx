import { Container } from "@/components/ui/Container";

// Static skeleton (no client state, no animation logic) shown for the brief
// window while Next.js fetches the RSC payload for a /problems/[slug]
// navigation. Every route here is statically generated (`dynamicParams =
// false`), so this is purely a perceived-performance nicety, not a cover for
// real loading time. Shape roughly mirrors ProblemLayout: breadcrumb, badges,
// title, a boxed prompt, then the answer widget.
export default function ProblemLoading() {
  return (
    <Container className="animate-pulse py-16">
      <div className="h-4 w-24 rounded bg-surface-muted" />

      <div className="mt-5 max-w-3xl">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-20 rounded-full bg-surface-muted" />
          <div className="h-6 w-16 rounded-full bg-surface-muted" />
          <div className="h-6 w-28 rounded-full bg-surface-muted" />
        </div>
        <div className="mt-4 h-10 w-full max-w-lg rounded bg-surface-muted" />

        <div className="mt-8 space-y-3 rounded-2xl border border-border bg-surface-muted/60 p-6">
          <div className="h-4 w-full rounded bg-surface-muted" />
          <div className="h-4 w-5/6 rounded bg-surface-muted" />
          <div className="h-4 w-2/3 rounded bg-surface-muted" />
        </div>
      </div>

      <div className="mt-8 max-w-3xl space-y-3">
        <div className="h-11 w-full rounded-lg bg-surface-muted" />
        <div className="h-11 w-full rounded-lg bg-surface-muted" />
        <div className="h-11 w-2/3 rounded-lg bg-surface-muted" />
      </div>
    </Container>
  );
}
