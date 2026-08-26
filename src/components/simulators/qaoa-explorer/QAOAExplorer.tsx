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

/** Bit `node` of `index`, reading qubit 0 as the most-significant bit — the same convention `qaoaCircuit`'s own basis ordering and every gate in this engine use. */
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
export function QAOAExplorer() {
  const [presetId, setPresetId] = useState(QAOA_GRAPH_PRESETS[1].id);
  const [gamma, setGamma] = useState(0.6);
  const [beta, setBeta] = useState(0.3);

  const preset = QAOA_GRAPH_PRESETS.find((p) => p.id === presetId) ?? QAOA_GRAPH_PRESETS[0];

  const state = useMemo(
    () => qaoaCircuit(preset.n, preset.edges, [gamma], [beta]),
    [preset, gamma, beta]
  );

  const expected = useMemo(() => expectedCutSize(state, preset.edges), [state, preset]);
  const trueMax = useMemo(() => bruteForceMaxCut(preset.n, preset.edges), [preset]);
  const ratio = trueMax > 0 ? expected / trueMax : 1;

  // Whether *some* (γ, β) at p=1 reaches the graph's true max-cut exactly —
  // a fixed property of the graph, not of the currently-dragged sliders.
  // Answered honestly via a real grid search over the same `qaoaCircuit` /
  // `expectedCutSize` this explorer already uses live, not a hardcoded
  // per-graph guess, so it stays correct if a preset is ever added or edited.
  const bestAchievableRatio = useMemo(() => {
    if (trueMax === 0) return 1;
    const GRID = 24;
    let best = 0;
    for (let gi = 0; gi < GRID; gi++) {
      const g = (gi / GRID) * 2 * Math.PI;
      for (let bi = 0; bi < GRID; bi++) {
        const b = (bi / GRID) * Math.PI;
        const s = qaoaCircuit(preset.n, preset.edges, [g], [b]);
        const cut = expectedCutSize(s, preset.edges);
        if (cut > best) best = cut;
      }
    }
    return best / trueMax;
  }, [preset, trueMax]);
  const reachesOptimumExactly = bestAchievableRatio >= 0.995;
  const ratioPercent = (ratio * 100).toFixed(1);
  const noticeText =
    ratio >= 0.995
      ? `Approximation ratio ${ratioPercent}% — this (γ, β) pair is matching the true optimum for ${preset.label}.`
      : `Approximation ratio ${ratioPercent}% — plateauing below the true optimum for ${preset.label}; sweep γ and β to see how high you can push it.`;

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
      label="Max-Cut QAOA — p=1"
      readout={<Readout label="Ratio" value={`${ratioPercent}%`} />}
      footnote="Next: this p=1 circuit is the same one grid-searched by hand in the QAOA lesson — here you're doing that search yourself."
      stageClassName="space-y-6"
      stage={
        <>
        {/* GraphDiagram (src/components/visualizations/) renders a fixed
            300px-wide SVG with no responsive className of its own — at a
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

        <div className="rounded-xl border border-pillar/25 bg-pillar/5 px-4 py-3 text-sm text-foreground">
          Most likely measured bitstring: |{mostLikelyIndex.toString(2).padStart(preset.n, "0")}⟩ at{" "}
          {(mostLikelyProbability * 100).toFixed(1)}% probability. Approximation ratio ⟨cut⟩ / true max ={" "}
          {(ratio * 100).toFixed(1)}%.
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-surface-muted/60 px-4 py-3">
          <KatexMath
            tex={`\\langle \\text{cut}\\rangle(\\gamma=${gamma.toFixed(2)},\\,\\beta=${beta.toFixed(2)}) = ${expected.toFixed(4)}, \\quad \\text{true max} = ${trueMax}`}
            display
          />
        </div>

        <div className="grid gap-3 rounded-xl border border-border bg-surface-muted/40 p-4 sm:grid-cols-2">
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
          question={`For ${preset.label}, is there any single (γ, β) at p=1 that reaches the graph's true max-cut exactly?`}
          options={[
            { id: "yes", label: "Yes — some (γ, β) reaches it" },
            { id: "no", label: "No — it plateaus below" },
          ]}
          outcomeId={reachesOptimumExactly ? "yes" : "no"}
        />

        <SimulatorFraming
          shows="QAOA uses two angles — γ (how hard to reward good cuts) and β (how much to mix) — to bias measurement toward high-quality graph cuts, without ever brute-forcing every partition."
          watchFor={noticeText}
          tryThis={
            <ul>
              <li>
                On the Triangle graph, sweep γ and β and try to push the approximation ratio above 90% — the
                true max for a triangle can never be perfectly reached with p=1, so notice where it plateaus.
              </li>
              <li>Switch to the 4-cycle and see whether the same (γ, β) that worked well on the triangle still performs well here.</li>
            </ul>
          }
        />
        </>
      }
      controls={
        <QAOAControls
          presetId={preset.id}
          onPresetChange={setPresetId}
          gamma={gamma}
          onGammaChange={setGamma}
          beta={beta}
          onBetaChange={setBeta}
        />
      }
    />
  );
}
