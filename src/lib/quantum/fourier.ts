import { Complex } from "./complex";

/**
 * A radix-2 Cooley-Tukey FFT/IFFT pair, hand-written rather than imported —
 * see docs/ARCHITECTURE.md's Wave Mechanics section for why: an iterative,
 * in-place, bit-reversal implementation (not a recursive one that slices
 * arrays at every level) so a real-time animation loop can call it hundreds
 * of times per second without allocation overhead dominating, while still
 * avoiding a pulled-in numerical-computing dependency for one operation.
 * The one constraint this buys: grid sizes must be a power of 2.
 *
 * `fft` computes the standard *unnormalized* forward DFT,
 *   X_m = sum_n x_n * exp(-2*pi*i*m*n/N),
 * and `ifft` the standard normalized inverse,
 *   x_n = (1/N) * sum_m X_m * exp(+2*pi*i*m*n/N),
 * so that `ifft(fft(x))` recovers `x` exactly (up to floating point). This
 * raw pair is what this file's own `positionToMomentum`/`momentumToPosition`
 * wrappers apply the actual physical convention on top of — see there for
 * both the dx/sqrt(2*pi) normalization and the centered-grid phase.
 */
export function fft(input: readonly Complex[]): Complex[] {
  assertPowerOfTwoLength(input.length, "fft");
  return transform(input, -1);
}

export function ifft(input: readonly Complex[]): Complex[] {
  assertPowerOfTwoLength(input.length, "ifft");
  const n = input.length;
  return transform(input, 1).map((value) => value.scale(1 / n));
}

function bitReversalPermute(input: readonly Complex[]): Complex[] {
  const n = input.length;
  const bits = Math.log2(n);
  const output = new Array<Complex>(n);
  for (let i = 0; i < n; i++) {
    let reversed = 0;
    for (let b = 0; b < bits; b++) {
      if (i & (1 << b)) reversed |= 1 << (bits - 1 - b);
    }
    output[reversed] = input[i];
  }
  return output;
}

// Twiddle factors (unit-circle points) depend only on (transform size, sign,
// level), never on the data — and this module's whole reason to exist is a
// tight animation loop calling fft/ifft hundreds of times per second on the
// same grid size, so caching them across calls (rather than recomputing
// Math.cos/Math.sin afresh every time) is a real, measured win, not
// speculative optimization.
const twiddleCache = new Map<string, Complex[][]>();

function twiddlesFor(n: number, sign: 1 | -1): Complex[][] {
  const key = `${n}:${sign}`;
  const cached = twiddleCache.get(key);
  if (cached) return cached;

  const levels: Complex[][] = [];
  for (let size = 2; size <= n; size *= 2) {
    const half = size / 2;
    const angleStep = (sign * 2 * Math.PI) / size;
    levels.push(Array.from({ length: half }, (_, k) => Complex.fromPolar(1, angleStep * k)));
  }
  twiddleCache.set(key, levels);
  return levels;
}

function transform(input: readonly Complex[], sign: 1 | -1): Complex[] {
  const n = input.length;
  const a = bitReversalPermute(input);
  const twiddleLevels = twiddlesFor(n, sign);

  let levelIndex = 0;
  for (let size = 2; size <= n; size *= 2) {
    const half = size / 2;
    const twiddles = twiddleLevels[levelIndex++];
    for (let start = 0; start < n; start += size) {
      for (let k = 0; k < half; k++) {
        const even = a[start + k];
        const odd = a[start + k + half].mul(twiddles[k]);
        a[start + k] = even.add(odd);
        a[start + k + half] = even.sub(odd);
      }
    }
  }
  return a;
}

function assertPowerOfTwoLength(n: number, fnName: string) {
  if (n === 0 || (n & (n - 1)) !== 0) {
    throw new Error(`${fnName} requires a power-of-two input length, got ${n}.`);
  }
}

/**
 * The momentum (wavenumber) grid conjugate to a position grid of `n` points
 * spaced by `dx`. Returned in *native FFT bin order* — k[0] = 0, then
 * increasing positive frequencies, then the wrapped negative frequencies in
 * the back half (the same convention as e.g. numpy's `fftfreq`, scaled by
 * 2*pi for angular wavenumber). This order matches `fft()`'s own output
 * bin-for-bin, so k[m] always pairs correctly with amplitude bin m with no
 * fftshift needed for any of the physics computed from it (fftshift is only
 * ever needed if you want to *plot* k monotonically increasing).
 */
export function momentumGrid(n: number, dx: number): { k: number[]; dk: number } {
  const length = n * dx;
  const dk = (2 * Math.PI) / length;
  const k = Array.from({ length: n }, (_, m) => (m < n / 2 ? m * dk : (m - n) * dk));
  return { k, dk };
}

/**
 * The (-1)^m alternating sign that converts between the raw, index-based
 * DFT and a transform referred to the *centered* position grid built by
 * `wavefunction.ts`'s `createGrid` (x_n = n*dx - L/2). It is its own
 * inverse, which is why both `positionToMomentum` and
 * `momentumToPosition` apply the identical helper.
 *
 * Where it comes from: exp(-i*k_m*x_n) = exp(-i*k_m*n*dx) * exp(+i*k_m*L/2),
 * and the first factor is exactly the raw DFT kernel. The second factor is
 * independent of n, so it pulls straight out of the sum, and since
 * k_m*L/2 = pi*m (for both the positive bins m and the wrapped negative
 * bins m-N, because N is even), it is exactly (-1)^m.
 */
function centeredGridSigns(values: readonly Complex[]): Complex[] {
  return values.map((value, m) => (m % 2 === 0 ? value : value.scale(-1)));
}

/**
 * Forward position -> momentum transform, in natural units (hbar = 1) so
 * momentum equals wavenumber k:
 *
 *   phi(k_m) = (dx / sqrt(2*pi)) * sum_n psi(x_n) * exp(-i*k_m*x_n)
 *
 * The position grid is the *centered* one `wavefunction.ts`'s `createGrid`
 * builds (x_n = n*dx - L/2), and the x_n above are those actual, centered
 * coordinates — the same ones `Wavefunction1D.expectationPosition` sums
 * against. That consistency is the whole point of `centeredGridSigns`: the
 * raw index-based DFT computes the transform as if the grid started at
 * x=0, which differs from the formula above by exp(+i*k_m*L/2) = (-1)^m.
 *
 * Dropping that factor is tempting, because it is invisible to every
 * quantity built from |phi(k)|^2 alone — the momentum probability density,
 * <p>, <p^2>, Parseval, and therefore every number `Wavefunction1D`
 * currently reports. But it is not invisible to phi itself, and it is
 * genuinely wrong: a real wavefunction centered at x=0 (a stationary
 * Gaussian, any even-parity eigenstate) has a real, even phi(k), and
 * without this correction the engine returns one whose sign alternates
 * bin to bin. That is the failure this factor prevents, and the reason
 * the position and momentum representations here are referred to one and
 * the same coordinate origin rather than two silently different ones.
 */
export function positionToMomentum(amplitudes: readonly Complex[], dx: number): Complex[] {
  const scale = dx / Math.sqrt(2 * Math.PI);
  return centeredGridSigns(fft(amplitudes)).map((value) => value.scale(scale));
}

/** Inverse of `positionToMomentum` — see there for the normalization and centered-grid conventions. */
export function momentumToPosition(amplitudes: readonly Complex[], dx: number): Complex[] {
  const scale = Math.sqrt(2 * Math.PI) / dx;
  return ifft(centeredGridSigns(amplitudes)).map((value) => value.scale(scale));
}
