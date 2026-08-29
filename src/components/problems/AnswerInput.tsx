import type { ReactNode } from "react";
import { RenderedScrollableMathText } from "./RenderedMathText";
import type { MathRuns } from "./mathRuns";
import { displayLetters, seededShuffle } from "./optionOrder";
import { cn } from "@/lib/utils";
import type { NumericAnswer, Problem } from "@/lib/problems/types";

/**
 * The format spec — rendered *above* the field, before anyone types.
 *
 * The information already existed (`question.inputHint` on all 252 numeric
 * problems, `question.placeholder` on all 174 conceptual ones), but it sat
 * below the input as an afterthought, and the placeholder disappears the
 * moment a character is typed. Both grading paths are strict in ways that
 * are invisible from the field itself: `validateNumeric` parses with
 * `Number(...)`, so "1/2" and "sqrt(2)" are rejected as unparseable rather
 * than evaluated, and `validateConceptual` matches author-supplied key
 * phrases, so a correct answer that never names them reads as incomplete.
 * A student who only finds that out from a rejection has been marked wrong
 * for a syntax rule nobody stated. Stating it up front costs one line.
 *
 * Wired as the input's `aria-describedby`, so it is announced with the field
 * rather than being visual-only.
 */
function FormatSpec({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mb-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs leading-relaxed text-muted-foreground">
      <span className="tech-label shrink-0">Answer format</span>
      <span>{children}</span>
    </p>
  );
}

/** Strip float noise (0.30000000000000004 renders as 0.3) without switching to exponent notation for typical tolerances. */
function formatNumberForHint(value: number): string {
  return String(Number(value.toPrecision(12)));
}

/**
 * The precision the grader will actually apply, derived from the answer
 * spec itself so it can never drift from `validateNumeric`'s arithmetic
 * and needs no per-problem authoring. Without this, the required precision
 * is invisible until a rejection: a student who computes 0.7071 but types
 * 0.7 has no way to know whether that was "close enough".
 */
function precisionHint(answer: NumericAnswer): string {
  if (answer.tolerance === 0) {
    return Number.isInteger(answer.value) ? "The exact integer is required." : "The exact value is required.";
  }
  if (answer.toleranceType === "relative") {
    return `Accepted within ${formatNumberForHint(answer.tolerance * 100)}% of the exact value.`;
  }
  // Fewest decimal places whose worst-case rounding error (half a unit in
  // the last place) still lands inside the tolerance window.
  const decimals = Math.min(12, Math.ceil(Math.log10(0.5 / answer.tolerance)));
  const suggestion =
    decimals > 0
      ? `${decimals} decimal place${decimals === 1 ? "" : "s"} is enough`
      : "the nearest whole number is enough";
  return `Accepted within ±${formatNumberForHint(answer.tolerance)}; ${suggestion}.`;
}

/**
 * Dispatches by `problem.question.type`. Every submission reaches the
 * validator as a plain string — a selected option's `id` for multiple
 * choice, raw typed text for numeric/conceptual — so `validateAnswer`
 * stays the single place that interprets it, never this component.
 * Presentation only: no validation, tolerance or matching logic lives here.
 *
 * This is the one part of the problem view that renders authored math
 * *immediately*, before any interaction — so it is the part that decides
 * whether `/problems/[slug]` ships the KaTeX runtime. It takes `optionMath`
 * (rendered on the server by `renderProblemMath.ts`) rather than calling
 * `ScrollableMathText`, which would pull `katex` across the client boundary
 * with it. See `mathRuns.ts`.
 */
