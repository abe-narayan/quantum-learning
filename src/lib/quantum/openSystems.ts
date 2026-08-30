import { Complex } from "./complex";
import { Matrix } from "./matrix";

/**
 * Open-system (non-unitary) evolution via Kraus operators — the standard
 * way to represent decoherence and noise channels without solving a
 * differential (Lindblad master) equation. A single Kraus channel applied
 * repeatedly already demonstrates everything Decoherence needs (coherence
 * decay toward a fixed point); the full continuous-time Lindblad ODE is
 * deliberately not implemented, since no lesson in this course needs it —
 * see docs/ARCHITECTURE.md for this platform's general "smallest correct
 * implementation" policy.
 */

/** Applies a quantum channel given by Kraus operators {K_k}: rho -> sum_k K_k rho K_k^dagger. */
export function applyKrausChannel(rho: Matrix, krausOperators: readonly Matrix[]): Matrix {
  if (krausOperators.length === 0) throw new Error("applyKrausChannel requires at least one Kraus operator.");
  const dim = rho.rows;
  let result = Matrix.zeros(dim, dim);
  for (const K of krausOperators) {
    result = result.add(K.mul(rho).mul(K.dagger()));
  }
  return result;
}

/** Checks the trace-preservation condition sum_k K_k^dagger K_k = I, to within tolerance — the defining property of a physical (probability-conserving) channel. */
export function isTracePreserving(krausOperators: readonly Matrix[], tolerance = 1e-9): boolean {
  const dim = krausOperators[0].cols;
  let sum = Matrix.zeros(dim, dim);
  for (const K of krausOperators) {
    sum = sum.add(K.dagger().mul(K));
  }
  for (let r = 0; r < dim; r++) {
    for (let c = 0; c < dim; c++) {
      const expected = r === c ? Complex.ONE : Complex.ZERO;
      if (sum.get(r, c).sub(expected).magnitude() > tolerance) return false;
    }
  }
  return true;
}

/**
 * The amplitude damping channel, modeling spontaneous decay |1>->|0> with
 * probability `gamma` per application — a single-qubit model of energy
 * relaxation (T1 decay in the language Quantum Hardware will use later).
 */
export function amplitudeDampingChannel(gamma: number): Matrix[] {
  if (gamma < 0 || gamma > 1) throw new Error(`amplitudeDampingChannel requires 0<=gamma<=1, got ${gamma}.`);
  const K0 = new Matrix([
    [Complex.ONE, Complex.ZERO],
    [Complex.ZERO, new Complex(Math.sqrt(1 - gamma))],
  ]);
  const K1 = new Matrix([
    [Complex.ZERO, new Complex(Math.sqrt(gamma))],
    [Complex.ZERO, Complex.ZERO],
  ]);
  return [K0, K1];
}

/**
 * The (pure) dephasing channel, randomizing relative phase with
 * probability `lambda` per application while preserving populations — a
 * single-qubit model of pure decoherence with no energy loss.
 *
 * **Its time constant is T_phi, not T2.** T2 is the *total* coherence time
 * once both mechanisms are acting, and the two rates add as
 * `1/T2 = 1/(2*T1) + 1/T_phi`, because energy relaxation costs coherence at
 * half the rate it costs population. Feeding this channel a T2 does reproduce
 * the observed coherence envelope, but only while it acts alone: compose it
 * with `amplitudeDampingChannel` at T1 and relaxation contributes its own
 * coherence loss on top, so the pair decays at `1/T2 + 1/(2*T1)` and
 * double-counts relaxation. To model both at once, pass T1 to the damping
 * channel and **T_phi** to this one.
 *
 * The docstring said "(T2 decay)" until 2026-08-30. The same conflation had
 * spread into the hardware lessons, where "T2 processes (pure dephasing)"
 * treated the total as if it were one of its own two mechanisms.
 */
export function dephasingChannel(lambda: number): Matrix[] {
  if (lambda < 0 || lambda > 1) throw new Error(`dephasingChannel requires 0<=lambda<=1, got ${lambda}.`);
  const K0 = new Matrix([
    [new Complex(Math.sqrt(1 - lambda / 2)), Complex.ZERO],
    [Complex.ZERO, new Complex(Math.sqrt(1 - lambda / 2))],
  ]);
  const K1 = new Matrix([
    [new Complex(Math.sqrt(lambda / 2)), Complex.ZERO],
    [Complex.ZERO, new Complex(-Math.sqrt(lambda / 2))],
  ]);
  return [K0, K1];
}

/** Applies a channel `n` times in sequence — the discrete-time model of decoherence accumulating over repeated interactions with an environment. */
export function applyChannelRepeatedly(rho: Matrix, krausOperators: readonly Matrix[], n: number): Matrix {
  if (n < 0 || !Number.isInteger(n)) throw new Error(`applyChannelRepeatedly requires a non-negative integer n, got ${n}.`);
  let result = rho;
  for (let i = 0; i < n; i++) {
    result = applyKrausChannel(result, krausOperators);
  }
  return result;
}

/**
 * The per-timestep channel strength that reproduces continuous exponential
 * decay with time constant `characteristicTime` (T1 or T2, in whatever
 * time unit `dt` is given in) when applied once per step of size `dt`:
 * 1-gamma(dt) = exp(-dt/T), so N repeated applications over total time
 * N*dt give (1-gamma)^N = exp(-N*dt/T) exactly — matching the continuous
 * decay law exactly, for any step count, not just approximately in a
 * fine-stepping limit. This is what directly connects this platform's
 * discrete Kraus-channel model to the T1/T2 language used throughout
 * real hardware specifications.
 */
export function decayProbabilityForTimestep(characteristicTime: number, dt: number): number {
  if (!(characteristicTime > 0)) throw new Error("decayProbabilityForTimestep requires characteristicTime > 0.");
  if (!(dt > 0)) throw new Error("decayProbabilityForTimestep requires dt > 0.");
  return 1 - Math.exp(-dt / characteristicTime);
}
