import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { HADAMARD, applySingleQubitGate } from "@/lib/quantum/gates";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const plusState = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
const pPlusForPlusState = applySingleQubitGate(plusState, HADAMARD, 0).probabilities()[0];

export const stateWithCertainPlusOutcome: MultipleChoiceProblem = {
  meta: {
    slug: "state-with-certain-plus-outcome",
    title: "Which State Gives P(+) = 1?",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/measurement-and-probability",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["measurement", "born-rule", "x-basis"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/measurement-and-probability"],
  },
  question: {
    type: "multiple-choice",
    prompt: "For which of these states is $P(+)=1$ exactly, meaning measuring in the X-basis is certain to give the outcome $+$?",
    options: [
      { id: "a", text: "$|+\\rangle$" },
      { id: "b", text: "$|0\\rangle$" },
      { id: "c", text: "$|1\\rangle$" },
      { id: "d", text: "$|{-i}\\rangle$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "$|0\\rangle$ gives $P(+)=P(-)=\\frac12$ — an even coin flip in the X-basis, not certainty.",
      c: "$|1\\rangle$ also gives $P(+)=P(-)=\\frac12$, the same as $|0\\rangle$: both poles are equally split between $+$ and $-$.",
      d: "$|{-i}\\rangle$ sits on the equator too, but 90° of longitude away from $|+\\rangle$ — as far as possible while staying on the equator, giving $P(+)=\\frac12$, not certainty.",
    },
    defaultIncorrectFeedback: "Use $P(+)=\\left|\\frac{\\alpha+\\beta}{\\sqrt2}\\right|^2$ and check which option's amplitudes make this exactly 1.",
  },
  hints: [
    { text: "P(+) = 1 means the state overlaps completely with |+⟩ — in other words, it IS |+⟩, up to a phase that doesn't matter." },
    { text: "Try each option's amplitudes in the X-basis formula and see which one gives exactly 1." },
    { text: "Certainty in a basis means the state is already one of that basis's own states, so ask which option lives in the X basis." },
  ],
  solution: {
    steps: [
      { description: "P(+) = 1 requires the state's overlap with $|+\\rangle$ to have magnitude 1, which only happens when the state equals $|+\\rangle$ itself." },
      {
        description: "Check directly: applying H to $|+\\rangle$ gives $|0\\rangle$ exactly, so measuring afterward (equivalent to X-basis measurement) always returns the $+$ outcome.",
        latex: `P(+)_{|+\\rangle} = ${pPlusForPlusState.toFixed(4)}`,
      },
    ],
    finalAnswer: "$|+\\rangle$",
  },
  explanation: {
    correctIdea: "Certainty in a given basis requires the state to BE one of that basis's own states.",
    whyCorrect: "|+⟩ measured in the X-basis is the trivial case: you're asking 'is this + or -?' of a state that already is +.",
    whyWrong: [
      { optionId: "b", text: "Certain in the Z basis, not the X basis. Reading a pole as certain in every basis is the usual slip here." },
      { optionId: "c", text: "The other pole, and equally split in the X basis for the same reason." },
      { optionId: "d", text: "On the equator, so it has the right latitude, but a quarter turn round in φ, which gives maximal X-basis uncertainty rather than certainty." },
    ],
  },
};
