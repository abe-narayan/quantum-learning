import { Complex } from "./complex";
import { Matrix } from "./matrix";
import type { Grid1D } from "./wavefunction";
import { Wavefunction1D } from "./wavefunction";

/**
 * The four approximation techniques of Approximation Methods, kept to the
 * smallest implementation that supports the lesson content — no general
 * numerical eigensolver, no adaptive ODE integrator, no general
 * root-finder library. Each piece reuses existing platform infrastructure
 * (the finite-dimensional Matrix engine for perturbation theory, the 1D
 * grid/Wavefunction1D machinery already built for Wave Mechanics for the
 * variational method and WKB) rather than introducing new machinery.
 */

// ---------------------------------------------------------------------------
// Time-independent perturbation theory (finite-dimensional, matrix-based)
// ---------------------------------------------------------------------------

/**
 * First-order energy correction E_n^(1) = <n|H'|n>, given the unperturbed
 * energies (used only to select which basis index n refers to) and the
 * perturbation matrix H' in the *unperturbed* energy eigenbasis.
 */
export function firstOrderEnergyCorrection(H0diag: readonly number[], Hprime: Matrix, n: number): number {
  if (n < 0 || n >= H0diag.length) throw new Error(`firstOrderEnergyCorrection: n=${n} out of range.`);
  return Hprime.get(n, n).re;
}

/**
 * Second-order energy correction E_n^(2) = sum_{m != n} |<m|H'|n>|^2 / (E_n^0 - E_m^0).
 * Requires H0diag to have no accidental degeneracies at index n (division by
 * zero otherwise) — the standard non-degenerate perturbation theory
 * assumption, not handled here (degenerate perturbation theory is out of
 * this course's scope, stated explicitly in the lesson).
 */
export function secondOrderEnergyCorrection(H0diag: readonly number[], Hprime: Matrix, n: number): number {
  if (n < 0 || n >= H0diag.length) throw new Error(`secondOrderEnergyCorrection: n=${n} out of range.`);
  let total = 0;
  for (let m = 0; m < H0diag.length; m++) {
    if (m === n) continue;
    const gap = H0diag[n] - H0diag[m];
    if (Math.abs(gap) < 1e-12) {
      throw new Error(`secondOrderEnergyCorrection: degenerate levels at n=${n}, m=${m} — non-degenerate PT does not apply.`);
    }
    total += Hprime.get(m, n).magnitudeSquared() / gap;
  }
  return total;
}

/**
 * First-order state correction coefficients c_m = <m|H'|n>/(E_n^0-E_m^0)
 * for m != n (c_n itself is conventionally taken to be 0, fixing the
 * correction's normalization at first order). |psi_n^(1)> = sum_m c_m|m>.
 */
export function firstOrderStateCorrection(H0diag: readonly number[], Hprime: Matrix, n: number): Complex[] {
  if (n < 0 || n >= H0diag.length) throw new Error(`firstOrderStateCorrection: n=${n} out of range.`);
  return H0diag.map((_, m) => {
    if (m === n) return Complex.ZERO;
    const gap = H0diag[n] - H0diag[m];
    if (Math.abs(gap) < 1e-12) {
      throw new Error(`firstOrderStateCorrection: degenerate levels at n=${n}, m=${m} — non-degenerate PT does not apply.`);
    }
    return Hprime.get(m, n).scale(1 / gap);
  });
}

// ---------------------------------------------------------------------------
// The variational method (continuous 1D grid, reusing Wavefunction1D)
// ---------------------------------------------------------------------------

/** <H> for a normalized Gaussian trial wavefunction of the given width, centered at 0, against a fixed potential array — the variational method's trial-energy functional. */
export function gaussianTrialEnergy(grid: Grid1D, potential: readonly number[], width: number, mass = 1): number {
  const trial = Wavefunction1D.gaussianPacket(grid, { center: 0, width, momentum: 0 });
  return trial.expectationEnergy(potential, mass);
}

