"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KatexMath } from "@/components/ui/KatexMath";
import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { measure, measurementDistribution } from "@/lib/quantum/measurement";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { SuperpositionJourneyCanvas, type JourneyColumn } from "./SuperpositionJourneyCanvas";
import { FigureReadouts } from "../FigureReadouts";

const DEFAULT_ALPHA = Math.SQRT1_2;
/** How long the "measuring…" suspense beat lasts before the result is revealed — long enough to
 * read as a distinct event, short enough not to feel like a loading spinner. */
const MEASURE_SUSPENSE_MS = 550;
/** Matches the Bloch-sphere explorer's collapse-flash duration, for the same reason: a brief
 * highlight marking a discontinuous physical event, not a graceful transition. */
const COLLAPSE_FLASH_MS = 400;

type Tally = { counts: [number, number]; total: number };

const EMPTY_TALLY: Tally = { counts: [0, 0], total: 0 };

/**
 * The platform's first "aha" moment for superposition and measurement: a
 * single qubit alpha|0> + beta|1>, shown as one connected picture running
 * amplitude -> (squared) -> Born-rule probability -> a real, randomly
 * sampled collapse to a definite ket. Every number on screen comes from the
 * same engine used elsewhere (`StateVector`, `measurementDistribution`,
 * `measure`) — nothing here reimplements the Born rule independently.
 *
 * Beta is kept non-negative and derived from alpha by normalization
 * (beta = sqrt(1 - alpha^2)) rather than exposed as its own control: this is
 * the first lesson that introduces amplitudes at all, so the control surface
 * stays to the one slider a first-time reader needs — including its sign,
 * which is deliberately kept adjustable so a learner can see for themselves
 * that a negative amplitude still squares to a positive probability.
 */
