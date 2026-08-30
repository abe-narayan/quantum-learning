"use client";

/**
 * MDX usage (`the-three-qubit-bit-flip-code.mdx`, `the-three-qubit-phase-flip-code.mdx`,
 * `syndrome-measurement-and-the-recovery-map.mdx`, `why-quantum-errors-are-different.mdx`):
 *
 *   <ErrorCorrectionCycle ariaLabel="A logical qubit encoded, hit with a real bit-flip or phase-flip error, and corrected via real syndrome extraction." />
 *
 * A full error-correction cycle — encode, inject, diagnose, correct — driven
 * entirely by `@/lib/quantum/errorCorrection.ts`'s real repetition-code
 * functions (`encodeBitFlipCode`/`encodePhaseFlipCode`,
 * `applyBitFlipError`/`applyPhaseFlipError`,
 * `runBitFlipCorrectionCycle`/`runPhaseFlipCorrectionCycle`), never a
 * scripted animation of what correction is "supposed" to do. The ancilla
 * measurement inside the correction cycle is, for a single-Pauli-error
 * codeword, provably deterministic (the syndrome is a definite classical
 * function of the error, not a coin flip) — the fixed `ancillaRandoms`
 * passed here is a reproducibility convenience the library itself documents,
 * not a shortcut that changes the outcome.
 */

import { useMemo, useState } from "react";
import { Complex } from "@/lib/quantum/complex";
import {
  encodeBitFlipCode,
  encodePhaseFlipCode,
  applyBitFlipError,
  applyPhaseFlipError,
  runBitFlipCorrectionCycle,
  runPhaseFlipCorrectionCycle,
} from "@/lib/quantum/errorCorrection";
import { PresetToggle } from "./PresetToggle";
import { FigureReadouts } from "./FigureReadouts";

const CODE_OPTIONS = [{ label: "Bit-flip code" }, { label: "Phase-flip code" }];
const ERROR_OPTIONS = [{ label: "No error" }, { label: "Error on q0" }, { label: "Error on q1" }, { label: "Error on q2" }];
const STAGE_LABELS = ["Encoded", "Error injected", "Syndrome & correction", "Verified"];
/** Deterministic for a single-Pauli-error codeword — see module comment. */
const ANCILLA_RANDOMS: [number, number] = [0.001, 0.001];
/** The fixed logical input state this demo encodes: an equal superposition, α=β=1/√2. */
const LOGICAL_ALPHA = new Complex(Math.SQRT1_2);
const LOGICAL_BETA = new Complex(Math.SQRT1_2);

