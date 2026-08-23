import { Complex } from "./complex";
import { momentumGrid, positionToMomentum } from "./fourier";

/**
 * A uniform 1D position grid, centered at x=0: x[i] = i*dx - L/2 for
 * i = 0..n-1, where L = n*dx. `n` must be a power of 2 (required by the
 * FFT this module's momentum-space methods depend on — see fourier.ts).
 *
 * This grid's index order *is* the FFT's native bin order — index 0 is
 * simply relabeled to carry the value -L/2 instead of 0 for a nicer,
 * physically-centered display/expectation-value coordinate. See
 * fourier.ts's `positionToMomentum` doc comment for why that relabeling
 * needs no extra phase correction anywhere downstream.
 */
export type Grid1D = {
  readonly n: number;
  readonly dx: number;
  readonly x: readonly number[];
  readonly length: number;
};

export function createGrid(n: number, dx: number): Grid1D {
  if (n <= 0 || (n & (n - 1)) !== 0) {
    throw new Error(`createGrid requires a power-of-two n, got ${n}.`);
  }
  if (!(dx > 0)) {
    throw new Error(`createGrid requires dx > 0, got ${dx}.`);
  }
  const length = n * dx;
  const x = Array.from({ length: n }, (_, i) => i * dx - length / 2);
  return { n, dx, x, length };
}

function assertSameGrid(a: Grid1D, b: Grid1D) {
  if (a.n !== b.n || Math.abs(a.dx - b.dx) > 1e-12) {
    throw new Error("Wavefunctions must share the same grid to combine.");
  }
}

/**
 * A discretized 1D wavefunction psi(x) on a `Grid1D`, in natural units
 * (hbar = m = 1 unless a mass is given explicitly) — standard practice for
 * pedagogical numerical quantum mechanics, and consistent with the
 * ladder-operator energy formulas already used in the "From Classical to
 * Quantum" course (E_n = hbar*omega*(n+1/2) there, with hbar implicit).
 *
 * All quantities computed against a probability density are Riemann sums
 * over the grid (sum_i f(x_i)*P(x_i)*dx), the discretized form of
 * integral f(x)|psi(x)|^2 dx — accurate to the grid resolution.
 */
export class Wavefunction1D {
  constructor(
    readonly grid: Grid1D,
    readonly amplitudes: readonly Complex[]
  ) {
    if (amplitudes.length !== grid.n) {
      throw new Error(
        `Wavefunction1D amplitude count (${amplitudes.length}) must match grid.n (${grid.n}).`
      );
    }
  }

  static fromFunction(grid: Grid1D, fn: (x: number) => Complex): Wavefunction1D {
    return new Wavefunction1D(grid, grid.x.map(fn));
  }

  /**
   * A normalized Gaussian wave packet: |psi(x)|^2 is a Gaussian probability
   * density centered at `center` with standard deviation `width`, carrying
   * momentum `momentum` via the plane-wave phase factor exp(i*momentum*x).
   */
  static gaussianPacket(
    grid: Grid1D,
    options: { center: number; width: number; momentum: number }
  ): Wavefunction1D {
    const { center, width, momentum } = options;
    if (!(width > 0)) throw new Error("gaussianPacket requires width > 0.");
    const raw = grid.x.map((x) => {
      const envelope = Math.exp(-((x - center) ** 2) / (4 * width * width));
      return Complex.fromPolar(envelope, momentum * x);
    });
    return new Wavefunction1D(grid, raw).normalize();
  }

  /**
   * A normalized linear combination sum_j coefficient_j * psi_j, e.g. an
   * equal superposition of two energy eigenstates — used by the
   * Wavefunction Explorer's superposition preset, and directly connects to
   * the "Superposition, Interference, and Phase" lesson from the previous
   * course, now made concrete with continuous wavefunctions.
   */
  static superposition(terms: { psi: Wavefunction1D; coefficient: Complex }[]): Wavefunction1D {
    if (terms.length === 0) throw new Error("superposition requires at least one term.");
    const grid = terms[0].psi.grid;
    for (const term of terms) assertSameGrid(grid, term.psi.grid);
    const amplitudes = grid.x.map((_, i) =>
      terms.reduce((sum, term) => sum.add(term.coefficient.mul(term.psi.amplitudes[i])), Complex.ZERO)
    );
    return new Wavefunction1D(grid, amplitudes).normalize();
  }

  probabilityDensity(): number[] {
    return this.amplitudes.map((a) => a.magnitudeSquared());
  }

  normSquared(): number {
    return this.probabilityDensity().reduce((sum, p) => sum + p, 0) * this.grid.dx;
  }

