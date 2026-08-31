import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TechLabel } from "@/components/ui/Typography";

/**
 * ============================================================
 * Instrument surfaces
 * ============================================================
 * The container vocabulary. `Card` (the older primitive) still exists and
 * still works — it is the plain, quiet box. These add the two treatments the
 * redesign leans on:
 *
 *   Panel       a machined face: hairline edge, faint top highlight, four
 *               elevation levels available via the `--depth-*` ladder.
 *   Instrument  a Panel that is mounted equipment: pillar-tinted, with corner
 *               ticks and an optional header strip carrying a label and live
 *               readouts. Everything that contains a canvas, a simulator or a
 *               large diagram should be one of these.
 *
 * The visual weight lives in globals.css (`.panel`, `.instrument`) rather
 * than in long Tailwind chains here, because both are used from raw class
 * strings elsewhere too (MDX wrappers, simulator internals) and there must be
 * exactly one definition of what a panel looks like.
 */

/**
 * Both primitives below accept `aria-label` / `aria-labelledby`, and both are
 * careful about it in the one way this codebase has repeatedly got wrong: ARIA
 * prohibits naming an element with the implicit `generic` role, so
 * `<div aria-label="…">` labels nothing at all and every major screen reader
 * drops the attribute silently. A name is only honoured on an element that has
 * a role able to take one.
 *
 * So a name passed to either component is paired with a role that can hold it:
 * `Panel`/`Instrument` default to a `div` and are given `role="group"` when —
 * and only when — a name is supplied. `group` deliberately, not `region`:
 * `region` is a landmark, and a page carrying six instrument panels would put
 * six entries in a reader's landmark list where none of them is a top-level
 * division of the page. A caller that genuinely wants a landmark passes
 * `as="section"` with the name, which is a region by definition and leaves the
 * `role` below untouched.
 *
 * **No call site passes a name today**, and that is a finding rather than an
 * oversight: 43 `<Instrument>` and 9 `<Panel>` uses across the tree, none of
 * them named, so the `group` branch below has never run in a browser. It
 * should stay that way until something actually needs it. Every panel on the
 * homepage already carries either a visible `label` strip or a real heading
 * inside its body, and a group name layered on top of those would make a
 * screen reader announce the same words twice on entering the panel, which is
 * the failure mode `MechanicsSection`'s glyphs were made `aria-hidden` to
 * avoid. What the helper is for is the panel that one day has neither.
 *
 * So it is a forward guarantee, and it is kept honest by
 * `__tests__/ariaPassthrough.test.ts` rather than by this paragraph: both
 * branches and the `as="section"` escape are asserted against real rendered
 * markup, so an unused code path cannot quietly rot into a wrong one before
 * its first caller arrives.
 */