export function AnswerInput({
  problem,
  optionMath,
  value,
  onChange,
  disabled,
}: {
  problem: Problem;
  /** Option text rendered to KaTeX HTML, keyed by option **id** — never by
   *  display position, which the seeded shuffle below owns. Empty for numeric
   *  and conceptual problems, which have no options. */
  optionMath: Record<string, MathRuns>;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const formatId = `${problem.meta.slug}-format`;

  if (problem.question.type === "multiple-choice") {
    // Displayed in a seeded shuffle (seed = slug) rather than authored
    // order, which put the correct answer first often enough to be an
    // exploit. Pure function of the slug: identical on server and client
    // (hydration-safe) and stable across visits. Ids are untouched, and
    // both `correctOptionId` and `optionFeedback` key by id, so grading is
    // unaffected; the visible letters below follow this display order.
    const displayOptions = seededShuffle(problem.question.options, problem.meta.slug);
    // The letters come from `displayLetters` rather than from this map's own
    // index, even though the two are the same shuffle of the same list. The
    // solution panel has to name these same options in prose it was authored
    // with (see `WhyWrongEntry`), and it cannot see this loop — so the letter
    // has exactly one definition, in `optionOrder.ts`, and both readers of it
    // are looking up the same map by id.
    const letters = displayLetters(problem.question.options, problem.meta.slug);
    return (
      <div>
        <FormatSpec id={formatId}>Select one option, then submit.</FormatSpec>
        <div role="radiogroup" aria-label="Answer options" aria-describedby={formatId} className="space-y-2">
          {displayOptions.map((option) => {
            const checked = value === option.id;
            // A lettered instrument cell rather than a generic radio dot — reads
            // as selecting a channel, not filling out a form. The letter itself
            // (not just the fill) is always visible, so the selected state is
            // never carried by color/fill alone.
            const letter = letters.get(option.id) ?? "";
            return (
              <label
                key={option.id}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center gap-3 rounded-(--radius-tight) border px-4 py-3 text-sm transition-colors duration-(--dur-fast)",
                  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-pillar has-[:focus-visible]:outline-offset-2",
                  checked
                    ? "border-pillar bg-pillar-wash"
                    : "border-border bg-surface hover:border-border-strong hover:bg-surface-muted",
                  disabled && "pointer-events-none opacity-60"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "tech-value flex h-6 w-6 shrink-0 items-center justify-center rounded-(--radius-tight) border text-[0.7rem] font-medium",
                    checked ? "border-pillar bg-pillar-wash text-pillar-text" : "border-border-strong text-subtle-foreground"
                  )}
                >
                  {letter}
                </span>
                {/*
                  The visible cell above is `aria-hidden` (it is decorative
                  next to the option text, which is the radio's real name), but
                  the letter cannot be *only* visual: `SolutionPanel` now
                  cross-references options as "Option B", and a reader who
                  never hears a letter in this list has no way to resolve that
                  reference. The input is `sr-only` inside this label, so the
                  label's text content is its accessible name — prefixing it
                  here makes each choice announce as "Option B, <the option>",
                  which is what the solution's phrasing points at.
                */}
                <span className="sr-only">Option {letter}: </span>
                <input
                  type="radio"
                  name={`problem-${problem.meta.slug}`}
                  value={option.id}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onChange(option.id)}
                  className="sr-only"
                />
                {/* Keyed by id, never by this loop's index: the loop is over
                    the shuffled display order and `optionMath` was built from
                    the authored one. Every id is present by construction —
                    `prerenderProblemMath` maps the same `options` array — and
                    these pages are all statically generated, so a key that
                    ever went missing would fail the build rather than blank an
                    answer choice in a reader's browser. */}
                <RenderedScrollableMathText runs={optionMath[option.id]} className="min-w-0 text-foreground" />
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  if (problem.question.type === "numeric") {
    return (
      <div>
        <FormatSpec id={formatId}>
          {problem.question.inputHint ? `${problem.question.inputHint} — ` : null}
          type a plain number. Expressions are not evaluated, so enter 0.707 rather than 1/sqrt(2).
          {/* `problem.answer` isn't narrowed by the `question.type` check
              (TS narrows only the property switched on), so re-check its own
              discriminant; registry.test.ts pins the two in lockstep. */}
          {problem.answer.type === "numeric" ? <> {precisionHint(problem.answer)}</> : null}
        </FormatSpec>
        {/* The focus indicator lives on this label, not on the input, because
            the input is visually borderless — it fills a bordered shell and
            the shell is what a sighted reader perceives as "the field". That
            part was already right; what was missing is that the indicator was
            not an indicator. The input cancels the browser's own outline with
            `focus-visible:outline-none` (below), and the only replacement was
            `focus-within:border-pillar` — a *colour change on a border that is
            already drawn*. That fails WCAG 2.4.7 and 1.4.11 twice over: it
            adds no new visible boundary, and it distinguishes focused from
            unfocused by hue alone, so a reader with a colour-vision deficiency
            (or on a poorly calibrated screen, or in bright sun) tabs into this
            field and sees nothing happen at all. Numeric problems are the
            largest single class in the registry, so this is the site's most
            frequently focused text field.
            `focus-within:` rather than `focus-visible:` on this label:
            `:focus-visible` does not match on a parent of the focused element,
            so the pillar ring has to key off the descendant input's focus. The
            input's own `:focus-visible` still governs whether the *browser*
            would have drawn anything, and the ring being slightly more eager
            (it also lights on a pointer click into the field) is the correct
            trade for a shell that has no other focus affordance.
            `ring-2 ring-offset-2` is the site convention (30 of 31 focus rings
            in `src/` pair it with `ring-offset-background`), and it is safe
            here: the ring extends 4px beyond the label, which sits inside
            `Instrument`'s `p-4` body — 16px of padding before `.instrument`'s
            `overflow-hidden` could clip anything — so no `ring-inset`
            workaround of the kind `WavefunctionExplorer` needs. `border-pillar`
            stays as the secondary, redundant cue. */}
        <label className="flex min-h-11 max-w-xs items-center gap-2 rounded-(--radius-tight) border border-border bg-surface pl-4 pr-2 focus-within:border-pillar focus-within:ring-2 focus-within:ring-pillar focus-within:ring-offset-2 focus-within:ring-offset-background">
          <span className="sr-only">Your answer</span>
          {/* inputMode="text" rather than "decimal": iOS's decimal keypad has
              no minus key, which made every negative answer untypeable on an
              iPhone. Validation is unchanged (validateNumeric parses with
              Number(...)), and the numeric-entry affordances that don't cost
              a key are kept via the attrs below. */}
          <input
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="go"
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            placeholder="0.5"
            aria-describedby={formatId}
            className="tech-value w-full bg-transparent py-2.5 text-base text-foreground placeholder:text-subtle-foreground focus-visible:outline-none disabled:opacity-60"
          />
        </label>
      </div>
    );
  }

  return (
    <div>
      <FormatSpec id={formatId}>
        a sentence or two in your own words. Graded on whether it names the key ideas, so state them
        explicitly rather than implying them.
      </FormatSpec>
      {/* Same defect as the numeric field above, same fix, on the control
          itself this time because the textarea *is* the bordered box — there
          is no shell to move the ring onto. `focus-visible:outline-none`
          removed the browser's indicator and `focus-visible:border-pillar`
          only recoloured a border that was already drawn, which is a
          colour-only state change and no visible focus indicator at all
          (WCAG 2.4.7 / 1.4.11). The ring is a genuinely new boundary and is
          visible in greyscale. Clipping is not a concern for the same reason
          as above: this sits inside `Instrument`'s `p-4` body, 16px clear of
          `.instrument`'s `overflow-hidden`, so the 4px of ring plus offset has
          room and needs no `ring-inset`. */}
      <textarea
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={problem.question.placeholder}
        aria-label="Your answer"
        aria-describedby={formatId}
        rows={3}
        className="w-full rounded-(--radius-tight) border border-border bg-surface px-4 py-2.5 text-foreground placeholder:text-subtle-foreground focus-visible:border-pillar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
      />
    </div>
  );
}
