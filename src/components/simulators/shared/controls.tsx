"use client";

import { useId, type ReactNode } from "react";
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
 * unmodified — these exist so new and touched controls converge on one
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
  /** Base id — the rendered heading id is `${id}-heading`. */
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
          uppercase, tracked, muted) — that rule is unlayered, so it beats any
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
 * introduced its notation — the Rabi Explorer is linked straight off the
 * homepage, and `/simulators` explicitly promises "no lesson to finish
 * first." A control labelled only `Δ` or `V` or `γ` is therefore a dead end
 * for the reader it was most meant for. `docs/BEGINNER_REVIEW.md` named
 * exactly this as the one place the simulators fall short of their own
 * standard.
 *
 * So: every single-letter control symbol gets a plain-English gloss at the
 * point of contact, right under the control that uses it — not a tooltip, not
 * a lesson link, not a definition the reader has to go find. `glossaryId` is
 * optional and adds a "full entry" link; it MUST be an id that already exists
 * in `src/lib/content/glossary.ts` (the glossary page anchors on the raw id),
 * so never invent one — grep first.
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
            {" — "}
            {item.means}
            {item.glossaryId ? (
              <>
                {" "}
                <Link
                  href={`/glossary#${item.glossaryId}`}
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
        // `h-11` (44px) rather than the browser default ~16px: a range input
        // centres its track vertically inside whatever height it's given, so
        // this buys the full touch target the mobile audit asks for without
        // changing how the track looks. Keyboard use is native to
        // `input[type=range]` (arrows step, Home/End jump) — nothing here
        // overrides it.
        className="mt-1 h-11 w-full accent-[var(--pillar-accent)] disabled:opacity-50"
      />
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
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

/** A radiogroup of pill buttons — presets, modes, discrete choices. */
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
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={value === option.id}
          disabled={disabled}
          title={option.title}
          onClick={() => onChange(option.id)}
          className={cn(
            "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:pointer-events-none disabled:opacity-50",
            value === option.id
              ? "bg-pillar text-brand-foreground hover:opacity-90"
              : "border border-border bg-surface text-foreground hover:bg-surface-muted"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
