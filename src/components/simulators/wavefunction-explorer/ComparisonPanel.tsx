import type { Wavefunction1D } from "@/lib/quantum/wavefunction";
import { probabilityLeftAndRightOf } from "@/lib/quantum/timeEvolution";

/**
 * The analytical-vs-numerical check this course's numerical engine is
 * built to support: for an eigenstate preset, compares the *numerically*
 * computed <H> = <T>+<V> (via the FFT-based kinetic energy and the
 * position-space potential integral) against the *closed-form* E_n
 * formula, plus a fidelity readout showing the evolving state hasn't
 * drifted from its initial (analytical) shape — i.e., that it's genuinely
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
    return (
      <div className="rounded-panel border border-border bg-surface-muted/60 p-4 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Transmission / reflection accounting</p>
        <dl className="mt-2 grid grid-cols-3 gap-3">
          <div>
            <dt className="text-xs text-muted-foreground">P(reflected)</dt>
            <dd className="font-mono text-foreground">{left.toFixed(4)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">P(transmitted)</dt>
            <dd className="font-mono text-foreground">{right.toFixed(4)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Sum (should ≈ 1)</dt>
            <dd className="font-mono text-foreground">{(left + right).toFixed(4)}</dd>
          </div>
        </dl>
      </div>
    );
  }

  const numericalEnergy = kineticEnergy + psi.expectationPotential(potential);
  const percentError = analyticalEnergy !== undefined && Math.abs(analyticalEnergy) > 1e-9
    ? (100 * Math.abs(numericalEnergy - analyticalEnergy)) / Math.abs(analyticalEnergy)
    : 0;
  // psi and psi0 are always built from the same grid in normal operation
  // (WavefunctionSimulation remounts fresh on every config change — see
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
          <dd className="font-mono text-foreground">{fidelity === null ? "—" : fidelity.toFixed(4)}</dd>
        </div>
      </dl>
    </div>
  );
}
