import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { fft, ifft, momentumGrid, positionToMomentum, momentumToPosition } from "../fourier";

/** An independent, brute-force O(N^2) DFT — used only to cross-check `fft`. */
function bruteForceDft(input: Complex[], sign: 1 | -1): Complex[] {
  const n = input.length;
  return Array.from({ length: n }, (_, k) => {
    let sum = Complex.ZERO;
    for (let j = 0; j < n; j++) {
      sum = sum.add(input[j].mul(Complex.fromPolar(1, (sign * 2 * Math.PI * k * j) / n)));
    }
    return sum;
  });
}

function randomComplexArray(n: number): Complex[] {
  return Array.from({ length: n }, () => new Complex(Math.random() * 2 - 1, Math.random() * 2 - 1));
}

describe("fft/ifft", () => {
  it("throws on a non-power-of-two length", () => {
    expect(() => fft([Complex.ONE, Complex.ONE, Complex.ONE])).toThrow(/power-of-two/);
    expect(() => ifft(Array.from({ length: 6 }, () => Complex.ONE))).toThrow(/power-of-two/);
  });

  it("matches a brute-force DFT for several sizes and inputs", () => {
    for (const n of [1, 2, 4, 8, 16]) {
      for (const input of [
        Array.from({ length: n }, (_, i) => (i === 0 ? Complex.ONE : Complex.ZERO)), // delta
        Array.from({ length: n }, () => Complex.ONE), // constant
        randomComplexArray(n),
      ]) {
        const expected = bruteForceDft(input, -1);
        const actual = fft(input);
        for (let i = 0; i < n; i++) {
          expect(actual[i].re).toBeCloseTo(expected[i].re, 9);
          expect(actual[i].im).toBeCloseTo(expected[i].im, 9);
        }
      }
    }
  });

  it("ifft(fft(x)) recovers x exactly", () => {
    for (const n of [1, 2, 8, 64]) {
      const input = randomComplexArray(n);
      const roundTrip = ifft(fft(input));
      for (let i = 0; i < n; i++) {
        expect(roundTrip[i].re).toBeCloseTo(input[i].re, 9);
        expect(roundTrip[i].im).toBeCloseTo(input[i].im, 9);
      }
    }
  });

  it("satisfies Parseval's theorem for the unnormalized DFT: sum|X_k|^2 = N * sum|x_n|^2", () => {
    const n = 32;
    const input = randomComplexArray(n);
    const transformed = fft(input);
    const lhs = transformed.reduce((sum, x) => sum + x.magnitudeSquared(), 0);
    const rhs = n * input.reduce((sum, x) => sum + x.magnitudeSquared(), 0);
    expect(lhs).toBeCloseTo(rhs, 6);
  });
});

describe("momentumGrid", () => {
  it("produces fftfreq-style bin ordering and correct dk", () => {
    const { k, dk } = momentumGrid(4, 1);
    expect(dk).toBeCloseTo((2 * Math.PI) / 4, 12);
    expect(k[0]).toBeCloseTo(0, 12);
    expect(k[1]).toBeCloseTo(dk, 12);
    expect(k[2]).toBeCloseTo(-2 * dk, 12);
    expect(k[3]).toBeCloseTo(-dk, 12);
  });
});

describe("positionToMomentum / momentumToPosition", () => {
  it("round-trips a random state exactly", () => {
    const n = 32;
    const dx = 0.25;
    const input = randomComplexArray(n);
    const roundTrip = momentumToPosition(positionToMomentum(input, dx), dx);
    for (let i = 0; i < n; i++) {
      expect(roundTrip[i].re).toBeCloseTo(input[i].re, 8);
      expect(roundTrip[i].im).toBeCloseTo(input[i].im, 8);
    }
  });

  it("is norm-preserving (physical Parseval): sum|psi|^2 dx = sum|phi|^2 dk", () => {
    const n = 64;
    const dx = 0.2;
    const { dk } = momentumGrid(n, dx);
    const psi = randomComplexArray(n);
    const phi = positionToMomentum(psi, dx);

    const positionNorm = psi.reduce((sum, a) => sum + a.magnitudeSquared(), 0) * dx;
    const momentumNorm = phi.reduce((sum, a) => sum + a.magnitudeSquared(), 0) * dk;
    expect(momentumNorm).toBeCloseTo(positionNorm, 6);
  });

  it("transforms a stationary Gaussian to a Gaussian with the analytically-correct inverse width", () => {
    // psi(x) = (2*pi*sigma^2)^(-1/4) * exp(-x^2/(4*sigma^2)) has the known
    // Fourier transform phi(k) = (2*sigma^2/pi)^(1/4) * exp(-sigma^2*k^2).
    const n = 256;
    const dx = 0.1;
    const sigma = 1.0;
    const x = Array.from({ length: n }, (_, i) => i * dx - (n * dx) / 2);
    const psi = x.map((xi) => new Complex(Math.pow(2 * Math.PI * sigma * sigma, -0.25) * Math.exp(-(xi * xi) / (4 * sigma * sigma)), 0));

    const phi = positionToMomentum(psi, dx);
    const { k } = momentumGrid(n, dx);

    // Compare a handful of small-|k| bins (native order) against the closed form.
    for (const m of [0, 1, 2, n - 1, n - 2]) {
      const expected = Math.pow((2 * sigma * sigma) / Math.PI, 0.25) * Math.exp(-sigma * sigma * k[m] * k[m]);
      expect(phi[m].magnitude()).toBeCloseTo(expected, 3);
    }
  });
});
