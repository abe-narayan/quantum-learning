import { Container } from "@/components/ui/Container";

// Static skeleton (no client state, no animation logic) shown for the brief
// window while Next.js fetches the RSC payload for a /lessons/[...slug]
// navigation. Every route here is statically generated (`dynamicParams =
// false`), so this is purely a perceived-performance nicety, not a cover for
// real loading time. Shape mirrors the current LessonLayout: breadcrumb,
// instrument readouts + progress rung, title, lede, objectives block, the
// lineage instrument, then a two-column prose + table-of-contents rail.
// Deliberately no pillar tint here — which pillar this lesson belongs to is
// exactly the thing not yet loaded — so every block uses the neutral
// `surface-muted` fill rather than guessing a `data-pillar`.
export default function LessonLoading() {
  return (
    <Container className="animate-pulse pb-20 pt-10 sm:pt-14">
      <div className="h-3 w-48 rounded bg-surface-muted" />

      <div className="mt-6 max-w-3xl">
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-2.5 w-14 rounded bg-surface-muted" />
              <div className="h-4 w-16 rounded bg-surface-muted" />
            </div>
          ))}
        </div>
        <div className="mt-4 h-px w-full max-w-[14rem] rounded-full bg-surface-muted" />

        <div className="mt-7 h-11 w-full max-w-xl rounded bg-surface-muted" />
        <div className="mt-3 h-11 w-2/3 max-w-md rounded bg-surface-muted" />
        <div className="mt-6 h-5 w-full max-w-2xl rounded bg-surface-muted" />
        <div className="mt-2 h-5 w-3/4 max-w-xl rounded bg-surface-muted" />

        <div className="mt-8 space-y-2.5 border-l-2 border-border pl-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-3.5 rounded bg-surface-muted" style={{ width: i === 2 ? "70%" : "92%" }} />
          ))}
        </div>
      </div>

      <div className="mt-8 max-w-3xl rounded-[var(--radius-panel)] border border-border p-5">
        <div className="h-2.5 w-16 rounded bg-surface-muted" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="h-4 w-3/4 rounded bg-surface-muted" />
          <div className="h-4 w-2/3 rounded bg-surface-muted" />
        </div>
      </div>

      <div className="mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-10">
        <div className="max-w-3xl space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded bg-surface-muted"
              style={{ width: i % 3 === 2 ? "60%" : "100%" }}
            />
          ))}
        </div>
        <div className="mt-10 hidden space-y-2 lg:mt-0 lg:block">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 w-full rounded bg-surface-muted" />
          ))}
        </div>
      </div>
    </Container>
  );
}
