"use client";

import { useMemo, useState } from "react";
import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { pureStateDensityMatrix } from "@/lib/quantum/densityMatrix";
import {
  spinObservableInXZPlane,
  chshValue,
  correlationExpectation,
  CHSH_CLASSICAL_BOUND,
  CHSH_QUANTUM_BOUND,
} from "@/lib/quantum/chsh";
import { KatexMath } from "@/components/ui/KatexMath";
import { Readout } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import { CHSHBellTestControls, type ChshAngles } from "./CHSHBellTestControls";
import { CHSHComparisonPanel } from "./CHSHComparisonPanel";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";
import { SimulatorFraming } from "../shared/Framing";
import { Predict } from "../shared/Predict";

const SQRT1_2 = Math.SQRT1_2;

/**
 * |Φ+⟩ = (|00⟩+|11⟩)/√2, the maximally entangled Bell pair shared between
 * Alice and Bob for this experiment. Same construction `chsh.test.ts` uses
 * to verify `chshValue` reaches the Tsirelson bound exactly.
 */
function bellPhiPlus(): StateVector {
  return new StateVector([new Complex(SQRT1_2), Complex.ZERO, Complex.ZERO, new Complex(SQRT1_2)]);
}

const ZERO_ANGLES: ChshAngles = { a: 0, aPrime: 0, b: 0, bPrime: 0 };

/**
 * Floating-point tolerance for comparing S against the classical bound. Without it, angle
 * combinations that are mathematically exactly at the boundary (e.g. all angles at 0, where
 * S = 1+1+1-1 = 2 exactly) can render as S = 2.000000000000001 after the complex-matrix
 * arithmetic in `chshValue`, which is `> 2` and would wrongly read as "exceeds the classical
 * bound" for a configuration that's supposed to sit right on it.
 */
const CLASSICAL_BOUND_EPSILON = 1e-9;

/**
 * The standard optimal CHSH measurement configuration for |Φ+⟩: A=Z, A'=X,
 * B and B' at ±45° from Z. Numerically verified in chsh.test.ts (including
 * a brute-force search over B, B') to reach the Tsirelson bound 2√2 exactly.
 */
const OPTIMAL_ANGLES: ChshAngles = {
  a: 0,
  aPrime: Math.PI / 2,
  b: Math.PI / 4,
  bPrime: -Math.PI / 4,
};

function anglesEqual(x: ChshAngles, y: ChshAngles, tolerance = 1e-6): boolean {
  return (
    Math.abs(x.a - y.a) < tolerance &&
    Math.abs(x.aPrime - y.aPrime) < tolerance &&
    Math.abs(x.b - y.b) < tolerance &&
    Math.abs(x.bPrime - y.bPrime) < tolerance
  );
}

/**
 * A real CHSH Bell-inequality experiment: pick four measurement angles on a
 * shared entangled pair and watch the actual computed CHSH S statistic
 * update live, straight from `chshValue`/`correlationExpectation` in
 * `lib/quantum/chsh.ts`; nothing here is hardcoded or approximated. The
 * point is the number itself: every local hidden-variable theory is capped
 * at |S| ≤ 2 (`CHSH_CLASSICAL_BOUND`); genuine quantum correlations reach
 * up to |S| = 2√2 (`CHSH_QUANTUM_BOUND`, Tsirelson's bound). This is the
 * actual experiment that ruled local realism out.
 */
