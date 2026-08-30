"use client";

import { useMemo, useState } from "react";
import { qaoaCircuit, expectedCutSize, bruteForceMaxCut } from "@/lib/quantum/qaoa";
import { GraphDiagram, type GraphNode, type GraphEdge } from "@/components/visualizations/GraphDiagram";
import { KatexMath } from "@/components/ui/KatexMath";
import { QAOAControls } from "./QAOAControls";
import { QAOA_GRAPH_PRESETS } from "./presets";
import { Readout } from "@/components/ui/Typography";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";
import { SimulatorFraming } from "../shared/Framing";
import { Predict } from "../shared/Predict";

/** Bit `node` of `index`, reading qubit 0 as the most-significant bit, the same convention `qaoaCircuit`'s own basis ordering and every gate in this engine use. */
function bitAt(index: number, totalQubits: number, node: number): number {
  return (index >> (totalQubits - 1 - node)) & 1;
}

/**
 * A freely-explorable Max-Cut QAOA tool, generalizing the QAOA lessons'
 * single fixed-graph, grid-searched-parameters worked examples into
 * something you can drag γ and β through yourself, on any of a few small
 * preset graphs, and watch the real `expectedCutSize` track (or miss) the
 * real `bruteForceMaxCut` optimum live.
 */
const DEFAULT_PRESET_ID = QAOA_GRAPH_PRESETS[1].id;
const DEFAULT_GAMMA = 0.6;
const DEFAULT_BETA = 0.3;