/**
 * Minimizes gaussianTrialEnergy over trial width by direct grid search
 * (the same "smallest correct optimizer" choice already made for VQE's
 * `runVqe` — no gradient/adaptive method needed for a single 1D parameter
 * scan). Returns the best width found and its trial energy, which by the
 * variational principle is guaranteed >= the true ground state energy.
 */
export function minimizeGaussianTrialEnergy(
  grid: Grid1D,
  potential: readonly number[],
  options: { widthMin: number; widthMax: number; steps?: number } = { widthMin: 0.1, widthMax: 5 }
): { bestWidth: number; bestEnergy: number } {
  const { widthMin, widthMax } = options;
  const steps = options.steps ?? 200;
  if (!(widthMin > 0) || widthMax <= widthMin) throw new Error("minimizeGaussianTrialEnergy requires 0 < widthMin < widthMax.");
  let bestWidth = widthMin;
  let bestEnergy = Infinity;
  for (let i = 0; i <= steps; i++) {
    const width = widthMin + ((widthMax - widthMin) * i) / steps;
    const energy = gaussianTrialEnergy(grid, potential, width);
    if (energy < bestEnergy) {
      bestEnergy = energy;
      bestWidth = width;
    }
  }
  return { bestWidth, bestEnergy };
}

// ---------------------------------------------------------------------------
// The WKB approximation (semiclassical quantization, reusing the grid)
// ---------------------------------------------------------------------------

/**
 * The WKB (Bohr-Sommerfeld) action integral ∫p(x)dx = ∫sqrt(2m(E-V(x)))dx,
 * summed only over the classically allowed region (where E > V(x)) via a
 * plain Riemann sum on the existing grid — the semiclassical momentum
 * integral that the WKB quantization condition sets equal to (n+1/2)*pi
 * (hbar=1, two soft turning points).
 */
export function wkbActionIntegral(grid: Grid1D, potential: readonly number[], energy: number, mass = 1): number {
  if (potential.length !== grid.n) throw new Error("wkbActionIntegral: potential array must match grid.n.");
  let total = 0;
  for (let i = 0; i < grid.n; i++) {
    const underRoot = 2 * mass * (energy - potential[i]);
    if (underRoot > 0) total += Math.sqrt(underRoot) * grid.dx;
  }
  return total;
}

/**
 * Finds the n-th WKB-quantized energy by bisecting on E so that
 * wkbActionIntegral(E) = (n+1/2)*pi, the standard two-soft-turning-point
 * quantization condition. Requires a bracketing [eMin, eMax] with the
 * action integral increasing through the target on that range — true for
 * any confining potential like the harmonic oscillator this course uses.
 */
