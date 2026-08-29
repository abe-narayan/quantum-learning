import { StateVector } from "@/lib/quantum/state";
import { applySingleQubitGate, applyCNOT, HADAMARD } from "@/lib/quantum/gates";
import { measureQubit } from "@/lib/quantum/measurement";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const ghzStep0 = StateVector.zero(3);
const ghzStep1 = applySingleQubitGate(ghzStep0, HADAMARD, 0);
const ghzStep2 = applyCNOT(ghzStep1, 0, 1);
const ghzStep3 = applyCNOT(ghzStep2, 0, 2);
const measured = measureQubit(ghzStep3, 0, 0.9); // forces outcome 1

function ketLatex(state: StateVector): string {
  const terms = state.amplitudes
    .map((amplitude, index) => ({ amplitude, label: state.basisLabel(index) }))
    .filter(({ amplitude }) => amplitude.magnitudeSquared() > 1e-9);
  return terms.map(({ amplitude, label }) => `(${formatAmplitudeLatex(amplitude)})|${label}\\rangle`).join(" + ");
}

export const ghzCollapseAfterMeasuringQubitZero: MultipleChoiceProblem = {
  meta: {
    slug: "ghz-collapse-after-measuring-qubit-zero",
    title: "Collapsing the GHZ State by Measuring Qubit 0",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/building-quantum-circuits",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["ghz", "measurement", "collapse"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/building-quantum-circuits"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "You measure qubit 0 of the GHZ state $\\frac{1}{\\sqrt2}(|000\\rangle+|111\\rangle)$ and get outcome 1. What does the full 3-qubit state become?",
    options: [
      { id: "a", text: `$${ketLatex(measured.collapsed)}$` },
      { id: "b", text: "$(1.00)|100\\rangle$" },
      {
        id: "c",
        text: "$(0.50)|100\\rangle + (0.50)|101\\rangle + (0.50)|110\\rangle + (0.50)|111\\rangle$",
      },
      { id: "d", text: "$(0.71)|000\\rangle + (0.71)|111\\rangle$, unchanged." },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This would mean only qubit 0 changed while qubits 1 and 2 stayed at $|0\\rangle$ — but the GHZ state's entanglement forces all three qubits to agree, not just qubit 0.",
      c: "This treats qubits 1 and 2 as if they were still undetermined after measuring qubit 0 — but the GHZ state has zero amplitude on any outcome where the three qubits disagree, so this superposition can't be right.",
      d: "Measurement is not the identity operation — it genuinely collapses the state onto the branch consistent with the observed outcome.",
    },
    defaultIncorrectFeedback: "Only one of the GHZ state's two nonzero terms is consistent with qubit 0 reading 1 — the state collapses onto that term alone.",
  },
  hints: [
    { text: "The GHZ state has only two nonzero terms: $|000\\rangle$ and $|111\\rangle$." },
    { text: "Only one of those two terms has qubit 0 equal to 1." },
    { text: "Measurement collapses the state onto the (renormalized) subspace consistent with the observed outcome — here, that's just the single surviving term." },
  ],
  solution: {
    steps: [
      { description: "Of the GHZ state's two nonzero terms, only $|111\\rangle$ has qubit 0 equal to 1; $|000\\rangle$ is eliminated." },
      { description: "The state collapses onto the single surviving term, renormalized (it's already normalized since it was the only survivor).", latex: `${ketLatex(measured.collapsed)}` },
    ],
    finalAnswer: `$${ketLatex(measured.collapsed)}$ — all three qubits become exactly determined and equal.`,
  },
  explanation: {
    correctIdea: "Because the GHZ state's only two possibilities have all three qubits agreeing, measuring even one qubit instantly determines the definite state of all three.",
    whyCorrect: "This is exactly the three-party correlation the lesson describes: measuring any one qubit of a GHZ state tells you, with certainty, what the other two are.",
    whyWrong: [
      { optionId: "b", text: "Flips qubit 0 and leaves the other two behind. The GHZ state has no branch where the three qubits disagree, so this term had zero amplitude to begin with." },
      { optionId: "c", text: "Leaves qubits 1 and 2 undetermined. Three of those four terms were never in the state at all." },
      { optionId: "d", text: "Treats measurement as leaving the state alone. It projects onto the branch consistent with the outcome." },
    ],
  },
};
