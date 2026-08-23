import type { SingleQubitGateId } from "./gateDefinitions";

export type PresetStep =
  | { kind: "reset" }
  | { kind: "gate"; gate: SingleQubitGateId; qubit: 0 | 1 }
  | { kind: "cnot" }
  | { kind: "measure"; qubit: 0 | 1 };

export type Preset = {
  id: string;
  title: string;
  /** Shown before the steps run. */
  description: string;
  /** Shown once the steps finish. */
  result: string;
  steps: PresetStep[];
};

export const GUIDED_PRESETS: Preset[] = [
  {
    id: "start",
    title: "Start with |00⟩",
    description: "Both qubits definitely 0 — no superposition, no correlation, nothing interesting yet.",
    result: "This is the starting point every circuit in this course begins from.",
    steps: [{ kind: "reset" }],
  },
  {
    id: "plus-plus",
    title: "Create |++⟩",
    description: "Apply H to both qubits — each becomes its own independent superposition.",
    result:
      "Four equally likely outcomes, but this is still a product state: qubit 0 and qubit 1 don't know anything about each other.",
    steps: [{ kind: "reset" }, { kind: "gate", gate: "H", qubit: 0 }, { kind: "gate", gate: "H", qubit: 1 }],
  },
  {
    id: "bell",
    title: "Create a Bell state",
    description: "H on qubit 0, then CNOT — watch the qubits become entangled.",
    result: "(|00⟩ + |11⟩)/√2 — check the entanglement indicator and the correlation view below.",
    steps: [{ kind: "reset" }, { kind: "gate", gate: "H", qubit: 0 }, { kind: "cnot" }],
  },
  {
    id: "measure-bell",
    title: "Measure a Bell state",
    description: "Prepares a Bell state, then measures qubit 0 — watch qubit 1 collapse too, instantly.",
    result: "Measure qubit 1 next: it will always agree with qubit 0's outcome, every time.",
    steps: [
      { kind: "reset" },
      { kind: "gate", gate: "H", qubit: 0 },
      { kind: "cnot" },
      { kind: "measure", qubit: 0 },
    ],
  },
  {
    id: "reset",
    title: "Reset",
    description: "Back to |00⟩.",
    result: "",
    steps: [{ kind: "reset" }],
  },
];
