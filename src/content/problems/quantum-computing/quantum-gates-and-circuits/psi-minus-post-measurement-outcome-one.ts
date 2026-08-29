import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { measureQubit } from "@/lib/quantum/measurement";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const psiMinus = new StateVector([Complex.ZERO, new Complex(Math.SQRT1_2), new Complex(-Math.SQRT1_2), Complex.ZERO]); // (|01⟩-|10⟩)/√2
const result = measureQubit(psiMinus, 0, 0.9); // random >= P(qubit0=0)=0.5, forces outcome 1
const collapsed = result.collapsed;
const stillSuperposed = psiMinus; // wrong guess: state unchanged
const wrongOutcomeCollapse = measureQubit(psiMinus, 0, 0.1).collapsed; // wrong guess: the outcome-0 collapse instead

function ketLatex(state: StateVector): string {
  const terms = state.amplitudes
    .map((amplitude, index) => ({ amplitude, label: state.basisLabel(index) }))
    .filter(({ amplitude }) => amplitude.magnitudeSquared() > 1e-9);
  return terms.map(({ amplitude, label }) => `(${formatAmplitudeLatex(amplitude)})|${label}\\rangle`).join(" + ");
}

export const psiMinusPostMeasurementOutcomeOne: MultipleChoiceProblem = {
  meta: {
    slug: "psi-minus-post-measurement-outcome-one",
    title: "Collapsing |Ψ−⟩ After Measuring Qubit 0",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/multi-qubit-measurement",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "multiple-choice",
    tags: ["partial-measurement", "entanglement", "collapse"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/multi-qubit-measurement"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "For $|\\Psi^-\\rangle = \\frac{1}{\\sqrt2}(|01\\rangle-|10\\rangle)$, qubit 0 is measured and the outcome is 1. What is the post-measurement state?",
    options: [
      { id: "a", text: `$${ketLatex(collapsed)}$` },
      { id: "b", text: `$${ketLatex(stillSuperposed)}$` },
      { id: "c", text: `$${ketLatex(wrongOutcomeCollapse)}$` },
      { id: "d", text: "$(-0.71)|01\\rangle + (0.71)|10\\rangle$, unchanged" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The state can't stay in superposition after a measurement outcome is observed — only the term(s) consistent with qubit 0 = 1 can survive.",
      c: "That's the collapse for outcome 0, not outcome 1 — it keeps the |01⟩ term instead of the |10⟩ term.",
      d: "This keeps both terms, which contradicts the outcome having actually been observed — a measured outcome collapses the state to only the consistent term(s).",
    },
    defaultIncorrectFeedback: "Only the basis term(s) with qubit 0 = 1 can survive; zero out the rest and renormalize what's left.",
  },
  hints: [
    { text: "Only one of |Ψ−⟩'s two terms has qubit 0 = 1: the |10⟩ term." },
    { text: "Zero out the |01⟩ term (qubit 0 = 0, inconsistent with the outcome) and keep only the |10⟩ term." },
    { text: "Renormalize the surviving amplitude by dividing by √P(qubit 0=1) = √(1/2)." },
  ],
  solution: {
    steps: [
      { description: "Only the $|10\\rangle$ term has qubit 0 = 1; the $|01\\rangle$ term is zeroed out." },
      {
        description: "Renormalize the surviving amplitude, $-\\frac{1}{\\sqrt2}$, by dividing by $\\sqrt{P(1)}=\\sqrt{1/2}$.",
        latex: "\\frac{-1/\\sqrt2}{\\sqrt{1/2}} = -1",
      },
    ],
    finalAnswer: `$${ketLatex(collapsed)}$`,
  },
  explanation: {
    correctIdea: "Measuring outcome 1 zeros out the |01⟩ term and renormalizes the surviving |10⟩ term, including its original minus sign.",
    whyCorrect: "The |10⟩ term's original amplitude, -1/√2, divided by √(1/2), gives exactly -1 — a global phase on |10⟩, physically the same measured state as |10⟩.",
    whyWrong: [
      { optionId: "b", text: "Keeps the superposition alive, which ignores that observing an outcome is what collapse means." },
      { optionId: "c", text: "This is the collapse for outcome 0: it renormalizes the |01⟩ term instead of the |10⟩ term." },
      { optionId: "d", text: "Keeps both terms, contradicting the fact that an outcome was observed at all." },
    ],
  },
};
