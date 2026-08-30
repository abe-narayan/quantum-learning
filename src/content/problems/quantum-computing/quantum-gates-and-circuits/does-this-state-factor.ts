import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { HADAMARD, PAULI_Z, applySingleQubitGate } from "@/lib/quantum/gates";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

// The target state: (1/2)(|00> + |01> + |10> - |11>).
const target = new StateVector([new Complex(0.5), new Complex(0.5), new Complex(0.5), new Complex(-0.5)]);

// Candidate product states, built the same way the lesson builds |0>⊗|+>.
const plusState = applySingleQubitGate(new StateVector([Complex.ONE, Complex.ZERO]), HADAMARD, 0);
const minusState = applySingleQubitGate(plusState, PAULI_Z, 0);

const plusPlus = plusState.tensor(plusState);
const plusMinus = plusState.tensor(minusState);
const minusPlus = minusState.tensor(plusState);

function statesAgree(a: StateVector, b: StateVector): boolean {
  return a.amplitudes.every((amp, i) => amp.equals(b.amplitudes[i], 1e-9));
}

// Verify none of the three candidate product states match the target,
// confirming by direct engine computation (not just hand algebra) that it
// does not factor as any of the "obvious" candidates.
if (statesAgree(target, plusPlus) || statesAgree(target, plusMinus) || statesAgree(target, minusPlus)) {
  throw new Error("does-this-state-factor: an option unexpectedly matches the target state");
}

export const doesThisStateFactor: MultipleChoiceProblem = {
  meta: {
    slug: "does-this-state-factor",
    title: "Does This State Factor as a Product State?",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors",
    difficulty: "intermediate",
    estimatedMinutes: 7,
    problemType: "multiple-choice",
    tags: ["entanglement", "product-states", "factorization"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Does $\\frac12(|00\\rangle+|01\\rangle+|10\\rangle-|11\\rangle)$ factor as a product state $|a\\rangle\\otimes|b\\rangle$?",
    options: [
      { id: "a", text: "Yes, it equals $|+\\rangle\\otimes|+\\rangle$." },
      { id: "b", text: "Yes, it equals $|+\\rangle\\otimes|-\\rangle$." },
      { id: "c", text: "No; it is entangled, not a product." },
      { id: "d", text: "Yes, it equals $|-\\rangle\\otimes|+\\rangle$." },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "c",
    optionFeedback: {
      a: "$|+\\rangle\\otimes|+\\rangle=\\frac12(|00\\rangle+|01\\rangle+|10\\rangle+|11\\rangle)$, where every coefficient is $+\\frac12$. The target carries $-\\frac12$ on $|11\\rangle$.",
      b: "$|+\\rangle\\otimes|-\\rangle=\\frac12(|00\\rangle-|01\\rangle+|10\\rangle-|11\\rangle)$, whose sign on $|01\\rangle$ does not match the target.",
      d: "$|-\\rangle\\otimes|+\\rangle=\\frac12(|00\\rangle+|01\\rangle-|10\\rangle-|11\\rangle)$, whose sign on $|10\\rangle$ does not match the target.",
    },
    defaultIncorrectFeedback:
      "Set up the four coefficient equations $a_0b_0=\\frac12$, $a_0b_1=\\frac12$, $a_1b_0=\\frac12$, $a_1b_1=-\\frac12$ and look for a contradiction, the same method as the lesson's Bell-numerator proof.",
  },
  hints: [
    { text: "Match coefficients: $a_0b_0=\\frac12$, $a_0b_1=\\frac12$, $a_1b_0=\\frac12$, $a_1b_1=-\\frac12$." },
    { text: "From $a_0b_0=a_0b_1$ (both $\\frac12$) and $a_0\\neq0$, conclude $b_0=b_1$." },
    { text: "But then $a_1b_0$ and $a_1b_1$ would have to be equal too (since $b_0=b_1$). Check whether that is consistent with the required values $\\frac12$ and $-\\frac12$." },
  ],
  solution: {
    steps: [
      { description: "Match coefficients against $|a\\rangle\\otimes|b\\rangle=a_0b_0|00\\rangle+a_0b_1|01\\rangle+a_1b_0|10\\rangle+a_1b_1|11\\rangle$.", latex: "a_0b_0=\\tfrac12,\\ a_0b_1=\\tfrac12,\\ a_1b_0=\\tfrac12,\\ a_1b_1=-\\tfrac12" },
      { description: "Since $a_0b_0=a_0b_1\\neq0$, $a_0\\neq0$, so $b_0=b_1$." },
      { description: "But then $a_1b_0=a_1b_1$ would be required, yet the target needs $a_1b_0=\\frac12$ and $a_1b_1=-\\frac12$, which are unequal. No such $a_0,a_1,b_0,b_1$ exist." },
    ],
    finalAnswer: "No. This state is entangled; it cannot be factored as any product state.",
  },
  explanation: {
    correctIdea: "A quick check against the 'obvious' candidate product states (built from $|\\pm\\rangle$) is useful, but only a full coefficient-matching argument proves factorization is impossible in general.",
    whyCorrect: "The contradiction ($b_0=b_1$ forced, yet $a_1b_0\\neq a_1b_1$ required) is airtight and doesn't depend on which candidate product states happen to have been tried.",
    whyWrong: [
      { optionId: "a", text: "A real product state, with all four coefficients positive. The target carries a minus on |11⟩." },
      { optionId: "b", text: "A real product state whose minus signs land on |01⟩ and |11⟩, not on |11⟩ alone." },
      { optionId: "d", text: "A real product state whose minus signs land on |10⟩ and |11⟩. A single minus sign on |11⟩ is the pattern no product state can produce." },
    ],
  },
};
