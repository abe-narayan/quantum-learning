import type { StateVector } from "@/lib/quantum/state";
import { pureStateDensityMatrix, purity } from "@/lib/quantum/densityMatrix";
import { partialTrace } from "@/lib/quantum/partialTrace";

const PURITY_TOLERANCE = 1e-6;

/**
 * Whether every qubit in `state` is unentangled from the rest of the
 * system — i.e. the whole state factors as a product of single-qubit
 * states. Checked per qubit via partial trace + purity (Tr(ρ_i²) ≈ 1 iff
 * qubit i is separable from the rest), which — unlike `entanglementEntropy`
 * in `@/lib/quantum/entanglement.ts` — isn't restricted to exactly 2
 * qubits, since Circuit Builder also supports 3-qubit circuits (e.g. GHZ
 * states). Used to detect the exact step a gate first entangles the
 * circuit, for the "what to notice" callout below the state inspector.
 */
export function isFullyProductState(state: StateVector): boolean {
  if (state.numQubits <= 1) return true;
  const rho = pureStateDensityMatrix(state);
  const allQubits = Array.from({ length: state.numQubits }, (_, qubit) => qubit);
  return allQubits.every((qubit) => {
    const others = allQubits.filter((q) => q !== qubit);
    const reduced = partialTrace(rho, state.numQubits, others);
    return purity(reduced) >= 1 - PURITY_TOLERANCE;
  });
}
