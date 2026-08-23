import type { BlochAngles } from "@/lib/quantum/bloch";

export type MixturePreset = {
  id: string;
  label: string;
  component1: BlochAngles;
  component2: BlochAngles;
  weight: number;
  narration: string;
};

const ZERO: BlochAngles = { theta: 0, phi: 0 };
const ONE: BlochAngles = { theta: Math.PI, phi: 0 };
const PLUS: BlochAngles = { theta: Math.PI / 2, phi: 0 };
const MINUS: BlochAngles = { theta: Math.PI / 2, phi: Math.PI };

export const MIXTURE_PRESETS: MixturePreset[] = [
  {
    id: "pure-0",
    label: "Pure |0⟩",
    component1: ZERO,
    component2: ONE,
    weight: 1,
    narration: "Weight 1 on |0⟩ — a pure state, sitting exactly on the sphere's surface.",
  },
  {
    id: "pure-plus",
    label: "Pure |+⟩",
    component1: PLUS,
    component2: MINUS,
    weight: 1,
    narration: "Weight 1 on |+⟩ — still pure, still on the surface, just at a different point.",
  },
  {
    id: "mix-0-1",
    label: "50/50 mix of |0⟩, |1⟩",
    component1: ZERO,
    component2: ONE,
    weight: 0.5,
    narration: "A classical coin flip between |0⟩ and |1⟩ — the point collapses to the exact center: I/2.",
  },
  {
    id: "mix-plus-minus",
    label: "50/50 mix of |+⟩, |−⟩",
    component1: PLUS,
    component2: MINUS,
    weight: 0.5,
    narration:
      "A different recipe — mixing |+⟩ and |−⟩ instead — lands on the exact same center point, I/2. Different ensembles, identical physical state.",
  },
  {
    id: "bell-partner",
    label: "One qubit of a Bell pair",
    component1: ZERO,
    component2: ONE,
    weight: 0.5,
    narration:
      "This is also exactly what tracing out an entangled partner from |Φ+⟩ produces — the reduced state is maximally mixed, even though the full 2-qubit state is perfectly pure.",
  },
  {
    id: "mostly-0",
    label: "90/10 mix of |0⟩, |1⟩",
    component1: ZERO,
    component2: ONE,
    weight: 0.9,
    narration: "A lopsided mixture — mostly |0⟩, a little |1⟩ — sits partway between the surface and the center.",
  },
];
