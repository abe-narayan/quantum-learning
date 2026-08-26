import { cn } from "@/lib/utils";

export type SimulatorSkeletonVariant = "standard" | "hero" | "heroWide";

// Three shapes show up across the 16 Lazy* wrappers:
// - "standard": the aspect-[4/3]/aspect-[2/1] panel used by every simulator
//   embedded on /simulators. Uses the raw `.instrument` class (same one
//   `<Instrument>` renders, see ui/Panel.tsx) so the placeholder already has
//   the pillar-tinted wash and corner ticks the real, now-Instrument-shelled
//   simulator will swap in with — no visual "downgrade then upgrade" flash.
// - "hero": the square, max-w-sm panel used by the Bloch sphere hero on the
//   homepage — the loaded component wraps itself in a plain rounded-xl div
//   (not an Instrument), so the skeleton must match *that* exactly to avoid
//   a layout jump.
// - "heroWide": the wide 16/10 panel used by the wavefunction hero, also on
//   the homepage, same plain-panel treatment as "hero".
const PANEL_CLASSES: Record<SimulatorSkeletonVariant, string> = {
  standard: "not-prose instrument flex aspect-[4/3] items-center justify-center overflow-hidden sm:aspect-[2/1]",
  hero: "flex aspect-square items-center justify-center rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8",
  heroWide:
    "flex aspect-[16/10] items-center justify-center rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8",
};

/**
 * "Equipment powering up," not a grey box: a tech-voice label under three
 * staggered pulsing segments standing in for a live readout strip. Purely
 * decorative (the accessible loading state is the sr-only text in the
 * parent), so this whole block is `aria-hidden`. Reduced motion neuters the
 * pulse globally (globals.css §11 zeroes all animations/transitions) and
 * `motion-safe:` skips it at the Tailwind level too, leaving three static
 * segments — still legible as "not ready yet," never a frozen spinner.
 */
function PoweringUp() {
  return (
    <div aria-hidden="true" className="flex flex-col items-center gap-3">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-6 rounded-full bg-pillar/60 motion-safe:animate-pulse"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
      <span className="tech-label text-subtle-foreground">Initializing instrument</span>
    </div>
  );
}

export function SimulatorSkeleton({
  variant = "standard",
  className,
}: {
  variant?: SimulatorSkeletonVariant;
  className?: string;
}) {
  const panel = (
    // `data-simulator-skeleton` is a print hook, not styling. Every Lazy*
    // wrapper loads its simulator with `next/dynamic(..., { ssr: false })`, so
    // the *server-rendered* output of a simulator embed is permanently this
    // placeholder — which means a printed lesson (and a no-JS reader) sees
    // "Initializing instrument" boxes where the instrument should be. The
    // ~162 lessons that embed a simulator directly rather than through
    // <InteractiveSection> have nothing else to key off; globals.css §12 uses
    // this attribute to replace the box with a short note on paper.
    <div
      data-simulator-skeleton=""
      className={cn(PANEL_CLASSES[variant], className)}
      role="status"
    >
      <span className="sr-only">Loading simulator…</span>
      <PoweringUp />
    </div>
  );

  if (variant === "hero") {
    return <div className="relative mx-auto w-full max-w-sm">{panel}</div>;
  }

  return panel;
}