type NamedProps = {
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

/** The role to apply so a supplied name is actually honoured: none when the
 *  caller supplied no name, none when they chose their own element (which
 *  brings its own role), `group` for the default `div`. */
function nameableRole(
  Component: ElementType,
  { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy }: NamedProps
): "group" | undefined {
  if (!ariaLabel && !ariaLabelledBy) return undefined;
  return Component === "div" ? "group" : undefined;
}

export function Panel({
  children,
  className,
  as: Component = "div",
  inset = false,
  interactive = false,
  ...named
}: NamedProps & {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Recessed rather than raised — for wells that content sits *in*. */
  inset?: boolean;
  /** Adds the shared hover/focus affordance for panels that are links or
   *  buttons. Never set this on a non-interactive panel: a surface that
   *  lifts on hover but does nothing is a broken promise. */
  interactive?: boolean;
}) {
  return (
    <Component
      {...named}
      role={nameableRole(Component, named)}
      className={cn(
        inset ? "panel-inset" : "panel",
        interactive &&
          "transition-[border-color,background-color,transform] duration-(--dur-fast) ease-instrument hover:border-pillar-edge hover:bg-surface-muted motion-safe:hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </Component>
  );
}

/**
 * A framed instrument. `label` renders a header strip in the technical voice;
 * `readout` sits opposite it for live values, and `footnote` below the body
 * for units, sources or a one-line "what to look for".
 */
export function Instrument({
  children,
  className,
  bodyClassName,
  label,
  readout,
  footnote,
  as: Component = "div",
  ...named
}: NamedProps & {
  children: ReactNode;
  className?: string;
  /**
   * Extra classes for the body `<div>`, for layout the caller owns: a grid,
   * a flex row, a `@container`.
   *
   * **It does not override the body's own `p-4 sm:p-5`.** `cn()` is a plain
   * join with no tailwind-merge, so anything passed here is *appended* to
   * that string rather than replacing part of it, and two padding utilities
   * of equal specificity in the same layer are settled by whichever the
   * compiled stylesheet emits last, not by which one the caller wrote. That
   * is a coin toss, and the tree has landed on both faces of it:
   * `bodyClassName="p-0"` on the two homepage hero simulators lost and did
   * nothing for as long as it existed, while `p-4 sm:p-6` on /hardware won
   * and looked deliberate. Running `@tailwindcss/postcss` over `globals.css`
   * puts `.p-0` at byte 71344, `.p-4` at 71593, `.sm\:p-5` at 118924 and
   * `.sm\:p-6` at 118986 — the offsets move with every edit to the sheet and
   * are only evidence; the *order* is the thing, and it is not something a
   * call site can see or a reviewer can guess.
   *
   * There is deliberately no `flush` / `padding` prop to make the override
   * work. A prop *would* be immune to class order — it decides inside the
   * component, before `cn()` ever runs — and that is the right tool the day
   * something needs it. Nothing does: the two callers that asked for `p-0`
   * were trying to cancel a *second frame* the simulators were drawing
   * inside this one, and the fix was to stop those components self-framing
   * (see WavefunctionHeroExplorer), not to open a hole in this one. The
   * /hardware caller dropped its padding for the site default. So every
   * `bodyClassName` in the tree is now layout that does not overlap the
   * body's own utilities, which is the state to keep: an unused escape hatch
   * is an invitation to route around the padding rather than to ask why a
   * component needs it gone. Same reasoning as `nameableRole` above.
   */
  bodyClassName?: string;
  label?: ReactNode;
  readout?: ReactNode;
  footnote?: ReactNode;
  as?: ElementType;
}) {
  return (
    <Component
      {...named}
      role={nameableRole(Component, named)}
      // `overflow-hidden` stays. It was tempting to swap it for `overflow-x-
      // auto` sitewide (mirroring `.katex-display` in globals.css) after
      // measuring two real 200%-zoom clips — 438px of a live readout on
      // `/lessons/.../what-is-a-qubit` (`InteractiveSection` embedding
      // `SuperpositionJourney`) and 40px of `BlochSphereHeroExplorer`'s own
      // `aria-hidden -inset-10` glow bleed, both traced with
      // `scripts/audit/tmp/overflow-culprit.mjs` and `instrument-overflow-
      // probe.mjs`. Two things ruled that out:
      //
      //   1. `src/lib/design/__tests__/scrollRegions.test.ts`: a scroll
      //      container needs a keyboard tab stop
      //      (`tabIndex={0} role="group"/"region"`), which `.instrument`
      //      cannot supply as a blanket default the way `compare-states-
      //      explorer` supplies it for one specific container — the ~43
      //      call sites cover simulators, prose blocks and static cards
      //      alike, and a static card doesn't need a tab stop that lands on
      //      nothing.
      //   2. `responsive.mjs`'s overflow walker treats any ancestor
      //      `overflow-x: auto|hidden|clip` as containment and stops
      //      looking past it (`containedSideways`, by design — a wide table
      //      in a `ScrollableFigure` is the fix, not the bug). `Instrument`
      //      wraps a large share of the site's content, so making every
      //      instance `auto` would exempt everything inside every panel
      //      from that check, permanently, sitewide — trading one visible
      //      defect for an invisible one.
      //
      // So the actual fix for the 438px case is the `min-w-0` missing on
      // `SuperpositionJourney`'s `grid` item (`src/components/visualizations
      // /superposition-journey/SuperpositionJourney.tsx`, out of this
      // component's reach): without it, that item never shrinks below the
      // KaTeX equation's unbroken min-content width, so `.katex-display`'s
      // own `overflow-x: auto` (globals.css §6) never gets a chance to act.
      // `overflow-hidden` here is correctly clipping a caller's layout bug,
      // not creating one — see the report for the follow-up this needs.
      className={cn("instrument overflow-hidden", className)}
    >
      {label || readout ? (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border px-4 py-2.5 sm:px-5">
          {label ? <TechLabel className="min-w-0 [overflow-wrap:anywhere]">{label}</TechLabel> : <span />}
          {/* `flex-wrap` because a readout is data. The outer row wraps the
              label and the readout onto separate lines on a narrow screen,
              which leaves this group ~256px at 320px — enough for one value,
              not always for three (a date, a difficulty ladder and a units
              string), and a non-wrapping row would push the last one out
              through `.instrument`'s `overflow-hidden` above, where it is
              clipped rather than scrollable and so disappears with no
              symptom (`CurrentQuantumCard`'s category chip hit exactly
              this). `flex-wrap` on this row only rearranges
              *multiple* readout items across lines; a single readout that is
              itself one unbreakable run still needs somewhere to shrink,
              which is what `min-w-0 [overflow-wrap:anywhere]` on both this
              wrapper and the label above gives it — `anywhere`, not
              `break-words`, because only `anywhere` is counted when the
              browser computes a flex item's min-content size, which is what
              its default `min-width: auto` resolves to (same reasoning
              `CurrentQuantumCard` and `TheoremBox` already carry). A reading
              this can't reach: content that is not text at all (a canvas, a
              wide non-wrapping KaTeX formula, a grid that never got a
              `min-w-0` of its own upstream) has nothing for `overflow-wrap`
              to act on and still clips here — that is a caller-side layout
              bug this wrapper cannot fix from outside, not a reason to make
              this container itself a scroll region (see the note on
              `overflow-hidden` above for why not). `gap-y-1` keeps a wrapped
              second line tight against the first instead of inheriting the
              16px horizontal gap. */}
          {readout ? (
            <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 [overflow-wrap:anywhere]">
              {readout}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
      {footnote ? (
        <div className="border-t border-border px-4 py-2.5 text-xs text-subtle-foreground [overflow-wrap:anywhere] sm:px-5">
          {footnote}
        </div>
      ) : null}
    </Component>
  );
}

/**
 * A hairline separator that fades at both ends, so sections divide without
 * the hard rule that would fight the atmospheric background behind them.
 * Decorative by definition — an `<hr>` would be announced as a thematic break
 * that the heading structure already conveys.
 */
export function FadeRule({ className }: { className?: string }) {
  return <div aria-hidden="true" data-decorative="" className={cn("rule-fade", className)} />;
}
