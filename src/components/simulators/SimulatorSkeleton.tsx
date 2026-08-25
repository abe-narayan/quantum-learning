import { cn } from "@/lib/utils";

export type SimulatorSkeletonVariant = "standard" | "hero" | "heroWide";

// Three shapes show up across the 16 Lazy* wrappers:
// - "standard": the aspect-[4/3]/aspect-[2/1] panel used by every simulator
//   embedded on /simulators.
// - "hero": the square, max-w-sm panel used by the Bloch sphere hero on the
//   homepage — the loaded component wraps itself in the same outer div, so
//   the skeleton must match it exactly to avoid a layout jump.
// - "heroWide": the wide 16/10 panel used by the wavefunction hero, also on
//   the homepage.
const PANEL_CLASSES: Record<SimulatorSkeletonVariant, string> = {
  standard:
    "not-prose flex aspect-[4/3] items-center justify-center rounded-3xl border border-border bg-surface sm:aspect-[2/1]",
  hero: "flex aspect-square items-center justify-center rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8",
  heroWide:
    "flex aspect-[16/10] items-center justify-center rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8",
};

export function SimulatorSkeleton({
  variant = "standard",
  className,
}: {
  variant?: SimulatorSkeletonVariant;
  className?: string;
}) {
  const panel = (
    <div className={cn(PANEL_CLASSES[variant], className)} aria-hidden="true">
      <span className="text-sm text-muted-foreground">Loading simulator…</span>
    </div>
  );

  if (variant === "hero") {
    return <div className="relative mx-auto w-full max-w-sm">{panel}</div>;
  }

  return panel;
}
