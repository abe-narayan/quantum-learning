import { Section } from "@/components/ui/Section";

// Static skeleton (no client state, no animation logic) shown for the brief
// window while Next.js fetches the RSC payload for a /glossary navigation.
// The page itself is fully static (getAllLessonsMeta() is the only await),
// so this is purely a perceived-performance nicety. Shape mirrors
// GlossaryPage + GlossaryFilter: eyebrow/title/lede, then the alphabet rail
// + search input + a stack of term rows.
export default function GlossaryLoading() {
  return (
    <Section className="animate-pulse">
      <div className="h-3 w-16 rounded bg-surface-muted" />
      <div className="mt-3 h-11 w-full max-w-xs rounded bg-surface-muted" />
      <div className="mt-4 h-5 w-full max-w-2xl rounded bg-surface-muted" />
      <div className="mt-2 h-5 w-2/3 max-w-xl rounded bg-surface-muted" />

      <div className="mt-10 lg:grid lg:grid-cols-[2.75rem_1fr] lg:gap-10">
        <div className="hidden flex-col gap-1 lg:flex">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-6 w-6 rounded bg-surface-muted" />
          ))}
        </div>

        <div>
          <div className="h-11 w-full rounded-[--radius-tight] bg-surface-muted" />
          <div className="mt-2 h-3 w-20 rounded bg-surface-muted" />

          <div className="mt-6 space-y-5 divide-y divide-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="pt-5 first:pt-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="h-5 w-40 rounded bg-surface-muted" />
                  <div className="h-5 w-20 rounded-full bg-surface-muted" />
                </div>
                <div className="mt-2 h-4 w-full max-w-lg rounded bg-surface-muted" />
                <div className="mt-1.5 h-4 w-2/3 max-w-md rounded bg-surface-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
