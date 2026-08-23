import { StateVector } from "@/lib/quantum/state";
import { HADAMARD, PAULI_X, applySingleQubitGate } from "@/lib/quantum/gates";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const afterFirstH = applySingleQubitGate(StateVector.basis(1, 1), HADAMARD, 0);
const afterX = applySingleQubitGate(afterFirstH, PAULI_X, 0);
const result = applySingleQubitGate(afterX, HADAMARD, 0);

function ketLatex(state: StateVector): string {
  const terms = state.amplitudes
    .map((amplitude, index) => ({ amplitude, label: state.basisLabel(index) }))
    .filter(({ amplitude }) => amplitude.magnitudeSquared() > 1e-9);
  return terms.map(({ amplitude, label }) => `(${formatAmplitudeLatex(amplitude)})|${label}\\rangle`).join(" + ");
}

export const hxhIdentity: MultipleChoiceProblem = {
  meta: {
    slug: "hxh-identity",
    title: "The HXH Identity",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/building-qubit-circuits",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "multiple-choice",
    tags: ["circuits", "composition", "identities"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/building-qubit-circuits"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Compute $HXH|1\\rangle$ (apply the rightmost $H$ first, then $X$, then the outer $H$). What state results?",
    options: [
      { id: "a", text: `$${ketLatex(result)}$` },
      { id: "b", text: "$|1\\rangle$" },
      { id: "c", text: "$|0\\rangle$" },
      { id: "d", text: "$-|0\\rangle$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "That would mean HXH does nothing to |1⟩, but tracking the three gates step by step actually picks up a sign flip.",
      c: "H alone would send |1⟩ to |−⟩, not to |0⟩ — you may be skipping the X and second H steps.",
      d: "Close on the sign, but check which basis state — HXH sends |1⟩ back to (a phase of) itself, not to |0⟩.",
    },
    defaultIncorrectFeedback: "Track the state through each gate individually: |1⟩ → (H) → (X) → (H), the same method the lesson uses for HZH=X.",
  },
  hints: [
    { text: "First, apply H to |1⟩: this gives |−⟩." },
    { text: "Next, apply X to |−⟩. Recall X|0⟩=|1⟩ and X|1⟩=|0⟩, applied term by term to |−⟩ = (|0⟩−|1⟩)/√2." },
    { text: "Finally, apply H to whatever X|−⟩ turned out to be." },
  ],
  solution: {
    steps: [
      { description: "$H|1\\rangle = |-\\rangle = \\frac{1}{\\sqrt2}(|0\\rangle-|1\\rangle)$." },
      { description: "$X|-\\rangle = \\frac{1}{\\sqrt2}(X|0\\rangle-X|1\\rangle) = \\frac{1}{\\sqrt2}(|1\\rangle-|0\\rangle) = -|-\\rangle$." },
      { description: "$H(-|-\\rangle) = -H|-\\rangle = -|1\\rangle$, since $H|-\\rangle=|1\\rangle$.", latex: `HXH|1\\rangle = ${ketLatex(result)}` },
    ],
    finalAnswer: `$${ketLatex(result)}$`,
  },
  explanation: {
    correctIdea: "HXH = Z (up to how you track it): applying the identity to |1⟩ specifically gives −|1⟩, matching Z|1⟩=−|1⟩ exactly.",
    whyCorrect: "This is a genuine identity, checkable the same step-by-step way the lesson verifies HZH=X, just with the roles of X and Z swapped.",
    whyWrong: [
      "Stopping partway through the three-gate sequence and reporting an intermediate state.",
      "Dropping the sign that appears from X acting on |−⟩ — the −1 is a real part of the result, not something to discard as 'just a phase' (it's the whole difference between this answer and |1⟩ itself).",
    ],
  },
};
