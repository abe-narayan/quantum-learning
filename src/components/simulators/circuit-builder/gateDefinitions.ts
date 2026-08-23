import type { SingleQubitGateName, TwoQubitGateName } from "@/lib/quantum/circuitBuilder";

export type SingleQubitGateOption = {
  id: SingleQubitGateName;
  label: string;
  explanation: string;
};

export const SINGLE_QUBIT_GATE_OPTIONS: SingleQubitGateOption[] = [
  { id: "H", label: "H", explanation: "Creates or removes superposition." },
  { id: "X", label: "X", explanation: "Flips |0⟩ and |1⟩." },
  { id: "Y", label: "Y", explanation: "Bit flip and phase flip combined." },
  { id: "Z", label: "Z", explanation: "Flips the phase of |1⟩ only." },
  { id: "S", label: "S", explanation: "A quarter-turn phase gate." },
  { id: "T", label: "T", explanation: "An eighth-turn phase gate." },
];

export type TwoQubitGateOption = {
  id: TwoQubitGateName;
  label: string;
  explanation: string;
};

export const TWO_QUBIT_GATE_OPTIONS: TwoQubitGateOption[] = [
  { id: "CNOT", label: "CNOT", explanation: "Flips the target if the control is |1⟩." },
  { id: "CZ", label: "CZ", explanation: "Flips the phase of |11⟩ only." },
  { id: "SWAP", label: "SWAP", explanation: "Exchanges the two qubits' states." },
];