export function SuperpositionJourney() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sliderId = useId();

  const [alpha, setAlpha] = useState(DEFAULT_ALPHA);
  const [measuredIndex, setMeasuredIndex] = useState<0 | 1 | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [collapseFlash, setCollapseFlash] = useState(false);
  const [tally, setTally] = useState<Tally>(EMPTY_TALLY);

  const suspenseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (suspenseTimeoutRef.current !== null) clearTimeout(suspenseTimeoutRef.current);
      if (flashTimeoutRef.current !== null) clearTimeout(flashTimeoutRef.current);
    };
  }, []);

  const beta = Math.sqrt(Math.max(0, 1 - alpha * alpha));
  const state = useMemo(() => new StateVector([new Complex(alpha), new Complex(beta)]), [alpha, beta]);
  const distribution = useMemo(() => measurementDistribution(state), [state]);

  const columns: [JourneyColumn, JourneyColumn] = [
    { ketLabel: "0", amplitude: alpha, probability: distribution[0].probability },
    { ketLabel: "1", amplitude: beta, probability: distribution[1].probability },
  ];

  const handleAlphaChange = useCallback(
    (next: number) => {
      if (isMeasuring) return;
      setAlpha(next);
      // A new alpha is a genuinely new superposition — carrying the old tally
      // forward would silently mix statistics from two different distributions.
      setMeasuredIndex(null);
      setTally(EMPTY_TALLY);
    },
    [isMeasuring]
  );

  const handleMeasure = useCallback(() => {
    if (isMeasuring) return;
    if (suspenseTimeoutRef.current !== null) clearTimeout(suspenseTimeoutRef.current);
    if (flashTimeoutRef.current !== null) clearTimeout(flashTimeoutRef.current);

    // Sample the real measurement engine now, against the current (un-collapsed)
    // superposition — `state` itself never changes, so pressing Measure again
    // always re-prepares the same alpha|0> + beta|1> rather than staying collapsed.
    const { outcome } = measure(state);
    const outcomeIndex = outcome.index as 0 | 1;

    const finalize = () => {
      setMeasuredIndex(outcomeIndex);
      setIsMeasuring(false);
      setTally((prev) => {
        const counts: [number, number] = [prev.counts[0], prev.counts[1]];
        counts[outcomeIndex] += 1;
        return { counts, total: prev.total + 1 };
      });
      setCollapseFlash(true);
      flashTimeoutRef.current = setTimeout(() => setCollapseFlash(false), COLLAPSE_FLASH_MS);
    };

    if (prefersReducedMotion) {
      finalize();
    } else {
      setIsMeasuring(true);
      suspenseTimeoutRef.current = setTimeout(finalize, MEASURE_SUSPENSE_MS);
    }
  }, [isMeasuring, state, prefersReducedMotion]);

  const handleReset = useCallback(() => {
    if (suspenseTimeoutRef.current !== null) clearTimeout(suspenseTimeoutRef.current);
    if (flashTimeoutRef.current !== null) clearTimeout(flashTimeoutRef.current);
    setAlpha(DEFAULT_ALPHA);
    setMeasuredIndex(null);
    setIsMeasuring(false);
    setCollapseFlash(false);
    setTally(EMPTY_TALLY);
  }, []);

  const pct0 = tally.total > 0 ? Math.round((tally.counts[0] / tally.total) * 100) : 0;
  const pct1 = tally.total > 0 ? Math.round((tally.counts[1] / tally.total) * 100) : 0;

  // Fully derived from state — no separate narration state to keep in sync.
  const narration = isMeasuring
    ? "Measuring…"
    : measuredIndex === null
      ? "Adjust α below, then press Measure to sample this superposition."
      : `Measured |${measuredIndex}⟩. Tally so far: ${tally.counts[0]} of ${tally.total} gave |0⟩ (${pct0}%), ${tally.counts[1]} of ${tally.total} gave |1⟩ (${pct1}%).`;

  const stateLatex = `|\\psi\\rangle = (${formatAmplitudeLatex(new Complex(alpha))})\\,|0\\rangle + (${formatAmplitudeLatex(
    new Complex(beta)
  )})\\,|1\\rangle`;

  return (
    <div className="not-prose rounded-3xl border border-border bg-surface p-6">
      <div className="mb-5">
        <Badge tone="brand" className="mb-1.5">
          What we&rsquo;re studying
        </Badge>
        <p className="text-sm text-muted-foreground">
          Choose a superposition with the slider, then hit Measure — watch the amplitudes above turn into
          probabilities, and the probabilities turn into one random, definite outcome.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <SuperpositionJourneyCanvas
            columns={columns}
            measuredIndex={measuredIndex}
            isMeasuring={isMeasuring}
            collapseFlash={collapseFlash}
            prefersReducedMotion={prefersReducedMotion}
          />

          {/* No `overflow-x-auto` here: the only child is a block-level
              `.katex-display`, which fills this content box and carries its own
              horizontal scroll (globals.css §6), so this box never had anything to
              scroll — and `overflow-x: auto` with `overflow-y: visible` computes the
              y axis to `auto` too, which would silently clip a tall equation. The tab
              stop the slab needs now lives on `.katex-display` itself; see
              `focusableDisplayHtml` in src/components/ui/KatexMath.tsx. */}
          <div className="mt-4 panel-inset px-4 py-3">
            <KatexMath tex={stateLatex} display />
          </div>

          <FigureReadouts
            className="mt-4"
            items={[
              { label: "α", value: alpha.toFixed(3) },
              { label: "β", value: beta.toFixed(3) },
              { label: "P(0) = |α|²", value: distribution[0].probability.toFixed(3) },
              { label: "P(1) = |β|²", value: distribution[1].probability.toFixed(3) },
            ]}
          />
        </div>

        <div>
          <label htmlFor={sliderId} className="block">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-foreground">α (amplitude of |0⟩)</span>
              <span className="font-mono text-xs text-muted-foreground">{alpha.toFixed(2)}</span>
            </div>
            <input
              id={sliderId}
              type="range"
              min={-1}
              max={1}
              step={0.01}
              value={alpha}
              disabled={isMeasuring}
              onChange={(event) => handleAlphaChange(Number(event.target.value))}
              aria-label="Alpha, the amplitude of ket 0"
              className="mt-2 h-11 w-full accent-brand disabled:opacity-50"
            />
          </label>
          <p className="mt-1.5 text-xs text-muted-foreground">
            β is fixed by normalization: β = √(1 − α²), so |α|² + |β|² = 1 always.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button className="min-h-11" onClick={handleMeasure} disabled={isMeasuring}>
              Measure
            </Button>
            <Button variant="secondary" className="min-h-11" onClick={handleReset} disabled={isMeasuring}>
              Reset
            </Button>
          </div>

          <div
            aria-live="polite"
            className="mt-4 rounded-panel border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground"
          >
            {narration}
          </div>

          <div className="mt-4 panel-inset p-4">
            <p className="tech-label">
              Running tally ({tally.total} measurement{tally.total === 1 ? "" : "s"})
            </p>
            <FigureReadouts
              className="mt-2"
              columns={2}
              items={[
                { label: "|0⟩", value: `${tally.counts[0]} / ${tally.total} ${tally.total > 0 ? `(${pct0}%)` : ""}`, plainLabel: true },
                { label: "|1⟩", value: `${tally.counts[1]} / ${tally.total} ${tally.total > 0 ? `(${pct1}%)` : ""}`, plainLabel: true },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-panel border border-accent/30 bg-accent/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Try this</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-foreground">
          <li>
            Set α all the way to 0 (or 1) and measure a few times — with no superposition left, every
            measurement gives the same outcome, every time.
          </li>
          <li>
            Set α to about 0.71 (equal superposition) and measure ten times. You&rsquo;ll rarely get an
            exact 5/5 split — that randomness is real, not a rounding error.
          </li>
          <li>
            Slide α to a negative value like −0.71, keeping β at 0.71. The state itself changed, but
            P(0) didn&rsquo;t: squaring a negative amplitude still gives a positive probability.
          </li>
        </ul>
      </div>
    </div>
  );
}
