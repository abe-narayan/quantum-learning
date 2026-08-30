import type { Wavefunction1D } from "@/lib/quantum/wavefunction";

/**
 * Live numeric readouts, computed directly from the current numerical state,
 * never hand-waved or interpolated. `meanMomentum`/`energy` are passed in
 * (computed once per frame in WavefunctionSimulation via momentumStatistics)
 * rather than recomputed here; each depends on a momentum-space Fourier
 * transform, and recomputing it separately per displaying component was a
 * real, measured cost in the animation loop.
 */
export function StatePanel({
  psi,
  t,
  meanMomentum,
  energy,
}: {
  psi: Wavefunction1D;
  t: number;
  meanMomentum: number;
  energy: number;
}) {
  const norm = psi.norm();
  const meanX = psi.expectationPosition();

  return (
    <div className="rounded-panel border border-border bg-surface-muted/60 p-4">
      <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
        <div>
          <dt className="text-xs text-muted-foreground">Time t</dt>
          <dd className="font-mono text-foreground">{t.toFixed(2)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Norm ‖ψ‖</dt>
          <dd className="font-mono text-foreground">{norm.toFixed(4)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">⟨x⟩ (position)</dt>
          <dd className="font-mono text-foreground">{meanX.toFixed(3)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">⟨p⟩ (momentum)</dt>
          <dd className="font-mono text-foreground">{meanMomentum.toFixed(3)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">⟨H⟩ (energy)</dt>
          <dd className="font-mono text-foreground">{energy.toFixed(4)}</dd>
        </div>
      </dl>
      {/* Five bare numbers with no units. Every quantity on this bench is
          computed in the natural units the presets are built in (ħ = m = 1,
          set in `presets.ts` and in `momentumStatistics(1)`), so none of these
          is in metres or joules and none of them should be read as though it
          were. Saying so once, under the row, is the difference between a
          readout a student can check by hand and five unlabelled figures.
          Norm is the exception: it is a pure number by definition, and it holds
          at 1 because the split-operator method is unitary step for step (see
          `lib/quantum/timeEvolution.ts`), so it is the integrator's own health
          check rather than a physical reading. Deliberately not claiming norm
          drift signals the packet reaching the box edge: that wrap is periodic
          and norm-preserving, and the narration above `StatePanel` is what
          catches it. */}
      <p className="mt-3 text-xs text-muted-foreground">
        Natural units throughout: ħ = m = 1, so t, x, p and energy carry no units of their own. Norm is a
        pure number and stays at 1.0000: the solver conserves it exactly, so a reading that drifts would
        mean an arithmetic fault, not physics.
      </p>
    </div>
  );
}
