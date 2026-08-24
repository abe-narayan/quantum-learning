"use client";

import { useMemo, useState } from "react";
import { qaoaCircuit, expectedCutSize, bruteForceMaxCut } from "@/lib/quantum/qaoa";
import { GraphDiagram, type GraphNode, type GraphEdge } from "@/components/visualizations/GraphDiagram";
import { KatexMath } from "@/components/ui/KatexMath";
import { QAOAControls } from "./QAOAControls";
import { QAOA_GRAPH_PRESETS } from "./presets";

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
    <div className="not-prose grid gap-6 rounded-3xl border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
      <div className="space-y-6">
        <GraphDiagram
          nodes={nodes}
          edges={edges}
          ariaLabel={`${preset.label} colored by the most likely measurement outcome |${mostLikelyIndex
            .toString(2)
            .padStart(preset.n, "0")}⟩ at probability ${(mostLikelyProbability * 100).toFixed(0)}%, with cut edges dashed`}
        />

        <div className="rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
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
            <p className="mt-1 font-mono text-lg text-brand">{expected.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Brute-force optimum</p>
            <p className="mt-1 font-mono text-lg text-accent">{trueMax}</p>
          </div>
        </div>
      </div>

      <QAOAControls
        presetId={preset.id}
        onPresetChange={setPresetId}
        gamma={gamma}
        onGammaChange={setGamma}
        beta={beta}
        onBetaChange={setBeta}
      />
    </div>
  );
}
