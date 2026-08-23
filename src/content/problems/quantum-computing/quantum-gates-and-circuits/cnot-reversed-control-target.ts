import { StateVector } from "@/lib/quantum/state";
import { applyCNOT } from "@/lib/quantum/gates";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const input = StateVector.basis(2, 0b01); // |01⟩
const correct = applyCNOT(input, 1, 0); // control = qubit 1, target = qubit 0
const unaffected = input; // wrong guess: treating it as a no-op
const bitOrderReversed = StateVector.basis(2, 0b10); // wrong guess: reading the label's bit order backwards

function ketLatex(state: StateVector): string {
  const terms = state.amplitudes
    .map((amplitude, index) => ({ amplitude, label: state.basisLabel(index) }))
    .filter(({ amplitude }) => amplitude.magnitudeSquared() > 1e-9);
  return terms.map(({ amplitude, label }) => `(${formatAmplitudeLatex(amplitude)})|${label}\\rangle`).join(" + ");
}

export const cnotReversedControlTarget: MultipleChoiceProblem = {
  meta: {
    slug: "cnot-reversed-control-target",
    title: "CNOT With the Control and Target Swapped",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/controlled-gates-and-cnot",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["cnot", "control-target"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/controlled-gates-and-cnot"],
  },
  question: {
    type: "multiple-choice",
    prompt: "What is $\\text{CNOT}(\\text{control}=1,\\text{target}=0)$ applied to $|01\\rangle$?",
    options: [
      { id: "a", text: `$${ketLatex(correct)}$` },
      { id: "b", text: `$${ketLatex(unaffected)}$` },
      { id: "c", text: `$${ketLatex(bitOrderReversed)}$` },
      { id: "d", text: "$|00\\rangle$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This assumes nothing happens — but qubit 1 (the control here) is 1, so the target really is flipped.",
      c: "This reverses the bit order of the label. Qubit 0 is always the left digit and qubit 1 the right digit — only qubit 0 (the target) actually changes here.",
      d: "Both qubits changing at once isn't how CNOT works; only the target qubit ever flips, and only when the control is 1.",
    },
    defaultIncorrectFeedback: "Identify qubit 1's value first (it's the control here), then decide whether qubit 0 (the target) flips.",
  },
  hints: [
    { text: "In |01⟩, qubit 0 = 0 and qubit 1 = 1." },
    { text: "The control here is qubit 1, which equals 1 — so the target does flip." },
    { text: "The target is qubit 0: it flips from 0 to 1." },
  ],
  solution: {
    steps: [
      { description: "In $|01\\rangle$, qubit 0 = 0 and qubit 1 = 1." },
      { description: "Control = qubit 1 = 1, so the target (qubit 0) flips: $0 \\to 1$." },
    ],
    finalAnswer: `$${ketLatex(correct)}$`,
  },
  explanation: {
    correctIdea: "Which qubit is the control and which is the target is a choice you make explicitly — swapping them changes the gate's action.",
    whyCorrect: "With qubit 1 as control (value 1), the target qubit 0 flips, turning |01⟩ into |11⟩.",
    whyWrong: [
      "Assuming nothing happens (option b) ignores that qubit 1 — the actual control here — is 1, so the flip really does occur.",
      "Swapping which digit represents which qubit (option c) misreads the |10⟩ label; only qubit 0, the target, changes value.",
    ],
  },
};
