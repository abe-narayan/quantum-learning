import { Container } from "@/components/ui/Container";

// Static skeleton (no client state, no animation logic) shown for the brief
// window while Next.js fetches the RSC payload for a /glossary navigation.
// The page itself is fully static (getAllLessonsMeta() is the only await),
// so this is purely a perceived-performance nicety. Shape mirrors GlossaryPage
// + GlossaryFilter: eyebrow/title/description, then the filter input and a
// stack of term cards.
export default function GlossaryLoading() {
  return (
    <Container className="animate-pulse py-16">
      <div className="h-4 w-20 rounded bg-surface-muted" />
      <div className="mt-3 h-12 w-full max-w-xs rounded bg-surface-muted" />
      <div className="mt-4 h-5 w-full max-w-2xl rounded bg-surface-muted" />
      <div className="mt-2 h-5 w-2/3 max-w-xl rounded bg-surface-muted" />

      <div className="mt-12 max-w-3xl">
        <div className="h-11 w-full rounded-full bg-surface-muted" />
        <div className="mt-2 h-3 w-20 rounded bg-surface-muted" />

        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="h-5 w-32 rounded bg-surface-muted" />
                <div className="h-5 w-24 rounded-full bg-surface-muted" />
              </div>
              <div className="mt-3 h-4 w-full rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-5/6 rounded bg-surface-muted" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
