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
 * raw pair is what physics.ts's `positionToMomentum`/`momentumToPosition`
 * apply the actual physical normalization on top of — see there for why the
 * physical convention has an extra dx/sqrt(2*pi) factor.
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
 * Forward position -> momentum transform, in natural units (hbar = 1) so
 * momentum equals wavenumber k:
 *
 *   phi(k_m) = (dx / sqrt(2*pi)) * sum_n psi(x_n) * exp(-i*k_m*x_n)
 *
 * The position grid is assumed centered (x_n = n*dx - L/2, as built by
 * `wavefunction.ts`'s `createGrid`) rather than starting at x=0. This
 * doesn't need an extra phase correction: shifting where the coordinate
 * origin is *labeled* doesn't change the sequence of amplitude values
 * psi_n, and the Fourier transform only depends on that sequence and the
 * spacing dx — not on what x-value each index is captioned with. So this
 * is exactly (dx/sqrt(2*pi)) times the raw, index-based DFT, with no x_min
 * phase factor needed. (Physically: translating the *origin* is not the
 * same operation as translating the *wavefunction* — only the latter would
 * introduce a momentum-space phase.) Verified numerically in fourier.test.ts
 * via round-trip and Parseval checks.
 */
export function positionToMomentum(amplitudes: readonly Complex[], dx: number): Complex[] {
  const scale = dx / Math.sqrt(2 * Math.PI);
  return fft(amplitudes).map((value) => value.scale(scale));
}

/** Inverse of `positionToMomentum` — see there for the normalization convention. */
export function momentumToPosition(amplitudes: readonly Complex[], dx: number): Complex[] {
  const scale = Math.sqrt(2 * Math.PI) / dx;
  return ifft(amplitudes).map((value) => value.scale(scale));
}