export function QAOAExplorer() {
  const [presetId, setPresetId] = useState(DEFAULT_PRESET_ID);
  const [gamma, setGamma] = useState(DEFAULT_GAMMA);
  const [beta, setBeta] = useState(DEFAULT_BETA);
  /**
   * Whether the reader has swept γ or β on the current graph.
   *
   * The prediction below asks whether *any* (γ, β) reaches this graph's true
   * max-cut, a fixed fact about the graph, which `bestAchievableRatio` knows
   * from a grid search before the reader touches anything. Feeding that answer
   * straight to `Predict` meant the panel graded the guess in the same instant
   * it was made: a "predict first" control that answered itself, with no run
   * in between and no reason to move a slider. Withholding the verdict until
   * the reader has actually swept restores the loop the panel is named for.
   */
  const [hasSweptAngles, setHasSweptAngles] = useState(false);

  function handlePresetChange(id: string) {
    setPresetId(id);
    // A new graph is a new question (`Predict` is remounted via `key`), so the
    // sweep has to start over too; otherwise the second graph's answer would
    // be revealed immediately on the strength of sweeping the first one.
    setHasSweptAngles(false);
  }

  function handleGammaChange(v: number) {
    setGamma(v);
    setHasSweptAngles(true);
  }

  function handleBetaChange(v: number) {
    setBeta(v);
    setHasSweptAngles(true);
  }

  function handleReset() {
    setPresetId(DEFAULT_PRESET_ID);
    setGamma(DEFAULT_GAMMA);
    setBeta(DEFAULT_BETA);
    setHasSweptAngles(false);
  }

  const preset = QAOA_GRAPH_PRESETS.find((p) => p.id === presetId) ?? QAOA_GRAPH_PRESETS[0];

  const state = useMemo(
    () => qaoaCircuit(preset.n, preset.edges, [gamma], [beta]),
    [preset, gamma, beta]
  );

  const expected = useMemo(() => expectedCutSize(state, preset.edges), [state, preset]);
  const trueMax = useMemo(() => bruteForceMaxCut(preset.n, preset.edges), [preset]);
  const ratio = trueMax > 0 ? expected / trueMax : 1;

  /**
   * Whether *some* (γ, β) at p=1 reaches the graph's true max-cut exactly: a
   * fixed property of the graph, not of the currently-dragged sliders. Real
   * search over the same `qaoaCircuit` / `expectedCutSize` this explorer runs
   * live, so it stays correct if a preset is ever added or edited.
   *
   * COARSE SEARCH ALONE WAS WRONG, AND WRONG ON THE DEFAULT GRAPH.
   *
   * This was a bare 24×24 grid. Its spacing is 2π/24 = 0.262 in γ and π/24 =
   * 0.131 in β, and on the Triangle (the preset this explorer opens on) the
   * optimum sits at γ ≈ 2.5261, β ≈ 1.2631, between nodes. Measured against the
   * engine: the 24×24 grid's best was 1.96875 of a true max of 2, i.e. 98.44%,
   * under the 99.5% threshold below, so the prediction panel answered "No, it
   * plateaus below". Meanwhile the instrument's own opening parameters
   * (γ = 0.6, β = 0.3) give 1.99905, and the notice line a few rows down calls
   * that "matching the true optimum". The panel graded the reader wrong against
   * a number the same screen was already showing them.
   *
   * Refining from the coarse best fixes it, because the coarse grid does land
   * in the right basin even when it misses the peak. Three shrinking passes of
   * 13×13 recover 2.000000000 on the Triangle and 1.000000000 on the single
   * edge, both exactly the brute-force max, while the 4-cycle stays pinned at
   * 3 of 4 (75%): that one really is a "No", and p=1 QAOA really cannot close
   * it. Denser uniform grids do not do this: 48×48 reaches only 99.69% on the
   * Triangle and 96×96 only 99.89%, so the fix is refinement, not resolution.
   * Cost is 576 + 3 × 169 = 1083 circuit evaluations on at most 4 qubits, below
   * the 576-plus-nothing it replaces by less than a factor of two, and it runs
   * once per graph rather than per drag.
   */
  const bestAchievableRatio = useMemo(() => {
    if (trueMax === 0) return 1;
    const evaluate = (g: number, b: number) => expectedCutSize(qaoaCircuit(preset.n, preset.edges, [g], [b]), preset.edges);

    const COARSE = 24;
    let best = 0;
    let bestGamma = 0;
    let bestBeta = 0;
    for (let gi = 0; gi < COARSE; gi++) {
      for (let bi = 0; bi < COARSE; bi++) {
        const g = (gi / COARSE) * 2 * Math.PI;
        const b = (bi / COARSE) * Math.PI;
        const cut = evaluate(g, b);
        if (cut > best) {
          best = cut;
          bestGamma = g;
          bestBeta = b;
        }
      }
    }

    // Zoom in on the coarse winner, one cell wide, then a third of that, then
    // a ninth. Half a coarse cell in each axis is the widest the true peak can
    // be from the node that beat every other node.
    const STEPS = 12;
    let gammaSpan = Math.PI / COARSE;
    let betaSpan = Math.PI / (2 * COARSE);
    for (let pass = 0; pass < 3; pass++) {
      // Centres are snapshotted for the whole pass, so the sampled window is a
      // fixed box around the previous winner rather than one that slides as
      // the scan runs.
      const centreGamma = bestGamma;
      const centreBeta = bestBeta;
      for (let gi = 0; gi <= STEPS; gi++) {
        for (let bi = 0; bi <= STEPS; bi++) {
          const g = centreGamma - gammaSpan + (2 * gammaSpan * gi) / STEPS;
          const b = centreBeta - betaSpan + (2 * betaSpan * bi) / STEPS;
          const cut = evaluate(g, b);
          if (cut > best) {
            best = cut;
            bestGamma = g;
            bestBeta = b;
          }
        }
      }
      gammaSpan /= 3;
      betaSpan /= 3;
    }

    return best / trueMax;
  }, [preset, trueMax]);
  const reachesOptimumExactly = bestAchievableRatio >= 0.995;
  const ratioPercent = (ratio * 100).toFixed(1);
  const noticeText =
    ratio >= 0.995
      ? `Approximation ratio ${ratioPercent}%: this (γ, β) pair is matching the true optimum for ${preset.label}.`
      : `Approximation ratio ${ratioPercent}%, plateauing below the true optimum for ${preset.label}; sweep γ and β to see how high you can push it.`;

  const mostLikelyIndex = useMemo(() => {
    const probs = state.probabilities();
    let best = 0;
    for (let i = 1; i < probs.length; i++) if (probs[i] > probs[best]) best = i;
    return best;
  }, [state]);
  const mostLikelyProbability = state.probabilities()[mostLikelyIndex];

  const nodes: GraphNode[] = preset.positions.map((pos, i) => ({
    id: String(i),
    x: pos.x,
    y: pos.y,
    group: bitAt(mostLikelyIndex, preset.n, i) as 0 | 1,
  }));

  const edges: GraphEdge[] = preset.edges.map(([i, j]) => ({
    from: String(i),
    to: String(j),
    cut: bitAt(mostLikelyIndex, preset.n, i) !== bitAt(mostLikelyIndex, preset.n, j),
  }));

  return (
    <SimulatorInstrument
      label="Max-Cut QAOA: p=1"
      readout={<Readout label="Ratio" value={`${ratioPercent}%`} />}
      footnote="Next: this p=1 circuit is the same one grid-searched by hand in the QAOA lesson; here you're doing that search yourself."
      stageClassName="space-y-6"
      stage={
        <>
        {/* GraphDiagram (src/components/visualizations/) renders a fixed
            300px-wide SVG with no responsive className of its own, so at a
            320px viewport, after this instrument's own padding, the stage
            has less room than that. `overflow-x-auto` contains the overflow
            to this figure instead of the page, the same degrade pattern
            already used for the circuit diagram and state-vector tables
            elsewhere in these simulators. */}
        <div className="overflow-x-auto">
          <GraphDiagram
            nodes={nodes}
            edges={edges}
            ariaLabel={`${preset.label} colored by the most likely measurement outcome |${mostLikelyIndex
              .toString(2)
              .padStart(preset.n, "0")}⟩ at probability ${(mostLikelyProbability * 100).toFixed(0)}%, with cut edges dashed`}
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Max-Cut: split the dots into two groups so that as many lines as possible run <em>between</em> the
          groups rather than inside one. Those crossing lines are dashed above; the count is the
          &ldquo;cut&rdquo;. Checking every possible split gets hopeless fast, so QAOA instead tunes two
          angles until measuring the circuit tends to hand you a good split.
        </p>

        <div
          aria-live="polite"
          className="rounded-panel border border-pillar/25 bg-pillar/5 px-4 py-3 text-sm text-foreground"
        >
          The split shown above is the one this circuit is most likely to hand you: bitstring |
          {mostLikelyIndex.toString(2).padStart(preset.n, "0")}⟩, at {(mostLikelyProbability * 100).toFixed(1)}%.
          On average it cuts {expected.toFixed(2)} of the {trueMax} edges the best possible split cuts, so
          you are at {(ratio * 100).toFixed(1)}% of optimal.
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
            tex={`\\langle \\text{cut}\\rangle(\\gamma=${gamma.toFixed(2)},\\,\\beta=${beta.toFixed(2)}) = ${expected.toFixed(4)}, \\quad \\text{true max} = ${trueMax}`}
            display
          />
        </div>

        <div className="grid gap-3 rounded-panel border border-border bg-surface-muted/40 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Expected cut ⟨C⟩</p>
            <p className="mt-1 font-mono text-lg text-pillar">{expected.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Brute-force optimum</p>
            <p className="mt-1 font-mono text-lg text-accent">{trueMax}</p>
          </div>
        </div>

        <Predict
          key={preset.id}
          question={`For ${preset.label}, is there any single (γ, β) at p=1 that reaches the graph's true max-cut exactly? Guess, then sweep both sliders to check.`}
          options={[
            { id: "yes", label: "Yes, some (γ, β) reaches it" },
            { id: "no", label: "No, it plateaus below" },
          ]}
          outcomeId={hasSweptAngles ? (reachesOptimumExactly ? "yes" : "no") : null}
        />

        {/* The triangle bullet below used to claim "the true max for a triangle
            can never be perfectly reached with p=1". It can: refining the
            search against this file's own `qaoaCircuit` and `expectedCutSize`
            finds an expected cut of 2.000000000 against a brute-force max of 2,
            at gamma about 2.526 and beta about 1.263. The graph that genuinely
            plateaus is the 4-cycle, which stops at 3 of 4 however you sweep it,
            so the "you cannot always close the gap" lesson moves there, where it
            is true. */}
        <SimulatorFraming
          shows="QAOA uses two angles, γ (how hard to reward good cuts) and β (how much to mix), to bias measurement toward high-quality graph cuts, without ever brute-forcing every partition."
          watchFor={noticeText}
          tryThis={
            <ul>
              <li>
                On the Triangle graph, sweep γ and β and try to push the approximation ratio to a full 100%.
                It can be done: there is a (γ, β) that cuts every edge a best split cuts, and finding it by
                hand is the whole job a real QAOA optimizer automates.
              </li>
              <li>
                Now switch to the 4-cycle and try the same thing. This one stops at 75% no matter where you
                put the sliders. One layer of QAOA is not enough for every graph, which is why real runs
                stack more.
              </li>
            </ul>
          }
        />
        </>
      }
      controls={
        <QAOAControls
          presetId={preset.id}
          onPresetChange={handlePresetChange}
          gamma={gamma}
          onGammaChange={handleGammaChange}
          beta={beta}
          onBetaChange={handleBetaChange}
          onReset={handleReset}
        />
      }
    />
  );
}