export function wkbQuantizedEnergy(
  grid: Grid1D,
  potential: readonly number[],
  n: number,
  options: { eMin: number; eMax: number; mass?: number }
): number {
  if (n < 0) throw new Error("wkbQuantizedEnergy requires n >= 0.");
  const mass = options.mass ?? 1;
  const target = (n + 0.5) * Math.PI;
  let lo = options.eMin;
  let hi = options.eMax;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const action = wkbActionIntegral(grid, potential, mid, mass);
    if (action < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ---------------------------------------------------------------------------
// Time-dependent perturbation theory (a driven two-level system)
// ---------------------------------------------------------------------------

/**
 * First-order transition probability for a perturbation V switched on at
 * t=0 and held constant, coupling two states separated by omegaFi =
 * (E_f-E_i)/hbar — the standard closed-form first-order time-dependent
 * perturbation theory result (a special case of Fermi's Golden Rule
 * before the long-time/continuum-of-states limit is taken).
 */
export function firstOrderTransitionProbability(Vfi: number, omegaFi: number, t: number): number {
  if (Math.abs(omegaFi) < 1e-12) return Vfi * Vfi * t * t;
  const s = Math.sin((omegaFi * t) / 2);
  return (Vfi * Vfi) * (4 * s * s) / (omegaFi * omegaFi);
}

/**
 * The EXACT two-level transition probability (no perturbative
 * approximation), found by directly integrating the 2x2 time-independent*
 * Schrödinger equation i*dc/dt = H*c via 4th-order Runge-Kutta, where
 * H = [[E_i, V],[V, E_f]] (V taken real, the same convention as Vfi
 * above). Used only to check first-order perturbation theory's accuracy
 * regime (small V) against the true dynamics — not a general ODE solver,
 * just this one fixed 2x2 case.
 *
 * *Constant-in-time H here, unlike the "switched on at t=0" framing of
 * the perturbative formula above; both describe the same physical setup
 * for t>0, since H is constant for all t>0 in the switched-on scenario.
 */
export function exactTwoLevelTransitionProbability(Ei: number, Ef: number, V: number, t: number, steps = 2000): number {
  return exactTwoLevelState(Ei, Ef, V, t, steps)[1].magnitudeSquared();
}

/**
 * The full two-level state vector c(t)=[c_i(t),c_f(t)] under the same
 * exact RK4 integration `exactTwoLevelTransitionProbability` uses,
 * exposing the complex amplitudes themselves rather than only the final
 * population. Used by the Rabi/Qubit Dynamics Explorer to plot a genuine
 * Bloch-sphere trajectory (⟨X⟩,⟨Y⟩,⟨Z⟩ computed directly from c(t), not
 * a separate or approximated calculation) alongside the population
 * curve — the identical physics, just not discarding the phase
 * information the probability-only function throws away.
 */
export function exactTwoLevelState(Ei: number, Ef: number, V: number, t: number, steps = 2000): Complex[] {
  if (t < 0) throw new Error("exactTwoLevelState requires t >= 0.");
  const H = twoLevelHamiltonian(Ei, Ef, V);
  let c: Complex[] = [Complex.ONE, Complex.ZERO];
  const dt = t / steps;
  for (let i = 0; i < steps; i++) c = rk4Step(H, c, dt);
  return c;
}

function twoLevelHamiltonian(Ei: number, Ef: number, V: number): Matrix {
  return new Matrix([
    [new Complex(Ei), new Complex(V)],
    [new Complex(V), new Complex(Ef)],
  ]);
}

function rk4Step(H: Matrix, c: Complex[], dt: number): Complex[] {
  const derivative = (state: Complex[]): Complex[] => H.apply(state).map((v) => v.mul(new Complex(0, -1)));
  const k1 = derivative(c);
  const k2 = derivative(c.map((v, j) => v.add(k1[j].scale(dt / 2))));
  const k3 = derivative(c.map((v, j) => v.add(k2[j].scale(dt / 2))));
  const k4 = derivative(c.map((v, j) => v.add(k3[j].scale(dt))));
  return c.map((v, j) => v.add(k1[j].add(k2[j].scale(2)).add(k3[j].scale(2)).add(k4[j]).scale(dt / 6)));
}

/**
 * The same exact RK4 two-level integration as `exactTwoLevelState`, but
 * recording the state at `samples` evenly-spaced points along a single
 * continuous integration from t=0 to tMax, rather than re-integrating from
 * scratch for every requested t. Used by the Rabi/Qubit Dynamics Explorer to
 * get a full population/Bloch-vector trajectory in one pass (O(samples)) for
 * a scrubbable time slider, instead of O(samples) independent re-integrations.
 */
export function exactTwoLevelTrajectory(
  Ei: number,
  Ef: number,
  V: number,
  tMax: number,
  samples = 240
): { t: number; c: Complex[] }[] {
  if (tMax <= 0) throw new Error("exactTwoLevelTrajectory requires tMax > 0.");
  if (samples < 1) throw new Error("exactTwoLevelTrajectory requires samples >= 1.");
  const H = twoLevelHamiltonian(Ei, Ef, V);
  const dt = tMax / samples;
  const trajectory: { t: number; c: Complex[] }[] = [{ t: 0, c: [Complex.ONE, Complex.ZERO] }];
  let c: Complex[] = [Complex.ONE, Complex.ZERO];
  for (let i = 1; i <= samples; i++) {
    c = rk4Step(H, c, dt);
    trajectory.push({ t: i * dt, c });
  }
  return trajectory;
}
