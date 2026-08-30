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
  className,
}: {
  /** What the instrument shows / the concept being studied. */
  shows?: ReactNode;
  /** What would be surprising, or what to specifically watch for. */
  watchFor?: ReactNode;
  /** A concrete experiment to run. */
  tryThis?: ReactNode;
  className?: string;
}) {
  if (!shows && !watchFor && !tryThis) return null;

  return (
    <div className={cn("mt-6 border-t border-border pt-6", className)}>
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
