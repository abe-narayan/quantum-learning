import type { Wavefunction1D } from "@/lib/quantum/wavefunction";
import {
  probabilityLeftAndRightOf,
  probabilityInsideBarrier,
  probabilityNearGridEdges,
} from "@/lib/quantum/timeEvolution";

/**
 * The analytical-vs-numerical check this course's numerical engine is
 * built to support: for an eigenstate preset, compares the *numerically*
 * computed <H> = <T>+<V> (via the FFT-based kinetic energy and the
 * position-space potential integral) against the *closed-form* E_n
 * formula, plus a fidelity readout showing the evolving state hasn't
 * drifted from its initial (analytical) shape; i.e., that it's genuinely
 * behaving as a stationary state under the numerical time-evolution
 * engine, not merely initialized to look like one.
 */
export function ComparisonPanel({
  psi,
  psi0,
  potential,
  kineticEnergy,
  analyticalEnergy,
  boundary,
}: {
  psi: Wavefunction1D;
  psi0: Wavefunction1D;
  potential: readonly number[];
  /** Precomputed once per frame (see StatePanel's doc comment) rather than recomputed here via another FFT. */
  kineticEnergy: number;
  analyticalEnergy?: number;
  boundary?: number;
}) {
  if (analyticalEnergy === undefined && boundary === undefined) return null;

  if (boundary !== undefined) {
    const { left, right } = probabilityLeftAndRightOf(psi, boundary);
    /**
     * WHICH QUANTITY THESE TWO NUMBERS ACTUALLY ARE, AND WHEN.
     *
     * `probabilityLeftAndRightOf` reports where the packet *is*, which is
     * only the reflection and transmission probabilities once the collision
     * with the barrier is over. Before the packet arrives it is entirely to
     * the left of the barrier, and this panel labelled that "P(reflected) =
     * 1.0000" — a confident number for something that had not happened. At
     * the preset's own default parameters that covers most of the
     * instrument's automatic first playback: measured against the real
     * evolver, the transmitted fraction is still 0.0000 at frame 130 of 260
     * and only 0.0100 by frame 195. So it is the reading first contact gets,
     * not an edge case.
     *
     * The overlap with the barrier itself is what separates the three
     * phases, and the left/right split cannot: `probabilityInsideBarrier`
     * is nonzero exactly while the packet is straddling the barrier.
     * "Not arrived" is then "nothing inside the barrier and nothing past
     * it"; "settled" is "nothing inside the barrier, and some of it past".
     */
    const insideBarrier = probabilityInsideBarrier(psi, potential);
    const hasWrappedAround = probabilityNearGridEdges(psi) > 1e-3;
    const phase =
      insideBarrier > 1e-4 ? "crossing" : right > 1e-4 ? "settled" : "approaching";
    const settled = phase === "settled" && !hasWrappedAround;

    return (
      <div className="rounded-panel border border-border bg-surface-muted/60 p-4 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Transmission / reflection accounting</p>
        <dl className="mt-2 grid grid-cols-3 gap-3">
          <div>
            <dt className="text-xs text-muted-foreground">{settled ? "P(reflected)" : "P(left of barrier)"}</dt>
            <dd className="font-mono text-foreground">{left.toFixed(4)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{settled ? "P(transmitted)" : "P(right of barrier)"}</dt>
            <dd className="font-mono text-foreground">{right.toFixed(4)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Sum (should ≈ 1)</dt>
            <dd className="font-mono text-foreground">{(left + right).toFixed(4)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-muted-foreground">
          {hasWrappedAround
            ? "Part of the packet has reached the end of the simulation box and wrapped around to the far side, so this split no longer separates reflected from transmitted. Press Reset to run it again."
            : phase === "approaching"
              ? "The packet has not reached the barrier yet, so this is only where it currently sits. These become the reflection and transmission probabilities once it has finished crossing."
              : phase === "crossing"
                ? "The packet is straddling the barrier right now, so these are still settling. They become the reflection and transmission probabilities once none of it is left inside the barrier."
                : "The packet has finished crossing, so these are now the reflection and transmission probabilities."}
        </p>
      </div>
    );
  }

  const numericalEnergy = kineticEnergy + psi.expectationPotential(potential);
  const percentError = analyticalEnergy !== undefined && Math.abs(analyticalEnergy) > 1e-9
    ? (100 * Math.abs(numericalEnergy - analyticalEnergy)) / Math.abs(analyticalEnergy)
    : 0;
  // psi and psi0 are always built from the same grid in normal operation
  // (WavefunctionSimulation remounts fresh on every config change; see
  // its doc comment), but a mid-transition render is exactly the kind of
  // thing worth being defensive about here rather than crashing the whole
  // panel on a boundary case.
  const sameGrid = psi.grid.n === psi0.grid.n && Math.abs(psi.grid.dx - psi0.grid.dx) < 1e-12;
  const fidelity = sameGrid ? psi.overlapProbability(psi0) : null;

  return (
    <div className="rounded-panel border border-border bg-surface-muted/60 p-4 text-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Analytical vs. numerical</p>
      <dl className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <dt className="text-xs text-muted-foreground">Analytical Eₙ</dt>
          <dd className="font-mono text-foreground">{analyticalEnergy?.toFixed(4)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Numerical ⟨H⟩</dt>
          <dd className="font-mono text-foreground">{numericalEnergy.toFixed(4)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Error</dt>
          <dd className="font-mono text-foreground">{percentError.toFixed(3)}%</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Fidelity |⟨ψ(t)|ψ(0)⟩|²</dt>
          <dd className="font-mono text-foreground">{fidelity === null ? "n/a" : fidelity.toFixed(4)}</dd>
        </div>
      </dl>
    </div>
  );
}
