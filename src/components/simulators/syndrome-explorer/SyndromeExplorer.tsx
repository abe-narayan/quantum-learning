"use client";

import { useState } from "react";
import { Complex } from "@/lib/quantum/complex";
import {
  encodeBitFlipCode,
  encodePhaseFlipCode,
  applyBitFlipError,
  applyPhaseFlipError,
  runBitFlipCorrectionCycle,
  runPhaseFlipCorrectionCycle,
} from "@/lib/quantum/errorCorrection";
import { StateInspector } from "@/components/simulators/circuit-builder/StateInspector";
import { cn } from "@/lib/utils";

const ALPHA = new Complex(0.6);
const BETA = new Complex(0.8);

/**
 * Inject a real bit-flip (X) or phase-flip (Z) error on one of three
 * encoded qubits and watch the platform's actual `runBitFlipCorrectionCycle`
 * / `runPhaseFlipCorrectionCycle` extract the syndrome via genuine
 * ancilla CNOTs and partial measurement, decode it, and apply the
 * correction — the real 3-qubit repetition code, not a scripted
 * animation. Shares one component between both lessons via the `mode`
 * prop, since the phase-flip code is the bit-flip code conjugated by H
 * on every qubit (documented in `errorCorrection.ts`).
 */
export function SyndromeExplorer({ mode }: { mode: "bit-flip" | "phase-flip" }) {
  const [injected, setInjected] = useState<number | null>(null);

  const encoded = mode === "bit-flip" ? encodeBitFlipCode(ALPHA, BETA) : encodePhaseFlipCode(ALPHA, BETA);
  const applyError = mode === "bit-flip" ? applyBitFlipError : applyPhaseFlipError;
  const runCycle = mode === "bit-flip" ? runBitFlipCorrectionCycle : runPhaseFlipCorrectionCycle;
  const errored = injected === null ? encoded : applyError(encoded, injected);
  const result = runCycle(errored, [0.5, 0.5]);

  const errorLabel = mode === "bit-flip" ? "X" : "Z";

  return (
    <div className="not-prose grid gap-6 rounded-3xl border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
      <div className="space-y-6">
        <div aria-live="polite" className="rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
          {injected === null
            ? "No error injected. The encoded state is exactly the logical state, undisturbed."
            : `${errorLabel} error injected on qubit ${injected}. Syndrome (${result.syndrome[0]}, ${result.syndrome[1]}) decodes to ${
                result.correctedQubit === null ? "no error" : `qubit ${result.correctedQubit}`
              }.`}
        </div>
        <StateInspector state={result.corrected} />
      </div>

      <div className="space-y-6">
        <section aria-labelledby="syndrome-inject-heading">
          <h3 id="syndrome-inject-heading" className="text-sm font-semibold text-foreground">
            Inject a {errorLabel} error
          </h3>
          <div role="radiogroup" aria-label="Qubit to error" className="mt-3 flex flex-wrap gap-2">
            {([null, 0, 1, 2] as const).map((q) => (
              <button
                key={q ?? "none"}
                type="button"
                role="radio"
                aria-checked={injected === q}
                onClick={() => setInjected(q)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  injected === q
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border bg-surface text-muted-foreground hover:bg-surface-muted"
                )}
              >
                {q === null ? "None" : `Qubit ${q}`}
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="syndrome-readout-heading">
          <h3 id="syndrome-readout-heading" className="text-sm font-semibold text-foreground">
            Syndrome
          </h3>
          <p className="mt-1 font-mono text-sm text-foreground">
            ({result.syndrome[0]}, {result.syndrome[1]})
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Decoded correction:{" "}
            {result.correctedQubit === null ? "none needed" : `apply ${errorLabel} to qubit ${result.correctedQubit}`}
          </p>
        </section>
      </div>
    </div>
  );
}
