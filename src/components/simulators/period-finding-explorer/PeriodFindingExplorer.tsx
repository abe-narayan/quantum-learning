"use client";

import { useMemo, useState } from "react";
import { classicalOrder, periodFindingMeasurementDistribution } from "@/lib/quantum/shor";
import { BarChart } from "@/components/visualizations/BarChart";
import { KatexMath } from "@/components/ui/KatexMath";
import { PeriodFindingControls, coprimeBases } from "./PeriodFindingControls";
import { LabNotes } from "./LabNotes";

/**
 * A freely-explorable version of the period-finding circuit only ever shown
 * at one fixed (a=7, N=15) pair inside the Shor's-algorithm lessons: pick
 * any small composite N, any base a coprime to it, and any counting-qubit
 * count t, and see the real `periodFindingMeasurementDistribution(a, N, t)`
 * peak pattern, the real `classicalOrder(a, N)`, and how the two relate
 * (peaks at multiples of 2^t / r) for every combination, not just the one
 * lesson preset.
 */
export function PeriodFindingExplorer() {
  const [N, setN] = useState(15);
  const [a, setA] = useState(7);
  const [xBits, setXBits] = useState(6);

  const validBases = useMemo(() => coprimeBases(N), [N]);
  const effectiveA = validBases.includes(a) ? a : validBases[0];

  function handleNChange(newN: number) {
    setN(newN);
    const newBases = coprimeBases(newN);
    setA((current) => (newBases.includes(current) ? current : newBases[0]));
  }

  const order = useMemo(() => classicalOrder(effectiveA, N), [effectiveA, N]);
  const distribution = useMemo(
    () => periodFindingMeasurementDistribution(effectiveA, N, xBits),
    [effectiveA, N, xBits]
  );

  const dimension = 2 ** xBits;
  const spacing = dimension / order;
  const spacingIsExact = Number.isInteger(spacing);
  const peakCount = distribution.filter((p) => p > 1e-9).length;

  const bars = distribution.map((value, k) => ({
    label: String(k),
    value,
    highlight: value > 1e-9,
    caption: value > 1e-9 ? value.toFixed(3) : undefined,
  }));

  return (
    <div className="not-prose grid gap-6 rounded-3xl border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
      <div className="space-y-6">
        <div className="rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
          a = {effectiveA}, N = {N}: classical order r = {order}
          {spacingIsExact
            ? `, so the ${peakCount} peaks below land exactly on multiples of 2^${xBits}/${order} = ${spacing}.`
            : `. 2^${xBits}/${order} = ${spacing.toFixed(2)} isn't a whole number, so the peaks below smear across roughly 2r nearby outcomes instead of landing exactly on r sharp ones.`}
        </div>

        <BarChart
          bars={bars}
          ariaLabel={`Measurement probability distribution over the ${dimension} counting-register outcomes for a=${effectiveA}, N=${N}, t=${xBits} counting qubits`}
          maxValue={Math.max(0.05, ...distribution)}
          height={220}
        />

        <div className="overflow-x-auto rounded-xl border border-border bg-surface-muted/60 px-4 py-3">
          <KatexMath
            tex={`r = ${order}, \\quad \\frac{2^{${xBits}}}{r} = ${Number.isInteger(spacing) ? spacing : spacing.toFixed(2)}`}
            display
          />
        </div>

        <LabNotes
          notes={[
            {
              label: "What we're studying",
              content:
                "This is the actual quantum subroutine behind Shor's algorithm — measuring reveals a distribution whose peak spacing exposes the hidden period r, without ever computing r directly.",
            },
            {
              label: "Try this",
              content: (
                <ul className="list-disc space-y-1 pl-4">
                  <li>
                    Fix N=15, a=7 (the lesson&apos;s example) and increase counting qubits from 4 to 8 — watch the
                    smeared peaks sharpen into exact ones as 2^t/r becomes closer to an integer.
                  </li>
                  <li>Try N=21 with a few different coprime bases and compare how many distinct peaks appear each time.</li>
                </ul>
              ),
            },
            {
              label: "What's next",
              content:
                "Next: this distribution is what Shor's algorithm classically post-processes (continued fractions) to recover r — see that step worked through in the lesson.",
            },
          ]}
        />
      </div>

      <PeriodFindingControls
        N={N}
        onNChange={handleNChange}
        a={effectiveA}
        onAChange={setA}
        validBases={validBases}
        xBits={xBits}
        onXBitsChange={setXBits}
      />
    </div>
  );
}
