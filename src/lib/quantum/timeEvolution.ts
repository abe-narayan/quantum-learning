import { Complex } from "./complex";
import { fft, ifft, momentumGrid } from "./fourier";
import type { Grid1D } from "./wavefunction";
import { Wavefunction1D } from "./wavefunction";

/**
 * Time evolution under i*dpsi/dt = H*psi = (-1/(2m) d^2/dx^2 + V(x)) psi
 * (hbar = 1), via the split-operator Fourier method (Feit-Fleck-Steiger):
 * for a small time step dt, approximate exp(-i*H*dt) with the symmetric
 * ("Strang") splitting
 *
 *   exp(-i*V*dt/2) -> FFT -> exp(-i*k^2*dt/(2m)) -> IFFT -> exp(-i*V*dt/2)
 *
 * which is exact as dt -> 0 and second-order accurate in dt (the leading
 * error comes from V and the kinetic operator not commuting, not from the
 * FFT, which is exact). Crucially, every one of the three factors is a
 * pure phase (multiplication by a unit-modulus complex number, pointwise
 * or via a unitary FFT) — so the method is *unconditionally norm-preserving*
 * regardless of how large dt is, even though large dt does hurt physical
 * accuracy. That split (norm exactly preserved; energy/shape only
 * approximately preserved, better for smaller dt) is directly tested in
 * timeEvolution.test.ts and is what "no runaway animation" and "correct at
 * small enough dt" both come down to.
 *
 * Implementation note: the two FFT calls here deliberately use the *raw*
 * fft()/ifft() pair (not the dx/sqrt(2*pi)-normalized `positionToMomentum`)
 * — the physical normalization constant is a fixed scalar that cancels
 * exactly across a transform-multiply-inverse-transform round trip (worked
 * out in the module comment of fourier.ts's physics wrappers), so applying
 * the kinetic phase to the raw FFT output and taking the raw IFFT gives an
 * answer bit-identical to doing the fully-normalized round trip, for less
 * arithmetic.
 */
export class SplitOperatorEvolver {
  readonly grid: Grid1D;
  readonly potential: readonly number[];
  readonly dt: number;
  readonly mass: number;

  private readonly kineticPhase: Complex[];
  private readonly potentialHalfPhase: Complex[];

  constructor(grid: Grid1D, potential: readonly number[], dt: number, mass = 1) {
    if (potential.length !== grid.n) {
      throw new Error(`potential must have grid.n (${grid.n}) entries, got ${potential.length}.`);
    }
    if (!(dt > 0)) {
      throw new Error(`dt must be positive, got ${dt}.`);
    }
    if (!(mass > 0)) {
      throw new Error(`mass must be positive, got ${mass}.`);
    }

    this.grid = grid;
    this.potential = potential;
    this.dt = dt;
    this.mass = mass;

    const { k } = momentumGrid(grid.n, grid.dx);
    this.kineticPhase = k.map((kValue) => Complex.fromPolar(1, (-dt * kValue * kValue) / (2 * mass)));
    this.potentialHalfPhase = potential.map((v) => Complex.fromPolar(1, (-dt * v) / 2));
  }

  /** One symmetric split-operator step, advancing psi forward by `dt`. */
  step(psi: Wavefunction1D): Wavefunction1D {
    if (psi.grid.n !== this.grid.n || Math.abs(psi.grid.dx - this.grid.dx) > 1e-12) {
      throw new Error("Wavefunction grid does not match this evolver's grid.");
    }
    const half1 = psi.amplitudes.map((a, i) => a.mul(this.potentialHalfPhase[i]));
    const momentumSpace = fft(half1).map((a, i) => a.mul(this.kineticPhase[i]));
    const afterKinetic = ifft(momentumSpace);
    const half2 = afterKinetic.map((a, i) => a.mul(this.potentialHalfPhase[i]));
    return new Wavefunction1D(psi.grid, half2);
  }

  /** Advances psi forward by `steps * dt`, applying `step` repeatedly. */
  stepMultiple(psi: Wavefunction1D, steps: number): Wavefunction1D {
    let current = psi;
    for (let i = 0; i < steps; i++) current = this.step(current);
    return current;
  }
}

/**
 * Splits total probability at time t into the fraction to the left and
 * right of `boundary` — used for the tunneling demonstration's
 * transmission/reflection accounting (P_trans + P_refl should sum to
 * ~1, confirming probability isn't created or destroyed by the barrier).
 */
export function probabilityLeftAndRightOf(psi: Wavefunction1D, boundary: number): { left: number; right: number } {
  const density = psi.probabilityDensity();
  let left = 0;
  let right = 0;
  for (let i = 0; i < psi.grid.n; i++) {
    const contribution = density[i] * psi.grid.dx;
    if (psi.grid.x[i] < boundary) left += contribution;
    else right += contribution;
  }
  return { left, right };
}
