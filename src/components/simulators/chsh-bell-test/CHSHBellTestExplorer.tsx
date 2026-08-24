"use client";

import { useMemo, useState } from "react";
import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { pureStateDensityMatrix } from "@/lib/quantum/densityMatrix";
import {
  spinObservableInXZPlane,
  chshValue,
  CHSH_CLASSICAL_BOUND,
  CHSH_QUANTUM_BOUND,
} from "@/lib/quantum/chsh";
import { KatexMath } from "@/components/ui/KatexMath";
import { cn } from "@/lib/utils";
import { CHSHBellTestControls, type ChshAngles } from "./CHSHBellTestControls";
import { LabNotes } from "./LabNotes";

const SQRT1_2 = Math.SQRT1_2;

/**
 * |Φ+⟩ = (|00⟩+|11⟩)/√2 — the maximally entangled Bell pair shared between
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
 * `lib/quantum/chsh.ts` — nothing here is hardcoded or approximated. The
 * point is the number itself: every local hidden-variable theory is capped
 * at |S| ≤ 2 (`CHSH_CLASSICAL_BOUND`); genuine quantum correlations reach
 * up to |S| = 2√2 (`CHSH_QUANTUM_BOUND`, Tsirelson's bound). This is the
 * actual experiment that ruled local realism out.
 */
export function CHSHBellTestExplorer() {
  const [angles, setAngles] = useState<ChshAngles>(ZERO_ANGLES);

  const rho = useMemo(() => pureStateDensityMatrix(bellPhiPlus()), []);

  const sValue = useMemo(() => {
    const observables = {
      a: spinObservableInXZPlane(angles.a),
      aPrime: spinObservableInXZPlane(angles.aPrime),
      b: spinObservableInXZPlane(angles.b),
      bPrime: spinObservableInXZPlane(angles.bPrime),
    };
    return chshValue(rho, observables);
  }, [rho, angles]);

  const exceedsClassical = Math.abs(sValue) > CHSH_CLASSICAL_BOUND + CLASSICAL_BOUND_EPSILON;

  return (
    <div className="not-prose grid gap-6 rounded-3xl border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
      <div className="space-y-6">
        <div
          aria-live="polite"
          className={cn(
            "rounded-xl border px-4 py-3 text-sm text-foreground",
            exceedsClassical ? "border-accent/40 bg-accent/10" : "border-brand/25 bg-brand/5"
          )}
        >
          {exceedsClassical ? (
            <>
              S = {sValue.toFixed(3)} — this exceeds the classical bound of 2. No theory where each particle
              secretly &ldquo;knows&rdquo; its outcome in advance could ever produce this correlation.
            </>
          ) : (
            <>
              S = {sValue.toFixed(3)} — within reach of any local hidden-variable theory (|S| ≤ 2). Try the
              quantum-optimal preset to see it cross the line.
            </>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            CHSH value S against the classical and quantum bounds
          </p>
          <CHSHGauge sValue={sValue} />
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-surface-muted/60 px-4 py-3">
          <KatexMath
            tex={`S = E(a,b) + E(a,b') + E(a',b) - E(a',b') = ${sValue.toFixed(4)}`}
            display
          />
        </div>

        <LabNotes
          notes={[
            {
              label: "What we're studying",
              content:
                "Whether any theory where each particle secretly “knows” its measurement outcome in advance (local hidden variables) can match what entangled qubits actually do. It can't — and this experiment shows you the number that proves it.",
            },
            {
              label: "Try this",
              content:
                "Start with all four angles at 0° and confirm S stays inside the classical bound. Then load the quantum-optimal preset and watch S climb past 2, toward 2√2 ≈ 2.83.",
            },
            {
              label: "What to notice",
              content:
                "Every angle combination a real classical theory could ever produce is capped at S=2. Only genuine quantum correlations can cross that line.",
            },
          ]}
        />
      </div>

      <CHSHBellTestControls
        angles={angles}
        onAnglesChange={setAngles}
        onApplyZeroPreset={() => setAngles(ZERO_ANGLES)}
        onApplyOptimalPreset={() => setAngles(OPTIMAL_ANGLES)}
        isZeroPreset={anglesEqual(angles, ZERO_ANGLES)}
        isOptimalPreset={anglesEqual(angles, OPTIMAL_ANGLES)}
      />
    </div>
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
      <div className="relative h-4 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="absolute inset-y-0 bg-border/70"
          style={{ left: `${classicalLowPct}%`, width: `${classicalHighPct - classicalLowPct}%` }}
          aria-hidden="true"
        />
        <div
          className={cn(
            "absolute inset-y-0 rounded-full transition-[left,width] duration-200 ease-out motion-reduce:transition-none",
            exceeds ? "bg-accent" : "bg-brand"
          )}
          style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 w-px bg-foreground/50"
          style={{ left: `${classicalLowPct}%` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 w-px bg-foreground/50"
          style={{ left: `${classicalHighPct}%` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 w-px bg-foreground/20"
          style={{ left: `${centerPct}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[11px] text-muted-foreground">
        <span>−2√2 ≈ {(-quantumBound).toFixed(2)}</span>
        <span>classical bound ±2</span>
        <span>2√2 ≈ {quantumBound.toFixed(2)}</span>
      </div>
    </div>
  );
}
