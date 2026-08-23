import { Matrix } from "./matrix";
import { evolveDensityMatrix } from "./densityMatrix";
import { applyKrausChannel } from "./openSystems";

/**
 * Noisy circuit simulation, deliberately scoped to SINGLE-qubit circuits:
 * a sequence of unitary gates on a density matrix, with a noise channel
 * (Advanced Topics in Quantum Mechanics' Kraus operators) applied after
 * every gate. This is genuinely how noisy simulators work in principle
 * (interleave ideal evolution with a noise model) — scoped to one qubit
 * because a correct multi-qubit version needs each gate expanded to a
 * full 2^n x 2^n unitary via tensor products with identity on the
 * untouched qubits, machinery no lesson in this course actually needs;
 * building it here would be exactly the kind of unused generality this
 * platform avoids (see docs/ARCHITECTURE.md).
 */
export function runNoisyCircuit(initialRho: Matrix, gates: readonly Matrix[], noiseChannel: readonly Matrix[]): Matrix {
  if (initialRho.rows !== 2 || initialRho.cols !== 2) throw new Error("runNoisyCircuit is scoped to single-qubit (2x2) density matrices.");
  let rho = initialRho;
  for (const gate of gates) {
    if (gate.rows !== 2 || gate.cols !== 2) throw new Error("runNoisyCircuit is scoped to single-qubit (2x2) gates.");
    rho = evolveDensityMatrix(rho, gate);
    rho = applyKrausChannel(rho, noiseChannel);
  }
  return rho;
}
