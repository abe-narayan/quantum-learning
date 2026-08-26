import { Section } from "@/components/ui/Section";

// Static skeleton (no client state, no animation logic) shown for the brief
// window while Next.js fetches the RSC payload for a /simulators navigation.
// The page is fully static — every simulator below it is a client component
// lazy-loaded on the page itself — so this is purely a perceived-performance
// nicety. Shape mirrors SimulatorsPage: eyebrow/title/description, the
// "jump to a simulator" pill nav, then a stack of section groups, each with
// a heading, description, and one large placeholder per simulator (the page
// stacks full-width explorer panels per section rather than a card grid).
export default function SimulatorsLoading() {
  return (
    <Section className="animate-pulse">
      <div className="h-4 w-24 rounded bg-surface-muted" />
      <div className="mt-3 h-12 w-full max-w-lg rounded bg-surface-muted" />
      <div className="mt-4 h-5 w-full max-w-2xl rounded bg-surface-muted" />
      <div className="mt-2 h-5 w-1/2 max-w-xl rounded bg-surface-muted" />

      <div className="mt-10 rounded-[var(--radius-panel)] border border-border bg-surface p-6">
        <div className="h-4 w-48 rounded bg-surface-muted" />
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-7 w-28 rounded-full bg-surface-muted" />
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
                  <div className="mt-6 h-80 w-full rounded-[var(--radius-panel)] border border-border bg-surface-muted/30" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
