import { Container } from "@/components/ui/Container";

// Static skeleton (no client state, no animation logic) shown for the brief
// window while Next.js fetches the RSC payload for a /lessons/[...slug]
// navigation. Every route here is statically generated (`dynamicParams =
// false`), so this is purely a perceived-performance nicety, not a cover for
// real loading time. Shape roughly mirrors LessonLayout: breadcrumb, badges,
// title, description, then a two-column prose + table-of-contents rail.
export default function LessonLoading() {
  return (
    <Container className="animate-pulse py-16">
      <div className="h-4 w-40 rounded bg-surface-muted" />

      <div className="mt-5 max-w-3xl">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-24 rounded-full bg-surface-muted" />
          <div className="h-6 w-16 rounded-full bg-surface-muted" />
        </div>
        <div className="mt-5 h-12 w-full max-w-xl rounded bg-surface-muted" />
        <div className="mt-6 h-5 w-full max-w-2xl rounded bg-surface-muted" />
        <div className="mt-2 h-5 w-3/4 max-w-xl rounded bg-surface-muted" />
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
