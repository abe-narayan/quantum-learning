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
 *  full page width is unreadable.
 *
 *  `text-xl` (20px), not `text-lg`. `.prose` is now set at 1.125rem
 *  (globals.css §"reading measure"), which is exactly `text-lg` — so on every
 *  page that carries both a lede and a prose body, the lesson page above all,
 *  the standfirst had collapsed onto the body size and the voice with it. 20px
 *  is a visible step over 18px prose and the classic 1.25x standfirst ratio
 *  over the 16px body on the index pages, which is the size this component's
 *  own measure was chosen for. `ApexHero` already overrode to `text-xl` by
 *  hand; that override is now the default. */
/**
 * How wide this standfirst is allowed to run. A **prop**, not a `max-w-*`
 * class passed through `className`, and the difference was not cosmetic.
 *
 * `cn()` is a plain string join with no tailwind-merge, so a `max-w-reading`
 * passed in did not replace the base `max-w-lede`: both landed in the class
 * attribute and *stylesheet* order decided the winner. `globals.css`'s
 * `@theme inline` declares `--container-reading` (46rem) before
 * `--container-lede` (42rem), so `max-w-lede` is emitted last and won every
 * time. Seven call sites across /about, /learn, /lessons, /mastery,
 * /simulators, /current-quantum and `ApexHero` asked for 46rem and silently
 * got 42rem; three more asked for `max-w-none` and stayed capped.
 *
 * Naming the widths here means the component emits exactly one `max-w-*` and
 * there is nothing left to lose a specificity race with. Same class of bug as
 * the `p-4` note in `curriculum/PillarLessonStrip.tsx`; the alternative,
 * adding `tailwind-merge`, is a new dependency against 7.3 KB of client budget
 * headroom for what is really a three-value enum.
 */
type LedeWidth = "lede" | "reading" | "wide" | "none";

const LEDE_WIDTH_CLASS: Record<LedeWidth, string> = {
  lede: "max-w-lede",
  reading: "max-w-reading",
  wide: "max-w-3xl",
  none: "max-w-none",
};

export function Lede({
  children,
  className,
  width = "lede",
}: {
  children: ReactNode;
  className?: string;
  width?: LedeWidth;
}) {
  return (
    <p
      className={cn(
        LEDE_WIDTH_CLASS[width],
        "text-xl leading-relaxed text-muted-foreground",
        className
      )}
    >
      {children}
    </p>
  );
}

/**
 * The one ARIA attribute the two instrument voices forward, and why it has to
 * be declared rather than assumed.
 *
 * A closed props type on a JSX component does **not** reject a hyphenated
 * attribute. TypeScript permits `aria-*` and `data-*` names on any JSX element
 * regardless of the component's declared props, so
 * `<TechValue aria-hidden="true">` type-checks, is destructured by nobody,
 * reaches no element, and emits nothing. `tsc --noEmit` stays green and the
 * markup reads exactly right — the same shape of silent failure as the
 * unlayered-CSS and `rounded-[--x]` traps this codebase already guards.
 *
 * It had shipped. `DailyPuzzleClient`'s reserved-space readout wrote
 * `<TechValue className="text-xs opacity-0" aria-hidden="true">0000-00-00`,
 * and the served homepage carried
 * `<span class="tech-value text-xs opacity-0">0000-00-00</span>`: invisible to
 * a sighted reader, announced to a screen-reader one, which is the exact
 * inversion of what the call site asked for.
 *
 * `aria-hidden` **only**, deliberately. `aria-label` is not forwarded: these
 * render a bare `<span>`, which has the implicit `generic` role, ARIA prohibits
 * naming that role, and every major screen reader drops the attribute — so
 * forwarding it would swap a visibly dead attribute for an invisibly dead one.
 * A caller who needs a name needs a role with it, which is `Panel`'s
 * `nameableRole()` problem and not this one. Note that both components below
 * destructure this attribute *by name* rather than collecting a `...rest`:
 * a rest spread would forward whatever a caller passed, including the
 * `aria-label` this type exists to refuse, and the refusal would then hold
 * only for callers TypeScript actually checks. See
 * `__tests__/ariaPassthrough.test.ts`.
 */
type Hideable = {
  "aria-hidden"?: boolean | "true" | "false";
};

/** Instrument metadata label — uppercase, tracked, mono. */
export function TechLabel({
  children,
  className,
  as: Component = "span",
  "aria-hidden": ariaHidden,
}: Hideable & {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Component aria-hidden={ariaHidden} className={cn("tech-label", className)}>
      {children}
    </Component>
  );
}

/** A numeric readout. Tabular figures so a changing value doesn't reflow the
 *  text around it — the single most common cause of "jittery" live numbers. */
export function TechValue({
  children,
  className,
  as: Component = "span",
  "aria-hidden": ariaHidden,
}: Hideable & {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Component aria-hidden={ariaHidden} className={cn("tech-value", className)}>
      {children}
    </Component>
  );
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
