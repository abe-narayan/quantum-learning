import type { Matrix } from "@/lib/quantum/matrix";
import { PAULI_X, PAULI_Y, PAULI_Z, HADAMARD, S_GATE, T_GATE } from "@/lib/quantum/gates";

export type SingleQubitGateId = "H" | "X" | "Y" | "Z" | "S" | "T";

export type SingleQubitGateDefinition = {
  id: SingleQubitGateId;
  label: string;
  matrix: Matrix;
  explanation: string;
};

export const SINGLE_QUBIT_GATES: SingleQubitGateDefinition[] = [
  { id: "H", label: "H", matrix: HADAMARD, explanation: "Creates or removes superposition." },
  { id: "X", label: "X", matrix: PAULI_X, explanation: "Flips |0⟩ and |1⟩." },
  { id: "Y", label: "Y", matrix: PAULI_Y, explanation: "Bit flip and phase flip combined." },
  { id: "Z", label: "Z", matrix: PAULI_Z, explanation: "Flips the phase of |1⟩ only." },
  { id: "S", label: "S", matrix: S_GATE, explanation: "A quarter-turn phase gate." },
  { id: "T", label: "T", matrix: T_GATE, explanation: "An eighth-turn phase gate." },
];