export function CHSHBellTestExplorer() {
  // First contact opens at the quantum-optimal angles, S = 2√2 ≈ 2.828,
  // the violation itself is on screen immediately, with the all-zero
  // classical reference configuration (S = 2 exactly) one preset click away.
  const [angles, setAngles] = useState<ChshAngles>(OPTIMAL_ANGLES);
  const [showComparison, setShowComparison] = useState(false);

  const rho = useMemo(() => pureStateDensityMatrix(bellPhiPlus()), []);

  const { sValue, terms } = useMemo(() => {
    const a = spinObservableInXZPlane(angles.a);
    const aPrime = spinObservableInXZPlane(angles.aPrime);
    const b = spinObservableInXZPlane(angles.b);
    const bPrime = spinObservableInXZPlane(angles.bPrime);
    return {
      sValue: chshValue(rho, { a, aPrime, b, bPrime }),
      // The four correlations S is assembled from, each straight from
      // `correlationExpectation`, shown live so the reader can see *where*
      // the violation comes from, not just that it happened.
      terms: {
        ab: correlationExpectation(rho, a, b),
        abPrime: correlationExpectation(rho, a, bPrime),
        aPrimeB: correlationExpectation(rho, aPrime, b),
        aPrimeBPrime: correlationExpectation(rho, aPrime, bPrime),
      },
    };
  }, [rho, angles]);

  const exceedsClassical = Math.abs(sValue) > CHSH_CLASSICAL_BOUND + CLASSICAL_BOUND_EPSILON;
  const isZeroPreset = anglesEqual(angles, ZERO_ANGLES);
  const atClassicalBound = Math.abs(Math.abs(sValue) - CHSH_CLASSICAL_BOUND) < 1e-6;

  return (
    <SimulatorInstrument
      label="CHSH Bell test: entangled pair"
      // A bare "S" is this bench's clearest example of a readout that teaches
      // nobody anything on its own: it is the number the whole instrument
      // exists to produce, and it was labelled with a letter the reader meets
      // for the first time two paragraphs further down. The letter stays in
      // the value's own vocabulary (the narration, the gauge, the footnote all
      // still say S); `hint` says what S is, in the body voice rather than
      // `TechLabel`'s uppercase mono, which is not a beginner-gloss voice.
      readout={<Readout label="S" hint="how correlated the pair is" value={sValue.toFixed(3)} />}
      footnote="S > 2 rules out every local hidden-variable theory; 2√2 ≈ 2.83 (Tsirelson's bound) is the quantum limit."
      // `space-y-3`, not the `space-y-6` every sibling on this bench opens
      // with, below the 42rem container threshold `SimulatorInstrument`
      // itself collapses the split layout at. This stage sat 25px past the
      // 716px first-screen budget (measured at 375x812, mount top at y=96),
      // the smallest overage on the bench, so a spacing-only trim closes it
      // without touching the paragraph, the S readout box or the gauge
      // themselves. `@min-[42rem]:space-y-6` restores the original rhythm
      // once the container is wide enough to run the split layout, so
      // desktop is untouched; see the matching `@min-[42rem]:` pair on the
      // live-region box and the gauge caption below.
      stageClassName="space-y-3 @min-[42rem]:space-y-6"
      stage={
        <>
        {/* Trimmed from five sentences to two: the classical-bound claim
            (never exceed 2) and its meaning are what `SimulatorFraming`'s
            "What this shows" and this instrument's own footnote already say,
            almost word for word. What neither says is who is doing the
            measuring, which the sealed-envelope image and the Alice/Bob setup
            below are for. */}
        <p className="text-sm text-muted-foreground">
          Alice and Bob, far apart, each measure one particle from an entangled pair, at one of two angles.
          If each had simply carried its answer along, like a sealed envelope, S below could never pass 2.
          This computes S from your angles, exactly.
        </p>

        <div
          aria-live="polite"
          className={cn(
            // `py-2`, restored to the original `py-3` from 42rem up; see the
            // `stageClassName` note above.
            "rounded-panel border px-4 py-2 text-sm text-foreground @min-[42rem]:py-3",
            exceedsClassical ? "border-accent/40 bg-accent/10" : "border-pillar/25 bg-pillar/5"
          )}
        >
          {exceedsClassical ? (
            <>
              S = {sValue.toFixed(3)}. This exceeds the classical bound of 2. No theory where each particle
              secretly &ldquo;knows&rdquo; its outcome in advance could ever produce this correlation.
            </>
          ) : (
            <>
              S = {sValue.toFixed(3)}, within reach of any local hidden-variable theory (|S| ≤ 2). Try the
              quantum-optimal preset to see it cross the line.
            </>
          )}
        </div>

        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground @min-[42rem]:mb-2">
            CHSH value S against the classical and quantum bounds
          </p>
          <CHSHGauge sValue={sValue} />
        </div>
        </>
      }
      stageAfter={
        <>
        <div className="rounded-panel border border-border bg-surface-muted/60 px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">
            The four correlations S is built from. Note the last one is <em>subtracted</em>
          </p>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
            {[
              { label: "E(a,b)", value: terms.ab, subtracted: false },
              { label: "E(a,b′)", value: terms.abPrime, subtracted: false },
              { label: "E(a′,b)", value: terms.aPrimeB, subtracted: false },
              { label: "E(a′,b′)", value: terms.aPrimeBPrime, subtracted: true },
            ].map((term) => (
              <div key={term.label}>
                <dt className={cn("font-mono text-meta", term.subtracted ? "text-accent" : "text-muted-foreground")}>
                  {term.subtracted ? "− " : "+ "}
                  {term.label}
                </dt>
                <dd className="font-mono text-sm text-foreground">{term.value.toFixed(3)}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* No `overflow-x-auto` here: the only child is a block-level
            `.katex-display`, which fills this content box and carries its own
            horizontal scroll (globals.css §6), so this box never had anything to
            scroll, and `overflow-x: auto` with `overflow-y: visible` computes the
            y axis to `auto` too, which would silently clip a tall equation. The tab
            stop the slab needs now lives on `.katex-display` itself; see
            `focusableDisplayHtml` in src/components/ui/KatexMath.tsx. */}
        <div className="rounded-panel border border-border bg-surface-muted/60 px-4 py-3">
          <KatexMath
            tex={`S = E(a,b) + E(a,b') + E(a',b) - E(a',b') = ${sValue.toFixed(4)}`}
            display
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowComparison((current) => !current)}
            aria-expanded={showComparison}
            // Named only while the panel exists; it is unmounted when
            // collapsed, and an `aria-controls` IDREF that resolves to nothing
            // is invalid. `aria-expanded` carries the state on its own.
            aria-controls={showComparison ? "chsh-comparison-panel" : undefined}
            className="flex w-full items-center justify-between gap-3 rounded-panel border border-border bg-surface px-4 py-3 text-left transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="text-sm font-medium text-foreground">
              Compare: classical bound vs. your quantum result vs. Tsirelson&rsquo;s bound
            </span>
            <span className="text-xs text-muted-foreground">{showComparison ? "Hide" : "Show"}</span>
          </button>
          {showComparison && (
            <div id="chsh-comparison-panel" className="mt-3">
              <CHSHComparisonPanel sValue={sValue} />
            </div>
          )}
        </div>

        <Predict
          question="You open at the quantum-optimal angles: S = 2√2 ≈ 2.83, past anything classical. Load the all-angles-0° classical preset. Where does S land?"
          options={[
            { id: "above", label: "Still above 2" },
            { id: "exactly", label: "Exactly at 2, right on the classical limit" },
            { id: "below", label: "Well below 2" },
          ]}
          outcomeId={!isZeroPreset ? null : exceedsClassical ? "above" : atClassicalBound ? "exactly" : "below"}
        />

        <SimulatorFraming
          shows="Whether any theory where each particle secretly “knows” its measurement outcome in advance (local hidden variables) can match what entangled qubits actually do. It can't, and this experiment shows you the number that proves it."
          watchFor="Every angle combination a real classical theory could ever produce is capped at S=2. Only genuine quantum correlations can cross that line."
          tryThis="You open at the quantum-optimal angles, S ≈ 2.83, already past any classical explanation. Load the all-angles-0° classical preset and watch S drop to exactly 2, then come back via the quantum-optimal preset and watch it cross the line again."
        />
        </>
      }
      controls={
        <CHSHBellTestControls
          angles={angles}
          onAnglesChange={setAngles}
          onApplyZeroPreset={() => setAngles(ZERO_ANGLES)}
          onApplyOptimalPreset={() => setAngles(OPTIMAL_ANGLES)}
          isZeroPreset={anglesEqual(angles, ZERO_ANGLES)}
          isOptimalPreset={anglesEqual(angles, OPTIMAL_ANGLES)}
        />
      }
    />
  );
}

/**
 * A signed horizontal gauge spanning [-2√2, +2√2]: shades the classical
 * "safe zone" |S|≤2 every local hidden-variable theory is stuck inside, and
 * fills from 0 out to the live S value so it's visually obvious the instant
 * the fill spills past the classical-bound tick marks.
 */
function CHSHGauge({ sValue }: { sValue: number }) {
  const quantumBound = CHSH_QUANTUM_BOUND;
  const toPercent = (x: number) => ((x + quantumBound) / (2 * quantumBound)) * 100;

  const centerPct = toPercent(0);
  const valuePct = toPercent(sValue);
  const fillLeft = Math.min(centerPct, valuePct);
  const fillWidth = Math.abs(valuePct - centerPct);
  const classicalLowPct = toPercent(-CHSH_CLASSICAL_BOUND);
  const classicalHighPct = toPercent(CHSH_CLASSICAL_BOUND);
  const exceeds = Math.abs(sValue) > CHSH_CLASSICAL_BOUND + CLASSICAL_BOUND_EPSILON;

  return (
    <div>
      {/* THE CHART CHANNEL, ON A GAUGE.
          The two ±2 ticks are where this instrument's whole claim lives: "S
          crossed that line" is the result. They were `bg-foreground/50`, an
          alpha rather than a token, and the shaded classical zone behind them
          was `bg-border/70`, which is 1.41:1 decorative panel chrome faded a
          further 30%. You could see the fill and not see the line it was
          supposed to have crossed, the same defect the two decay charts on
          this bench were fixed for.
          Now: `--axis` (4.5:1) for the two bound ticks, the reference marks a
          reader must perceive; `--axis-grid` (deliberately under 3:1) for the
          zone shading and the S = 0 tick, which are optional ruling once the
          boundary itself is drawn properly. */}
      <div className="relative h-4 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="absolute inset-y-0 bg-axis-grid/50"
          style={{ left: `${classicalLowPct}%`, width: `${classicalHighPct - classicalLowPct}%` }}
          aria-hidden="true"
        />
        <div
          className={cn(
            "absolute inset-y-0 rounded-full transition-[left,width] duration-200 ease-out motion-reduce:transition-none",
            exceeds ? "bg-accent" : "bg-pillar"
          )}
          style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 w-px bg-axis"
          style={{ left: `${classicalLowPct}%` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 w-px bg-axis"
          style={{ left: `${classicalHighPct}%` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 w-px bg-axis-grid"
          style={{ left: `${centerPct}%` }}
          aria-hidden="true"
        />
      </div>
      {/* `flex-wrap`: these three labels total ~40 monospace characters, which
          overflows the stage at 320px and would push a horizontal scrollbar
          onto the whole page. Wrapping drops the middle label to its own line
          instead; the gauge above still lines up, and nothing is cut off. */}
      <div className="mt-1 flex flex-wrap justify-between gap-x-2 gap-y-1 font-mono text-meta text-muted-foreground">
        <span>−2√2 ≈ {(-quantumBound).toFixed(2)}</span>
        <span>classical bound ±2</span>
        <span>2√2 ≈ {quantumBound.toFixed(2)}</span>
      </div>
    </div>
  );
}
