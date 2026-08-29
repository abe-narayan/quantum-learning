import { cn } from "@/lib/utils";

/**
 * The site's mark: three overlapping electron-orbital ellipses around a
 * central point, framed in a hairline instrument box instead of a filled
 * circle badge (the latter is the generic-SaaS-logo cliche the design
 * system explicitly avoids). It's a plain "atom" glyph — legible at the
 * navbar's 32px and the footer's smaller size, not a mascot.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-(--radius-tight) border border-border-strong bg-surface-muted text-brand",
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="h-[65%] w-[65%]" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <ellipse cx="12" cy="12" rx="9.2" ry="3.6" />
        <ellipse cx="12" cy="12" rx="9.2" ry="3.6" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9.2" ry="3.6" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

/** Mark + wordmark, as used in the navbar and footer brand columns.
 *
 *  `labelClassName` exists so the navbar can drop the word on the narrowest
 *  phones while the footer — which has a whole column to itself and no
 *  competing controls — always keeps it. The name is never *truncated*: a
 *  half-rendered "Quantu…" beside the mark reads as a rendering fault, so the
 *  only two states are the full word and the mark alone. See the call site in
 *  Navbar.tsx for the width arithmetic that forces the choice. */
export function Wordmark({
  className,
  markClassName,
  labelClassName,
}: {
  className?: string;
  markClassName?: string;
  labelClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span className={cn("text-base font-semibold tracking-tight text-foreground", labelClassName)}>
        QuantumLearn
      </span>
    </span>
  );
}
