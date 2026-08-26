"use client";

/**
 * MDX usage (`the-stern-gerlach-experiment.mdx`, `povms-and-generalized-measurement.mdx`,
 * `spectral-decomposition-and-degeneracy.mdx`, and any lesson about
 * measuring a Hermitian operator in its own eigenbasis):
 *
 *   <SpinAxisMeasurement
 *     inputTheta={Math.PI / 3}
 *     ariaLabel="A fixed spin state measured along a rotatable analyzer axis, showing the axis's own two eigenstates and the real Born-rule probability of each."
 *   />
 *
 * The concrete "operator/eigenbasis geometry" picture: a rotatable
 * measurement axis n̂ (confined to the Bloch circle's x–z plane, matching
 * `@/lib/quantum/chsh.ts`'s `spinObservableInXZPlane(θ) = cos(θ)Z + sin(θ)X`
 * convention exactly) has its own two eigenstates |±n̂⟩ — the two points
 * *this* operator is diagonal in — drawn as real points via
 * `blochStateFromAngles`. A fixed input state's overlap with each is turned
 * into a real projective-measurement probability via
 * `outerProduct`/`densityMatrixMeasurementProbability` (the generalized Born
 * rule, not |⟨eigenstate|state⟩|² hand-derived), and "Measure" samples one
 * real outcome (weighted by that same probability) and collapses the
 * displayed state onto the sampled eigenstate — the projective-measurement
 * postulate applied to a rotated (non-computational) basis instead of the
 * fixed Z basis every other measurement demo on this platform uses.
 */

import { useCallback, useMemo, useState } from "react";
import { blochStateFromAngles, densityMatrixToBlochVector } from "@/lib/quantum/bloch";
import { pureStateDensityMatrix, densityMatrixMeasurementProbability, densityMatrixExpectationValue } from "@/lib/quantum/densityMatrix";
import { outerProduct } from "@/lib/quantum/projectors";
import { spinObservableInXZPlane } from "@/lib/quantum/chsh";
import { FigureReadouts } from "./FigureReadouts";

const SIZE = 260;
const R = 96;
const CX = SIZE / 2;
const CY = SIZE / 2;

function toSvg(x: number, z: number) {
  return { px: CX + x * R, py: CY - z * R };
}