  norm(): number {
    return Math.sqrt(this.normSquared());
  }

  normalize(): Wavefunction1D {
    const n = this.norm();
    if (n < 1e-12) {
      throw new Error("Cannot normalize a near-zero wavefunction.");
    }
    return new Wavefunction1D(this.grid, this.amplitudes.map((a) => a.scale(1 / n)));
  }

  /** <this|other> = integral psi_this(x)* psi_other(x) dx, as a discretized sum. */
  innerProduct(other: Wavefunction1D): Complex {
    assertSameGrid(this.grid, other.grid);
    const sum = this.amplitudes.reduce(
      (acc, a, i) => acc.add(a.conjugate().mul(other.amplitudes[i])),
      Complex.ZERO
    );
    return sum.scale(this.grid.dx);
  }

  /** |<this|other>|^2 — a fidelity-like overlap probability, used for the analytical-vs-numerical comparison. */
  overlapProbability(other: Wavefunction1D): number {
    return this.innerProduct(other).magnitudeSquared();
  }

  expectationPosition(): number {
    const density = this.probabilityDensity();
    return density.reduce((sum, p, i) => sum + p * this.grid.x[i], 0) * this.grid.dx;
  }

  variancePosition(): number {
    const density = this.probabilityDensity();
    const meanX = this.expectationPosition();
    const meanXSquared = density.reduce((sum, p, i) => sum + p * this.grid.x[i] ** 2, 0) * this.grid.dx;
    return meanXSquared - meanX * meanX;
  }

  expectationPotential(potential: readonly number[]): number {
    if (potential.length !== this.grid.n) {
      throw new Error("potential array must have grid.n entries.");
    }
    const density = this.probabilityDensity();
    return density.reduce((sum, p, i) => sum + p * potential[i], 0) * this.grid.dx;
  }

  /** The momentum-space representation phi(k), via the physically-normalized Fourier transform. */
  toMomentumSpace(): { k: readonly number[]; amplitudes: Complex[] } {
    const { k } = momentumGrid(this.grid.n, this.grid.dx);
    return { k, amplitudes: positionToMomentum(this.amplitudes, this.grid.dx) };
  }

  private momentumMoments(): { dk: number; k: readonly number[]; density: number[] } {
    const { k, amplitudes } = this.toMomentumSpace();
    const { dk } = momentumGrid(this.grid.n, this.grid.dx);
    return { dk, k, density: amplitudes.map((phi) => phi.magnitudeSquared()) };
  }

  expectationMomentum(): number {
    const { dk, k, density } = this.momentumMoments();
    return density.reduce((sum, p, i) => sum + p * k[i], 0) * dk;
  }

  varianceMomentum(): number {
    const { dk, k, density } = this.momentumMoments();
    const meanP = density.reduce((sum, p, i) => sum + p * k[i], 0) * dk;
    const meanPSquared = density.reduce((sum, p, i) => sum + p * k[i] * k[i], 0) * dk;
    return meanPSquared - meanP * meanP;
  }

  /** <T> = <p^2>/(2m), computed directly from the momentum-space distribution. */
  expectationKineticEnergy(mass = 1): number {
    const { dk, k, density } = this.momentumMoments();
    const meanPSquared = density.reduce((sum, p, i) => sum + p * k[i] * k[i], 0) * dk;
    return meanPSquared / (2 * mass);
  }

  /** <H> = <T> + <V>, the numerical total-energy expectation used to check against analytical E_n formulas. */
  expectationEnergy(potential: readonly number[], mass = 1): number {
    return this.expectationKineticEnergy(mass) + this.expectationPotential(potential);
  }

  /**
   * <p> and <T>=<p^2>/(2m) together, from a single momentum-space Fourier
   * transform. Calling `expectationMomentum()` and `expectationKineticEnergy()`
   * separately (as the UI's per-frame display update did originally) computes
   * that same transform twice for no reason — a real, measured cost in a
   * requestAnimationFrame loop that also re-renders on every step. Use this
   * instead wherever both quantities are needed together, e.g. once per
   * animation frame rather than once per displaying component.
   */
  momentumStatistics(mass = 1): { meanMomentum: number; kineticEnergy: number } {
    const { dk, k, density } = this.momentumMoments();
    const meanMomentum = density.reduce((sum, p, i) => sum + p * k[i], 0) * dk;
    const meanPSquared = density.reduce((sum, p, i) => sum + p * k[i] * k[i], 0) * dk;
    return { meanMomentum, kineticEnergy: meanPSquared / (2 * mass) };
  }
}
