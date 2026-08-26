import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * ============================================================
 * The four typographic voices, as components
 * ============================================================
 * globals.css defines the raw classes (`.eyebrow`, `.tech-label`,
 * `.tech-value`); these wrap them so call sites read as intent and so the
 * semantics (which element, what a screen reader hears) are decided once.
 *
 * The voices, and what each is for:
 *   Display  moments — page and lesson titles, section openings
 *   Body     everything read at length (the default; no component needed)
 *   Tech     instrument metadata — labels, readouts, units, ids, counts
 *   Math     KaTeX, styled in globals.css
 */

/** The pillar-tinted "you are here" line above a section heading. Rendered as
 *  a `<p>` rather than a heading: it is a label for the heading that follows,
 *  and promoting it to `<h*>` would inject a phantom level into the outline. */
export function Eyebrow({
  children,
  className,
  as: Component = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Component className={cn("eyebrow", className)}>{children}</Component>;
}

/** A section heading in the display voice. `level` sets the element (and thus
 *  the document outline); `size` sets the visual weight — kept separate on
 *  purpose so a visually-quiet h2 doesn't have to become an h3 to look right. */
export function SectionTitle({
  children,
  className,
  level = 2,
  size = "lg",
  id,
}: {
  children: ReactNode;
  className?: string;
  level?: 1 | 2 | 3;
  size?: "sm" | "md" | "lg" | "xl";
  id?: string;
}) {
  const Component = (`h${level}` as const) satisfies ElementType;
  const sizes = {
    sm: "text-xl sm:text-2xl",
    md: "text-2xl sm:text-3xl",
    lg: "text-3xl sm:text-4xl",
    xl: "text-4xl sm:text-5xl lg:text-6xl",
  } as const;

  return (
    <Component
      id={id}
      className={cn(
        "text-balance font-display font-semibold tracking-tight text-foreground",
        size === "xl" ? "leading-[1.03]" : "leading-[1.12]",
        sizes[size],
        className
      )}
    >
      {children}
    </Component>
  );
}

/** Standfirst / deck: the paragraph directly under a title. Slightly larger
 *  than body copy and always measured, because an unmeasured 20px line at
 *  full page width is unreadable. */
export function Lede({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("max-w-[42rem] text-lg leading-relaxed text-muted-foreground", className)}>
      {children}
    </p>
  );
}

/** Instrument metadata label — uppercase, tracked, mono. */
export function TechLabel({
  children,
  className,
  as: Component = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Component className={cn("tech-label", className)}>{children}</Component>;
}

/** A numeric readout. Tabular figures so a changing value doesn't reflow the
 *  text around it — the single most common cause of "jittery" live numbers. */
export function TechValue({
  children,
  className,
  as: Component = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Component className={cn("tech-value", className)}>{children}</Component>;
}

/**
 * A labelled readout pair, the atom of every instrument panel on the site:
 * a tech label above a value. Rendered as a `<div>` of two elements rather
 * than a `<dl>` so it can be dropped anywhere; use `Readouts` below when a
 * group of them genuinely is a description list.
 */
export function Readout({
  label,
  value,
  unit,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <TechLabel>{label}</TechLabel>
      <span className="flex items-baseline gap-1">
        <TechValue className="text-lg">{value}</TechValue>
        {unit ? <span className="text-xs text-subtle-foreground">{unit}</span> : null}
      </span>
    </div>
  );
}

/** A row of readouts as a real description list — correct semantics for
 *  "these labels describe these values," which a screen reader announces as
 *  pairs rather than as loose text. */
export function Readouts({
  items,
  className,
}: {
  items: Array<{ label: ReactNode; value: ReactNode; unit?: ReactNode }>;
  className?: string;
}) {
  return (
    <dl className={cn("flex flex-wrap gap-x-10 gap-y-5", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex flex-col gap-1">
          <dt className="tech-label">{item.label}</dt>
          <dd className="flex items-baseline gap-1">
            <span className="tech-value text-lg">{item.value}</span>
            {item.unit ? <span className="text-xs text-subtle-foreground">{item.unit}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