export function ErrorCorrectionCycle({ ariaLabel }: { ariaLabel: string }) {
  const [codeIndex, setCodeIndex] = useState(0);
  const [errorIndex, setErrorIndex] = useState(1);
  const [stage, setStage] = useState(0);

  const isPhaseFlip = codeIndex === 1;
  const errorQubit = errorIndex === 0 ? null : errorIndex - 1;

  const encoded = useMemo(
    () => (isPhaseFlip ? encodePhaseFlipCode(LOGICAL_ALPHA, LOGICAL_BETA) : encodeBitFlipCode(LOGICAL_ALPHA, LOGICAL_BETA)),
    [isPhaseFlip]
  );

  const withError = useMemo(() => {
    if (errorQubit === null) return encoded;
    return isPhaseFlip ? applyPhaseFlipError(encoded, errorQubit) : applyBitFlipError(encoded, errorQubit);
  }, [encoded, errorQubit, isPhaseFlip]);

  const result = useMemo(
    () => (isPhaseFlip ? runPhaseFlipCorrectionCycle(withError, ANCILLA_RANDOMS) : runBitFlipCorrectionCycle(withError, ANCILLA_RANDOMS)),
    [withError, isPhaseFlip]
  );

  // Fidelity of the corrected *codeword* against the original one.
  //
  // `runBitFlipCorrectionCycle`/`runPhaseFlipCorrectionCycle` return the
  // 3-qubit (dimension-8) data state with the two measured ancillas traced
  // out and renormalised — not a decoded 1-qubit state. Comparing it against
  // the dimension-2 `LOGICAL_STATE` therefore threw
  // "States must have the same dimension for an inner product" the moment a
  // lesson embedded this component, which is exactly what it did during a
  // production build. The right comparison — and the one the demo actually
  // means — is against `encoded`, the codeword before the error: a successful
  // cycle should return the state to it, giving fidelity 1.
  const fidelity = result.corrected.innerProduct(encoded).magnitudeSquared();

  const handleReset = () => setStage(0);
  const handleAdvance = () => setStage((s) => Math.min(STAGE_LABELS.length - 1, s + 1));
  const handleBack = () => setStage((s) => Math.max(0, s - 1));

  const errorTypeName = isPhaseFlip ? "Z (phase-flip)" : "X (bit-flip)";

  const stageDescription = [
    `The logical qubit α|0⟩+β|1⟩ (α=β=1/√2) is encoded into the 3-qubit ${isPhaseFlip ? "phase-flip" : "bit-flip"} code.`,
    errorQubit === null
      ? "No error is injected: the codeword is untouched."
      : `A real ${errorTypeName} error is applied to physical qubit q${errorQubit}.`,
    `Two ancillas measure the syndrome via real partial measurement: (s1,s2) = (${result.syndrome[0]},${result.syndrome[1]}). ${
      result.correctedQubit === null ? "No correction indicated: the syndrome is (0,0)." : `Diagnosed error on q${result.correctedQubit}; the matching correction gate is applied.`
    }`,
    `Fidelity of the corrected codeword against the original encoded state: ${fidelity.toFixed(4)}${
      fidelity > 0.999 ? ". Fully recovered." : ". NOT fully recovered (this happens only when the diagnosed correction doesn't match reality, e.g. two simultaneous errors, which this distance-3 code cannot handle)."
    }`,
  ];

  return (
    // `role="group"` so the `aria-label` is actually used. `aria-label` is
    // ignored on an element with the implicit `generic` role — the ARIA spec
    // prohibits naming `generic`, and every browser drops the name rather than
    // exposing an unnamed-role element with a label. This `<div>` was the only
    // element in the figure carrying a description of what the figure *is*, so
    // the whole `ariaLabel` prop was being computed, passed down, and thrown
    // away: a screen-reader user met the controls and the stage narration with
    // no framing at all.
    //
    // `group`, not `img`, and the distinction matters here for the same reason
    // it does in `simulators/circuit-builder/CircuitDiagram.tsx`: `img` is
    // children-presentational, and this container holds two `PresetToggle`
    // radiogroups plus a stage narration that a reader must be able to reach.
    // `img` would have named the figure by silencing everything in it.
    // (`DecoherenceBlochDecay` in this directory is already on this pattern.)
    <div role="group" className="not-prose space-y-4 panel-inset p-4 sm:p-5" aria-label={ariaLabel}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="tech-label">Code</h3>
          <div className="mt-2">
            <PresetToggle
              options={CODE_OPTIONS}
              index={codeIndex}
              onChange={(i) => {
                setCodeIndex(i);
                setStage(0);
              }}
              ariaLabel="Which repetition code to use"
            />
          </div>
        </div>
        <div>
          <h3 className="tech-label">Injected error</h3>
          <div className="mt-2">
            <PresetToggle
              options={ERROR_OPTIONS}
              index={errorIndex}
              onChange={(i) => {
                setErrorIndex(i);
                setStage(0);
              }}
              ariaLabel="Which physical qubit to hit with an error, if any"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between panel-inset px-4 py-2.5">
        {STAGE_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={
                i <= stage
                  ? "flex h-6 w-6 items-center justify-center rounded-full bg-brand text-meta font-semibold text-brand-foreground"
                  : "flex h-6 w-6 items-center justify-center rounded-full border border-border text-meta text-muted-foreground"
              }
            >
              {i + 1}
            </span>
            <span className={i === stage ? "text-xs font-semibold text-foreground" : "text-xs text-muted-foreground"}>{label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {/* `aria-disabled` rather than the native `disabled` attribute, on
            Back and Advance both. Advancing is how a reader gets through this
            figure at all — four presses of the same button, in place — and on
            the fourth one a natively-disabled button stops being focusable
            *while it currently holds focus*, so every browser drops focus to
            <body>. That happens at the payoff stage, and the reader's next Tab
            restarts from the top of the page rather than continuing into the
            syndrome readout the last press just revealed. Keeping the element
            focusable with `aria-disabled` announces the same "dimmed,
            unavailable" state without moving focus; the handler no-ops and
            `aria-disabled:pointer-events-none` reproduces the
            dead-to-the-mouse behaviour. */}
        <button
          type="button"
          onClick={() => {
            if (stage === 0) return;
            handleBack();
          }}
          aria-disabled={stage === 0}
          className="min-h-11 rounded-(--radius-tight) border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted aria-disabled:pointer-events-none aria-disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => {
            if (stage === STAGE_LABELS.length - 1) return;
            handleAdvance();
          }}
          aria-disabled={stage === STAGE_LABELS.length - 1}
          className="min-h-11 rounded-(--radius-tight) border border-brand bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          Advance →
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="min-h-11 rounded-(--radius-tight) border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar"
        >
          Reset
        </button>
      </div>

      <div aria-live="polite" aria-atomic="true" className="rounded-panel border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
        {stageDescription[stage]}
      </div>

      {stage >= 2 && (
        <FigureReadouts
          columns={3}
          items={[
            { label: "Syndrome (s1,s2)", value: `(${result.syndrome[0]},${result.syndrome[1]})` },
            { label: "Diagnosed qubit", value: result.correctedQubit === null ? "none" : `q${result.correctedQubit}` },
            ...(stage >= 3 ? [{ label: "Fidelity after correction", value: fidelity.toFixed(4) }] : []),
          ]}
        />
      )}
    </div>
  );
}