export function SpinAxisMeasurement({
  inputTheta = Math.PI / 3,
  inputPhi = 0,
  ariaLabel,
}: {
  /** Bloch polar angle of the fixed input state (kept in the x–z plane, phi=0 or pi, so the whole picture stays 2D and exact). */
  inputTheta?: number;
  /** Bloch azimuthal angle of the input state — pass 0 or Math.PI to stay in the x–z plane this component draws. */
  inputPhi?: number;
  ariaLabel: string;
}) {
  const [axisTheta, setAxisTheta] = useState(0);
  const [outcome, setOutcome] = useState<1 | -1 | null>(null);

  const inputState = useMemo(() => blochStateFromAngles({ theta: inputTheta, phi: inputPhi }), [inputTheta, inputPhi]);
  const inputRho = useMemo(() => pureStateDensityMatrix(inputState), [inputState]);
  const inputVector = useMemo(() => densityMatrixToBlochVector(inputRho), [inputRho]);

  const plusEigenstate = useMemo(() => blochStateFromAngles({ theta: axisTheta, phi: 0 }), [axisTheta]);
  const minusEigenstate = useMemo(() => blochStateFromAngles({ theta: Math.PI - axisTheta, phi: Math.PI }), [axisTheta]);
  const plusVector = useMemo(() => densityMatrixToBlochVector(pureStateDensityMatrix(plusEigenstate)), [plusEigenstate]);
  const minusVector = useMemo(() => densityMatrixToBlochVector(pureStateDensityMatrix(minusEigenstate)), [minusEigenstate]);

  const plusProjector = useMemo(() => outerProduct(plusEigenstate.amplitudes, plusEigenstate.amplitudes), [plusEigenstate]);
  const minusProjector = useMemo(() => outerProduct(minusEigenstate.amplitudes, minusEigenstate.amplitudes), [minusEigenstate]);

  const pPlus = useMemo(() => densityMatrixMeasurementProbability(inputRho, plusProjector), [inputRho, plusProjector]);
  const pMinus = useMemo(() => densityMatrixMeasurementProbability(inputRho, minusProjector), [inputRho, minusProjector]);

  const axisOperator = useMemo(() => spinObservableInXZPlane(axisTheta), [axisTheta]);
  const expectation = useMemo(() => densityMatrixExpectationValue(inputRho, axisOperator).re, [inputRho, axisOperator]);

  const displayed = outcome === 1 ? plusVector : outcome === -1 ? minusVector : inputVector;

  const handleMeasure = useCallback(() => {
    const r = Math.random();
    if (r < pPlus) {
      setOutcome(1);
    } else {
      setOutcome(-1);
    }
  }, [pPlus]);

  const handleReset = useCallback(() => {
    setOutcome(null);
  }, []);

  const inputSvg = toSvg(inputVector.x, inputVector.z);
  const plusSvg = toSvg(plusVector.x, plusVector.z);
  const minusSvg = toSvg(minusVector.x, minusVector.z);
  const displayedSvg = toSvg(displayed.x, displayed.z);
  const origin = toSvg(0, 0);

  const narration =
    outcome === null
      ? `P(+n̂) = ${pPlus.toFixed(3)}, P(−n̂) = ${pMinus.toFixed(3)}. Press Measure to sample one real outcome and collapse onto whichever eigenstate is drawn.`
      : `Measured ${outcome === 1 ? "+n̂" : "−n̂"}: the state has collapsed onto that axis's own eigenstate.`;

  return (
    <div className="not-prose space-y-4 panel-inset p-4 sm:p-5" aria-label={ariaLabel}>
      <div className="flex justify-center">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`Bloch circle. Input state at angle ${inputTheta.toFixed(2)} radians from |0⟩. Measurement axis at angle ${axisTheta.toFixed(2)} radians. ${narration}`} className="w-full max-w-[260px]">
          <circle cx={CX} cy={CY} r={R} className="fill-none stroke-border" strokeWidth={1.5} />
          <text x={CX} y={CY - R - 12} textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">|0⟩</text>
          <text x={CX} y={CY + R + 20} textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">|1⟩</text>

          {/* The measurement axis: a full diameter through its two eigenstates. */}
          <line x1={plusSvg.px} y1={plusSvg.py} x2={minusSvg.px} y2={minusSvg.py} className="stroke-accent" strokeWidth={2} strokeDasharray="5 4" />
          <circle cx={plusSvg.px} cy={plusSvg.py} r={5} className="fill-accent" />
          <circle cx={minusSvg.px} cy={minusSvg.py} r={5} className="fill-accent" />
          <text x={plusSvg.px + (plusSvg.px > CX ? 12 : -12)} y={plusSvg.py} textAnchor={plusSvg.px > CX ? "start" : "end"} className="fill-accent text-[10px] font-semibold">+n̂</text>
          <text x={minusSvg.px + (minusSvg.px > CX ? 12 : -12)} y={minusSvg.py} textAnchor={minusSvg.px > CX ? "start" : "end"} className="fill-accent text-[10px] font-semibold">−n̂</text>

          {/* The state: fixed input, or the post-measurement collapsed eigenstate. */}
          <line x1={origin.px} y1={origin.py} x2={inputSvg.px} y2={inputSvg.py} className={outcome === null ? "stroke-brand" : "stroke-border"} strokeWidth={outcome === null ? 2.5 : 1.5} strokeDasharray={outcome === null ? undefined : "3 3"} />
          {outcome !== null && (
            <line x1={origin.px} y1={origin.py} x2={displayedSvg.px} y2={displayedSvg.py} className="stroke-brand" strokeWidth={2.5} />
          )}
          <circle cx={displayedSvg.px} cy={displayedSvg.py} r={6} className="fill-brand" />
        </svg>
      </div>

      <label className="block">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-foreground">Measurement axis angle θ</span>
          <span className="font-mono text-xs text-muted-foreground">{((axisTheta * 180) / Math.PI).toFixed(0)}°</span>
        </div>
        <input
          type="range"
          min={0}
          max={Math.PI}
          step={0.01}
          value={axisTheta}
          onChange={(e) => {
            setOutcome(null);
            setAxisTheta(Number(e.target.value));
          }}
          aria-label="Measurement axis angle theta, in radians from the Z axis"
          className="mt-2 w-full accent-brand"
        />
      </label>

      <FigureReadouts
        columns={3}
        items={[
          { label: "P(+n̂)", value: pPlus.toFixed(3) },
          { label: "P(−n̂)", value: pMinus.toFixed(3) },
          { label: "⟨n̂·σ⟩", value: expectation.toFixed(3) },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleMeasure}
          className="rounded-md border border-brand bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Measure
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={outcome === null}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Reset
        </button>
      </div>

      <div aria-live="polite" className="rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
        {narration}
      </div>
    </div>
  );
}
