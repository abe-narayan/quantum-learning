import type { ReactNode } from "react";
import { TechLabel } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

/**
 * The standard "how to read this instrument" block every simulator ends its
 * stage with. Replaces the per-simulator ad hoc `<Badge>` pairs that used to
 * spell out "what we're studying" / "what to notice" / "try this" with one
 * shared shape in the tech voice, pillar-tinted so it reads as instrument
 * documentation rather than a generic callout.
 *
 * All three slots are optional and independently omittable; a simulator
 * with nothing surprising to flag just skips `watchFor`.
 */
export function SimulatorFraming({
  shows,
  watchFor,
  tryThis,
  flush = false,
  className,
}: {
  /** What the instrument shows / the concept being studied. */
  shows?: ReactNode;
  /** What would be surprising, or what to specifically watch for. */
  watchFor?: ReactNode;
  /** A concrete experiment to run. */
  tryThis?: ReactNode;
  /**
   * Drops the top margin, keeping the rule and its padding. For the case
   * where this block is the first child of `SimulatorInstrument`'s
   * `stageAfter` slot: that slot is a grid item, so the grid's own `gap-6`
   * already supplies the 24px, and the `mt-6` below would stack a second
   * 24px on top of it.
   *
   * A prop rather than a `className="mt-0"` override, for the reason
   * `Panel`'s `bodyClassName` doc records at length: `cn()` is a plain join
   * with no tailwind-merge, so two margin utilities of equal specificity in
   * the same layer are settled by whichever the compiled stylesheet emits
   * last. That is a coin toss the call site cannot see. This is decided
   * here, before `cn()` runs.
   */
  flush?: boolean;
  className?: string;
}) {
  if (!shows && !watchFor && !tryThis) return null;

  return (
    <div className={cn(flush ? "border-t border-border pt-6" : "mt-6 border-t border-border pt-6", className)}>
      {shows || watchFor ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {shows ? <FramingItem label="What this shows">{shows}</FramingItem> : null}
          {watchFor ? <FramingItem label="What to watch for">{watchFor}</FramingItem> : null}
        </div>
      ) : null}
      {tryThis ? (
        <div className={shows || watchFor ? "mt-5" : undefined}>
          <FramingItem label="Try this">{tryThis}</FramingItem>
        </div>
      ) : null}
    </div>
  );
}

function FramingItem({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <TechLabel className="text-pillar">{label}</TechLabel>
      <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-4">
        {children}
      </div>
    </div>
  );
}
