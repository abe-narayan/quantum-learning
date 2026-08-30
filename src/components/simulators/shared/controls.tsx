"use client";

import { useId, useRef, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TechValue } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

/**
 * ============================================================
 * Shared control-panel primitives
 * ============================================================
 * The pieces every simulator's controls column is built from: a labelled
 * section (wired to the `aria-labelledby`/`id$="-heading"` convention that
 * `globals.css` retypes into the instrument voice), a slider with a tabular
 * numeric readout, a run/step/reset button row, and a pill-button
 * radiogroup for presets/modes. Existing per-simulator controls keep working
 * unmodified; these exist so new and touched controls converge on one
 * look rather than each simulator inventing its own slider chrome.
 */

/** A control-panel section, wired to the existing `id$="-heading"` CSS hook. */
export function ControlSection({
  id,
  title,
  description,
  children,
  className,
}: {
  /** Base id; the rendered heading id is `${id}-heading`. */
  id: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const headingId = `${id}-heading`;
  return (
    <section aria-labelledby={headingId} className={cn(className)}>
      {/* No typographic classes here on purpose. globals.css section 7 styles
          every `h3[id$="-heading"]` into the technical/instrument voice (mono,
          uppercase, tracked, muted). That rule is unlayered, so it beats any
          Tailwind utility written here, and utilities on this element would be
          silently dead code. The `-heading` id suffix is the contract; the
          look belongs to the stylesheet. */}
      <h3 id={headingId}>
        {title}
      </h3>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

/**
 * ============================================================
 * Symbol glosses
 * ============================================================
 * Every instrument on this bench is reachable *before* any lesson has
 * introduced its notation: the Rabi Explorer is linked straight off the
 * homepage, and `/simulators` explicitly promises "no lesson to finish
 * first." A control labelled only `Δ` or `V` or `γ` is therefore a dead end
 * for the reader it was most meant for. `docs/BEGINNER_REVIEW.md` named
 * exactly this as the one place the simulators fall short of their own
 * standard.
 *
 * So: every single-letter control symbol gets a plain-English gloss at the
 * point of contact, right under the control that uses it, not a tooltip, not
 * a lesson link, not a definition the reader has to go find. `glossaryId` is
 * optional and adds a "full entry" link; it MUST be an id that already exists
 * in `src/lib/content/glossary.ts` (the glossary page anchors on the raw id),
 * so never invent one; grep first.
 */
export function SymbolGloss({
  items,
  className,
}: {
  items: {
    /** The symbol exactly as it appears on the control, e.g. "Δ". */
    symbol: ReactNode;
    /** Its name in words, e.g. "detuning". */
    name: string;
    /** One sentence a reader with no background can act on. */
    means: ReactNode;
    /** An id that already exists in `src/lib/content/glossary.ts`. */
    glossaryId?: string;
  }[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <dl className={cn("mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground", className)}>
      {items.map((item) => (
        <div key={item.name} className="flex gap-2">
          <dt className="w-8 shrink-0 font-mono text-pillar">{item.symbol}</dt>
          <dd className="min-w-0 flex-1">
            <span className="font-medium text-foreground">{item.name}</span>
            {": "}
            {item.means}
            {item.glossaryId ? (
              <>
                {" "}
                {/* `/simulators` mounts every bench on one page, so this
                    link's two visible words appeared 21 times on it with 21
                    different destinations. A screen-reader user pulling up
                    the links list (WCAG 2.4.4) got "full entry" twenty-one
                    times and nothing to choose between them: the `<dd>` that
                    supplies the context visually is not one of the containers
                    2.4.4 counts as programmatically determined, so the name
                    has to carry the symbol's own name.

                    "for <name>" appended, not "Full entry: <name>": the
                    visible words have to survive inside the accessible name
                    as one contiguous run (SC 2.5.3 Label in Name) so a speech
                    user who says "click full entry" still hits it, and both
                    forms satisfy that, but a colon is read by some screen
                    readers as a pause and by others as nothing at all,
                    while "full entry for detuning" is a phrase either way.
                    Same construction as `mdx/Term.tsx`'s gloss link. */}
                <Link
                  href={`/glossary#${item.glossaryId}`}
                  aria-label={`full entry for ${item.name}`}
                  className="whitespace-nowrap text-pillar-text underline decoration-dotted underline-offset-2 hover:decoration-solid"
                >
                  full entry
                </Link>
              </>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** A range input with a tabular-figure readout and consistent equipment styling. */
export function SimulatorSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  unit,
  disabled,
  onChange,
  formatValue,
  valueText,
  hint,
  className,
}: {
  id?: string;
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: ReactNode;
  disabled?: boolean;
  onChange: (value: number) => void;
  /** Formats the numeric readout next to the label. Defaults to the raw value. */
  formatValue?: (value: number) => string;
  /** Screen-reader value text when the raw number needs units/context (e.g. "45 degrees"). */
  valueText?: (value: number) => string;
  hint?: ReactNode;
  className?: string;
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  // The hint is rendered as a plain sibling paragraph below the track, which
  // means nothing connected it to the input it explains. That is tolerable for
  // "The relative phase between |0⟩ and |1⟩", and not tolerable at all for the
  // case this control actually has: `ThreeComponentMixtureExplorer` disables
  // its p₁ slider when p₀ has taken all the weight and puts the *reason*,
  // "p₀ has taken all of the weight … Lower p₀ to free some up", in the hint.
  // A disabled input is out of the tab order, so a screen-reader user reached
  // a control they could not operate (or never reached it at all) with the
  // explanation sitting in unassociated text nearby. `aria-describedby` makes
  // the hint part of the control's own announcement, which is what WCAG 3.3.2
  // is asking for and what turns "unavailable" into "unavailable, and here is
  // how to make it available again".
  const hintId = `${inputId}-hint`;
  const display = formatValue ? formatValue(value) : String(value);

  return (
    <div className={cn(className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={inputId} className="text-sm text-foreground">
          {label}
        </label>
        <span className="flex items-baseline gap-1 whitespace-nowrap">
          <TechValue className="text-sm">{display}</TechValue>
          {unit ? <span className="text-xs text-subtle-foreground">{unit}</span> : null}
        </span>
      </div>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step ?? (max - min) / 100}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={valueText ? valueText(value) : undefined}
        aria-describedby={hint ? hintId : undefined}
        // `h-11` (44px) rather than the browser default ~16px: a range input
        // centres its track vertically inside whatever height it's given, so
        // this buys the full touch target the mobile audit asks for without
        // changing how the track looks. Keyboard use is native to
        // `input[type=range]` (arrows step, Home/End jump); nothing here
        // overrides it.
        className="mt-1 h-11 w-full accent-pillar disabled:opacity-50"
      />
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** The run / step / reset button row shared by the step-through simulators. */
export function RunControls({
  onRun,
  onStep,
  onReset,
  runLabel = "Run",
  stepLabel = "Step",
  resetLabel = "Reset",
  running,
  disabled,
  className,
}: {
  onRun?: () => void;
  onStep?: () => void;
  onReset?: () => void;
  runLabel?: ReactNode;
  stepLabel?: ReactNode;
  resetLabel?: ReactNode;
  running?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {onRun ? (
        <Button size="sm" onClick={onRun} disabled={disabled}>
          {running ? "Running…" : runLabel}
        </Button>
      ) : null}
      {onStep ? (
        <Button size="sm" variant="secondary" onClick={onStep} disabled={disabled}>
          {stepLabel}
        </Button>
      ) : null}
      {onReset ? (
        <Button size="sm" variant="secondary" onClick={onReset} disabled={disabled}>
          {resetLabel}
        </Button>
      ) : null}
    </div>
  );
}

/** A radiogroup of pill buttons: presets, modes, discrete choices. */
export function PillGroup({
  label,
  value,
  options,
  onChange,
  disabled,
  className,
}: {
  /** Accessible name for the group (not rendered). */
  label: string;
  value: string | null;
  options: { id: string; label: ReactNode; title?: string }[];
  onChange: (id: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  // ARIA Authoring Practices roving tabindex for `role="radio"` groups, same
  // pattern as `visualizations/PresetToggle.tsx`: only the selected option is
  // in the Tab order, and arrow keys move *and* select the adjacent option
  // (wrapping), mirroring native radio buttons.
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = options.findIndex((option) => option.id === value);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const count = options.length;
    if (count === 0) return;

    let delta = 0;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") delta = 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") delta = -1;
    else return;

    event.preventDefault();
    const current = selectedIndex === -1 ? 0 : selectedIndex;
    const nextIndex = (current + delta + count) % count;
    onChange(options[nextIndex].id);
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <div role="radiogroup" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option, i) => (
        <button
          key={option.id}
          ref={(el) => {
            buttonRefs.current[i] = el;
          }}
          type="button"
          role="radio"
          aria-checked={value === option.id}
          tabIndex={i === selectedIndex || (selectedIndex === -1 && i === 0) ? 0 : -1}
          disabled={disabled}
          title={option.title}
          onClick={() => onChange(option.id)}
          onKeyDown={handleKeyDown}
          className={cn(
            // `border` is on the shared line, not the branches. Only the
            // *unselected* pill used to carry one, so every selection shrank
            // the chosen pill's border box by 2px in each axis and nudged
            // every pill after it along the row and, once a row wrapped,
            // could move a pill onto another line. That is a reflow on every
            // click of a control whose entire job is being clicked, and it
            // reads as the layout flinching away from the pointer. It is also
            // the exact defect `visualizations/PresetToggle.tsx` documents
            // fixing in itself; this component is the same control one
            // directory over and is used in 12 places, so it was the larger
            // half of the same bug. The selected pill's border is drawn in
            // `border-pillar` so the fill still reads as a solid shape rather
            // than a filled pill inside a grey outline.
            "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:pointer-events-none disabled:opacity-50",
            value === option.id
              ? "border-pillar bg-pillar text-brand-foreground hover:opacity-90"
              : "border-border bg-surface text-foreground hover:bg-surface-muted"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
