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
      { id: "d", text: "$(-0.71)|10\\rangle$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The state cannot stay in superposition once an outcome is observed. Only the terms consistent with qubit 0 = 1 survive.",
      c: "That is the collapse for outcome 0, not outcome 1: it keeps the |01⟩ term instead of the |10⟩ term.",
      d: "Right term, wrong normalization. This is the surviving amplitude straight out of |Ψ−⟩, still −1/√2. Collapse divides it by √P(1) = √(1/2), which rescales it to −1.",
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
    whyCorrect: "The |10⟩ term's original amplitude, -1/√2, divided by √(1/2), gives −1, a global phase on |10⟩ and so physically the same measured state as |10⟩.",
    whyWrong: [
      { optionId: "b", text: "Keeps the superposition alive, which ignores that observing an outcome is what collapse means." },
      { optionId: "c", text: "This is the collapse for outcome 0: it renormalizes the |01⟩ term instead of the |10⟩ term." },
      { optionId: "d", text: "Drops the renormalization step. The surviving amplitude −1/√2 has to be divided by √P(1) so the collapsed state has total probability 1." },
    ],
  },
};
