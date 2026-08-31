"use client";

import { useMemo, useState } from "react";
import { classicalOrder, periodFindingMeasurementDistribution } from "@/lib/quantum/shor";
import { BarChart } from "@/components/visualizations/BarChart";
import { KatexMath } from "@/components/ui/KatexMath";
import { PeriodFindingControls, coprimeBases } from "./PeriodFindingControls";
import { Readout } from "@/components/ui/Typography";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";
import { SimulatorFraming } from "../shared/Framing";

/**
 * A freely-explorable version of the period-finding circuit only ever shown
 * at one fixed (a=7, N=15) pair inside the Shor's-algorithm lessons: pick
 * any small composite N, any base a coprime to it, and any counting-qubit
 * count t, and see the real `periodFindingMeasurementDistribution(a, N, t)`
 * peak pattern, the real `classicalOrder(a, N)`, and how the two relate
 * (peaks at multiples of 2^t / r) for every combination, not just the one
 * lesson preset.
 */
const DEFAULT_N = 15;
const DEFAULT_A = 7;
const DEFAULT_X_BITS = 6;

export function PeriodFindingExplorer() {
  const [N, setN] = useState(DEFAULT_N);
  const [a, setA] = useState(DEFAULT_A);
  const [xBits, setXBits] = useState(DEFAULT_X_BITS);

  function handleReset() {
    setN(DEFAULT_N);
    setA(DEFAULT_A);
    setXBits(DEFAULT_X_BITS);
  }

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
    <SimulatorInstrument
      label="Period finding: Shor&rsquo;s subroutine"
      readout={<Readout label="r" hint="how often the pattern repeats" value={order} />}
      footnote="Next: this distribution is what Shor's algorithm classically post-processes (continued fractions) to recover r; see that step worked through in the lesson."
      // Up to 2^7 = 128 bars at the highest counting-qubit count; splitting
      // against a 320px rail leaves each bar too thin to read even when the
      // container query says there's technically room. Full-width stage.
      layout="stacked"
      stageClassName="space-y-6"
      stage={
        <>
          {/* Trimmed: the Shor's-algorithm framing now lives once, in
              `SimulatorFraming`'s "What this shows" below and the footnote,
              instead of three times across this paragraph, that block and the
              footnote. What only this paragraph defines, and keeps, is r
              itself, which the readout above names but does not define. */}
          <p className="text-sm text-muted-foreground">
            Factoring a big number is hard, but finding how often a repeating pattern repeats is not, and the
            two turn out to be the same problem. Multiply a by itself, always keeping the remainder mod N,
            and the answers eventually loop: how long that loop is, is r.
          </p>

          <div
            aria-live="polite"
            className="rounded-panel border border-pillar/25 bg-pillar/5 px-4 py-3 text-sm text-foreground"
          >
            With a = {effectiveA} and N = {N}, the pattern repeats every r = {order} steps
            {spacingIsExact
              ? `, so the ${peakCount} peaks below land exactly on multiples of 2^${xBits}/${order} = ${spacing}.`
              : `. 2^${xBits}/${order} = ${spacing.toFixed(2)} isn't a whole number, so the peaks below smear across roughly 2r nearby outcomes instead of landing exactly on r sharp ones.`}
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              What you&rsquo;d actually measure: one bar per possible readout, its height the chance of
              getting it. The spacing between the tall bars is what encodes r.
            </p>
            <BarChart
              bars={bars}
              ariaLabel={`Measurement probability distribution over the ${dimension} counting-register outcomes for a=${effectiveA}, N=${N}, t=${xBits} counting qubits`}
              maxValue={Math.max(0.05, ...distribution)}
              height={220}
            />
          </div>
        </>
      }
      stageAfter={
        <>
          {/* No `overflow-x-auto` here: the only child is a block-level
              `.katex-display`, which fills this content box and carries its own
              horizontal scroll (globals.css §6), so this box never had anything to
              scroll, and `overflow-x: auto` with `overflow-y: visible` computes the
              y axis to `auto` too, which would silently clip a tall equation. The tab
              stop the slab needs now lives on `.katex-display` itself; see
              `focusableDisplayHtml` in src/components/ui/KatexMath.tsx. */}
          <div className="rounded-panel border border-border bg-surface-muted/60 px-4 py-3">
            <KatexMath
              tex={`r = ${order}, \\quad \\frac{2^{${xBits}}}{r} = ${Number.isInteger(spacing) ? spacing : spacing.toFixed(2)}`}
              display
            />
          </div>

          <SimulatorFraming
            shows="This is the actual quantum subroutine behind Shor's algorithm: measuring reveals a distribution whose peak spacing exposes the hidden period r, without ever computing r directly."
            watchFor="Nothing here ever computes r and then draws peaks around it. The peaks come out of the circuit; r is what you read back off their spacing. That inversion is the entire trick."
            tryThis={
              <ul>
                <li>
                  Fix N=21, a=2 (see the smearing demo in the main lesson) and increase counting qubits from 4 to
                  7, and watch the smeared peaks sharpen as 2^t/r gets closer to an integer.
                </li>
                <li>Try N=21 with a few different coprime bases and compare how many distinct peaks appear each time.</li>
              </ul>
            }
          />
        </>
      }
      controls={
        <PeriodFindingControls
          N={N}
          onNChange={handleNChange}
          a={effectiveA}
          onAChange={setA}
          validBases={validBases}
          xBits={xBits}
          onXBitsChange={setXBits}
          onReset={handleReset}
        />
      }
    />
  );
}
