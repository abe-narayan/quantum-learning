import { Complex } from "./complex";
import { Matrix } from "./matrix";

/**
 * Partial trace — the operation that produces a *reduced* density matrix
 * describing one part of a multi-qubit system, tracing over the rest.
 * This is the one piece of machinery `StateVector` cannot express at all:
 * a state vector describes the *whole* system, with no way to talk about
 * "just qubit 0" when the qubits are entangled (partial trace is exactly
 * what makes that description well-defined even then).
 *
 * Follows this platform's established convention throughout: qubit 0 is
 * the most significant (leftmost) bit of the basis label, matching
 * `gates.ts`'s bitmask math and every other multi-qubit function on this
 * platform — there is exactly one place that convention is decided, and
 * this module is downstream of it, not a second, independent decision.
 */

function bitAt(index: number, totalQubits: number, qubit: number): number {
  return (index >> (totalQubits - 1 - qubit)) & 1;
}

function withBitSet(index: number, totalQubits: number, qubit: number, value: number): number {
  const shift = totalQubits - 1 - qubit;
  return value ? index | (1 << shift) : index & ~(1 << shift);
}

/**
 * Traces out `tracedOutQubits` from a `totalQubits`-qubit density matrix
 * ρ, returning the reduced density matrix on the remaining qubits (kept
 * in their original relative order). For each pair of reduced-basis
 * indices, sums ρ's entries over every basis-state pairing that agrees on
 * the traced-out qubits — the direct, index-level definition of partial
 * trace, not a shortcut specific to any one system size. Bounded to small
 * dimensions by this platform's pedagogical scope (2-4 qubits in
 * practice), not by an artificial restriction in this function itself:
 * the cost is O(4^totalQubits), fine well past what any lesson needs.
 */
export function partialTrace(rho: Matrix, totalQubits: number, tracedOutQubits: number[]): Matrix {
  const dimension = 2 ** totalQubits;
  if (rho.rows !== dimension || rho.cols !== dimension) {
    throw new Error(
      `partialTrace: rho is ${rho.rows}x${rho.cols}, but totalQubits=${totalQubits} implies ${dimension}x${dimension}.`
    );
  }
  const traced = [...new Set(tracedOutQubits)].sort((a, b) => a - b);
  for (const qubit of traced) {
    if (!Number.isInteger(qubit) || qubit < 0 || qubit >= totalQubits) {
      throw new Error(`partialTrace: qubit index ${qubit} is out of range for ${totalQubits} qubits.`);
    }
  }
  const kept = Array.from({ length: totalQubits }, (_, qubit) => qubit).filter((qubit) => !traced.includes(qubit));
  if (kept.length === 0) {
    throw new Error("partialTrace: cannot trace out every qubit. At least one must remain.");
  }

  const reducedDimension = 2 ** kept.length;
  const tracedDimension = 2 ** traced.length;
  const result: Complex[][] = Array.from({ length: reducedDimension }, () =>
    Array.from({ length: reducedDimension }, () => Complex.ZERO)
  );

  for (let reducedRow = 0; reducedRow < reducedDimension; reducedRow++) {
    for (let reducedCol = 0; reducedCol < reducedDimension; reducedCol++) {
      let sum = Complex.ZERO;
      for (let tracedPattern = 0; tracedPattern < tracedDimension; tracedPattern++) {
        let fullRow = 0;
        let fullCol = 0;
        kept.forEach((qubit, position) => {
          fullRow = withBitSet(fullRow, totalQubits, qubit, bitAt(reducedRow, kept.length, position));
          fullCol = withBitSet(fullCol, totalQubits, qubit, bitAt(reducedCol, kept.length, position));
        });
        traced.forEach((qubit, position) => {
          // Same bit value for both row and column — this is the trace:
          // summing the diagonal over the traced subsystem's basis.
          const bit = bitAt(tracedPattern, traced.length, position);
          fullRow = withBitSet(fullRow, totalQubits, qubit, bit);
          fullCol = withBitSet(fullCol, totalQubits, qubit, bit);
        });
        sum = sum.add(rho.get(fullRow, fullCol));
      }
      result[reducedRow][reducedCol] = sum;
    }
  }

  return new Matrix(result);
}

/** ρ_A = Tr_B(ρ_AB) for a 2-qubit density matrix — qubit 0's reduced state, tracing out qubit 1. */
export function reducedDensityMatrixQubit0(rhoAB: Matrix): Matrix {
  return partialTrace(rhoAB, 2, [1]);
}

/** ρ_B = Tr_A(ρ_AB) for a 2-qubit density matrix — qubit 1's reduced state, tracing out qubit 0. */
export function reducedDensityMatrixQubit1(rhoAB: Matrix): Matrix {
  return partialTrace(rhoAB, 2, [0]);
}
