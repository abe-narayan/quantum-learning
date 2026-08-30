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
 * — everything those wrappers add (the dx/sqrt(2*pi) scalar and the
 * centered-grid (-1)^m signs alike) is applied per momentum bin and then
 * undone in the same bin on the way back, and the kinetic factor in between
 * is itself diagonal in those bins, so all of it cancels exactly across a
 * transform-multiply-inverse-transform round trip. Applying the kinetic
 * phase to the raw FFT output and taking the raw IFFT therefore gives an
 * answer identical to doing the fully-normalized round trip, for less
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

/**
 * The probability mass sitting within `edgeFraction` of either end of the
 * grid.
 *
 * The split-operator method's FFT makes the box periodic: a packet that
 * reaches an edge does not leave, it re-enters from the far side. Norm is
 * still exactly preserved (this is a unitary method, and stays one), but
 * every *position-space* quantity computed afterwards stops describing one
 * packet. Measured on the Wavefunction Explorer's own free-particle preset
 * at the ends of its sliders (centre 0, momentum 6), the wrap happens inside
 * the instrument's automatic first playback: ⟨x⟩ jumps from +52.75 to
 * -50.93, running backwards under a positive momentum in flat violation of
 * Ehrenfest's d⟨x⟩/dt = ⟨p⟩/m, and the reported width spikes to 15x its
 * starting value and then falls back. This is the check that lets a display
 * notice and say so, instead of narrating a wrap-around as physical
 * spreading.
 */
export function probabilityNearGridEdges(psi: Wavefunction1D, edgeFraction = 0.04): number {
  const margin = psi.grid.length * edgeFraction;
  const leftEdge = psi.grid.x[0] + margin;
  const rightEdge = psi.grid.x[psi.grid.n - 1] - margin;
  return probabilityWhere(psi, (i) => psi.grid.x[i] <= leftEdge || psi.grid.x[i] >= rightEdge);
}

/**
 * The probability mass sitting where the potential is nonzero — for the
 * tunneling setup, the packet's current overlap with the barrier. This is
 * what distinguishes "the packet has not reached the barrier yet" from "the
 * collision is happening right now" from "it is over", which a
 * left/right probability split alone cannot: before the packet arrives, all
 * of its probability is already on the left of the barrier, and calling that
 * a reflection probability of 1 is not true of anything that has happened.
 */
export function probabilityInsideBarrier(psi: Wavefunction1D, potential: readonly number[]): number {
  if (potential.length !== psi.grid.n) {
    throw new Error("probabilityInsideBarrier: potential array must have grid.n entries.");
  }
  return probabilityWhere(psi, (i) => potential[i] !== 0);
}

/** Sums |psi|^2 dx over the grid points `include` selects — the one Riemann sum the two checks above share. */
function probabilityWhere(psi: Wavefunction1D, include: (index: number) => boolean): number {
  const density = psi.probabilityDensity();
  let total = 0;
  for (let i = 0; i < psi.grid.n; i++) {
    if (include(i)) total += density[i] * psi.grid.dx;
  }
  return total;
}
