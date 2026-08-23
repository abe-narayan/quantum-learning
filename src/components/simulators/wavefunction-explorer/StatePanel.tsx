import type { Wavefunction1D } from "@/lib/quantum/wavefunction";

/**
 * Live numeric readouts, computed directly from the current numerical state
 * — never hand-waved or interpolated. `meanMomentum`/`energy` are passed in
 * (computed once per frame in WavefunctionSimulation via momentumStatistics)
 * rather than recomputed here — each depends on a momentum-space Fourier
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
    <dl className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-surface-muted/60 p-4 text-sm sm:grid-cols-5">
      <div>
        <dt className="text-xs text-muted-foreground">Time t</dt>
        <dd className="font-mono text-foreground">{t.toFixed(2)}</dd>
      </div>
      <div>
        <dt className="text-xs text-muted-foreground">Norm ‖ψ‖</dt>
        <dd className="font-mono text-foreground">{norm.toFixed(4)}</dd>
      </div>
      <div>
        <dt className="text-xs text-muted-foreground">⟨x⟩</dt>
        <dd className="font-mono text-foreground">{meanX.toFixed(3)}</dd>
      </div>
      <div>
        <dt className="text-xs text-muted-foreground">⟨p⟩</dt>
        <dd className="font-mono text-foreground">{meanMomentum.toFixed(3)}</dd>
      </div>
      <div>
        <dt className="text-xs text-muted-foreground">⟨H⟩ (energy)</dt>
        <dd className="font-mono text-foreground">{energy.toFixed(4)}</dd>
      </div>
    </dl>
  );
}
