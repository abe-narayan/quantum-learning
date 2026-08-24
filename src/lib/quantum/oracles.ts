import { StateVector } from "./state";

/**
 * The oracle machinery for Quantum Algorithms I. Two independent, verifiably
 * equivalent primitives rather than one "do everything" oracle abstraction:
 *
 * - `applyBitOracle` is the honest, textbook reversible oracle
 *   |x⟩|y⟩ → |x⟩|y⊕f(x)⟩, with the *last* qubit as the dedicated output/ancilla
 *   and every other qubit forming the input register x. This is the version
 *   phase kickback is derived from.
 * - `applyPhaseOracle` marks basis states directly with a sign flip — the
 *   form Grover's algorithm actually uses. It is not a separate physical
 *   model; the Phase Kickback lesson derives it as exactly what
 *   `applyBitOracle` reduces to when the output qubit starts in |−⟩ (proven,
 *   and checked directly against this module's tests).
 *
 * Both operate directly on the amplitude array (a basis permutation / sign
 * flip) rather than constructing an explicit 2ⁿ×2ⁿ unitary matrix — the same
 * "smallest correct implementation" approach this platform already uses for
 * `applySingleQubitGate`'s bitmask math.
 */

/**
 * |x⟩|y⟩ → |x⟩|y⊕f(x)⟩, where the last qubit is y (the output/ancilla) and
 * every other qubit's bits, read together, form x. Requires at least 2
 * qubits: 1+ input qubits plus the dedicated output qubit.
 */
export function applyBitOracle(state: StateVector, f: (x: number) => 0 | 1): StateVector {
  const n = state.numQubits;
  if (n < 2) {
    throw new Error(`applyBitOracle requires at least 2 qubits (input register + output qubit), got ${n}.`);
  }
  const amps = state.amplitudes;
  const result = amps.slice();
  const half = amps.length / 2;

  for (let x = 0; x < half; x++) {
    if (f(x) === 1) {
      const i0 = x * 2; // output qubit (last, least-significant bit) = 0
      const i1 = i0 + 1; // output qubit = 1
      const tmp = result[i0];
      result[i0] = result[i1];
      result[i1] = tmp;
    }
  }

  return new StateVector(result);
}

/**
 * Flips the sign of every basis amplitude whose index is in `markedIndices`
 * — the direct phase-oracle form: |x⟩ → −|x⟩ for marked x, |x⟩ → |x⟩
 * otherwise. Operates on the *entire* register (no separate output qubit).
 */
export function applyPhaseOracle(state: StateVector, markedIndices: Iterable<number>): StateVector {
  const amps = state.amplitudes.slice();
  const marked = new Set(markedIndices);
  for (const idx of marked) {
    if (idx < 0 || idx >= amps.length) {
      throw new Error(`applyPhaseOracle: marked index ${idx} is out of range for a ${amps.length}-dimensional state.`);
    }
    const a = amps[idx];
    amps[idx] = a.scale(-1);
  }
  return new StateVector(amps);
}

/**
 * Simon's oracle: |x⟩|y⟩ → |x⟩|y⊕f(x)⟩ on a register split into an
 * `inputQubits`-qubit x register (first, most-significant) and an
 * equally-sized y register (the rest), where f(x) = min(x, x⊕s) for a
 * nonzero hidden string `s` (an integer bitmask over `inputQubits` bits).
 *
 * Unlike `balancedFunction` (merely balanced), f here satisfies Simon's
 * genuine 2-to-1 promise: f(x) = f(x⊕s) for every x, and f(x) = f(x') only
 * for x' ∈ {x, x⊕s}. This holds because XOR-by-s (s≠0) is a fixed-point-free
 * involution on {0,1}^n, so it partitions the domain into exactly 2^(n-1)
 * disjoint pairs {x, x⊕s}; taking the minimum of each pair as that pair's
 * output value is constant within a pair (by definition) and distinct
 * across different pairs (if two pairs shared their minimum they'd be the
 * same pair). Implemented as the same "permute basis amplitudes directly"
 * approach as `applyBitOracle`, generalized from a single output qubit to a
 * full output register, since Simon's oracle (unlike Deutsch-Jozsa's) is
 * not single-bit-valued.
 */
export function applySimonOracle(state: StateVector, inputQubits: number, hiddenString: number): StateVector {
  if (hiddenString === 0) {
    throw new Error("applySimonOracle requires a nonzero hidden string s (s=0 gives a 1-to-1 function, not Simon's 2-to-1 promise).");
  }
  const n = state.numQubits;
  const outputQubits = n - inputQubits;
  if (outputQubits !== inputQubits) {
    throw new Error(
      `applySimonOracle expects an output register the same width as the ${inputQubits}-qubit input register, got ${outputQubits} output qubits (${n} total).`
    );
  }

  const xDim = 2 ** inputQubits;
  const yDim = 2 ** outputQubits;
  const amps = state.amplitudes;
  const result = amps.slice();

  for (let x = 0; x < xDim; x++) {
    const fx = Math.min(x, x ^ hiddenString);
    if (fx === 0) continue; // y unchanged for this x
    for (let y = 0; y < yDim; y++) {
      const yXorFx = y ^ fx;
      if (yXorFx > y) {
        // swap each {y, y⊕f(x)} pair exactly once
        const i0 = x * yDim + y;
        const i1 = x * yDim + yXorFx;
        const tmp = result[i0];
        result[i0] = result[i1];
        result[i1] = tmp;
      }
    }
  }

  return new StateVector(result);
}

/** A constant function: f(x) = c for every x. One of Deutsch-Jozsa's two cases. */
export function constantFunction(c: 0 | 1): (x: number) => 0 | 1 {
  return () => c;
}

/**
 * A balanced function on `inputQubits` bits: f(x) = 1 for exactly half of
 * all inputs, 0 for the other half. Implemented as parity of a fixed nonzero
 * bitmask (a standard, genuinely balanced construction) — not an arbitrary
 * lookup table, so it stays correct for any `inputQubits` count.
 */
export function balancedFunction(mask: number): (x: number) => 0 | 1 {
  if (mask === 0) {
    throw new Error("balancedFunction requires a nonzero mask (mask=0 is the constant-0 function, not balanced).");
  }
  return (x: number) => {
    let bits = x & mask;
    let parity = 0;
    while (bits) {
      parity ^= bits & 1;
      bits >>= 1;
    }
    return parity as 0 | 1;
  };
}
