import type { BlochAngles } from "@/lib/quantum/bloch";

export type StatePreset = {
  id: string;
  ket: string;
  angles: BlochAngles;
};

export const STATE_PRESETS: StatePreset[] = [
  { id: "0", ket: "|0⟩", angles: { theta: 0, phi: 0 } },
  { id: "1", ket: "|1⟩", angles: { theta: Math.PI, phi: 0 } },
  { id: "+", ket: "|+⟩", angles: { theta: Math.PI / 2, phi: 0 } },
  { id: "-", ket: "|−⟩", angles: { theta: Math.PI / 2, phi: Math.PI } },
  { id: "+i", ket: "|+i⟩", angles: { theta: Math.PI / 2, phi: Math.PI / 2 } },
  { id: "-i", ket: "|−i⟩", angles: { theta: Math.PI / 2, phi: (3 * Math.PI) / 2 } },
];
