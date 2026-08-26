import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const localHamiltonianPropagationTermNullSpaceMc: MultipleChoiceProblem = {
  meta: {
    slug: "local-hamiltonian-propagation-term-null-space-mc",
    title: "Which Slice Does the Propagation Term Accept?",
    course: "quantum-complexity-theory",
    lesson: "apex/quantum-complexity-theory/the-local-hamiltonian-problem",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "multiple-choice",
    tags: ["local-hamiltonian", "kitaev-construction", "history-state", "propagation-term"],
    prerequisites: ["apex/quantum-complexity-theory/the-local-hamiltonian-problem"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "In the lesson's toy history-state example, U1 = X (so U1|0> = |1> and U1|1> = |0>), and the propagation term H_prop,1 penalizes clock/computation mismatches between t=0 and t=1. Written in the basis {|0,0>, |0,1>, |1,0>, |1,1>} (clock qubit first), which of the following states has ZERO energy under H_prop,1?",
    options: [
      { id: "a", text: "(|0,0> + |1,1>) / sqrt(2)" },
      { id: "b", text: "(|0,0> + |1,0>) / sqrt(2)" },
      { id: "c", text: "(|0,1> + |1,1>) / sqrt(2)" },
      { id: "d", text: "(|0,0> - |1,1>) / sqrt(2)" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This pairs clock=0, computation=|0> with clock=1, computation=|0> -- but U1|0>=|1>, not |0>, so the computational register did NOT correctly transition. This is exactly the lesson's 'wrong transition slice,' with energy 0.5, not 0.",
      c: "This pairs clock=0, computation=|1> with clock=1, computation=|1> -- but U1|1>=|0>, not |1>, so this is not a valid U1-transition of any single |phi> consistently across both terms.",
      d: "The magnitudes match a valid transition, but the relative minus sign breaks the cancellation the propagation term relies on: the cross terms (built from U1 acting between clock values) only cancel the diagonal terms when the two amplitudes have the SAME relative sign, as in option (a).",
    },
    defaultIncorrectFeedback:
      "The propagation term's zero-energy (ground) space consists exactly of states of the form (|t-1>|phi> + |t>*U_t|phi>)/sqrt(2) for some |phi>. Check which option actually has this form with U1=X.",
  },
  hints: [
    { text: "The general zero-energy form is (|t-1>|phi> + |t> U_t|phi>)/sqrt(2) for some single |phi>." },
    { text: "With U1=X and |phi>=|0>, U1|phi>=|1>, so the correct pairing is |0,0> with |1,1>." },
    { text: "Try applying H_prop,1 = (1/2)(I - swap-via-U1) to each option and see which gives exactly zero, as the lesson's worked example computes directly." },
  ],
  solution: {
    steps: [
      { description: "The propagation term's zero-energy subspace is spanned by states (|t-1>|phi> + |t>U_t|phi>)/sqrt(2) for arbitrary |phi>, verified directly in the lesson by matrix computation." },
      { description: "With U1=X, taking |phi>=|0> gives U1|phi>=|1>, so the valid zero-energy state is (|0,0> + |1,1>)/sqrt(2), option (a)." },
      { description: "The lesson's own computed values confirm this: toyPropagationEnergyOnCorrectSlice (option a's state) is ~0, while toyPropagationEnergyOnWrongSlice (option b's state) is exactly 0.5." },
    ],
    finalAnswer: "(a)",
  },
  explanation: {
    correctIdea:
      "The propagation term assigns zero energy exactly to superpositions that correctly apply the circuit's next gate between adjacent clock values, and positive energy to everything else.",
    whyCorrect:
      "This is the lesson's own directly-verified computation: H_prop,1 annihilates (|0,0>+|1,1>)/sqrt(2) exactly, because it correctly encodes 'clock 1's register is U1 applied to clock 0's register.'",
    whyWrong: [
      "Option (b) leaves the computational register unchanged across the clock transition, which U1=X does not do.",
      "Option (c) pairs the wrong output of U1 with the input |1>.",
      "Option (d) has the right magnitudes but the wrong relative sign, breaking the exact cancellation between the diagonal and cross terms.",
    ],
  },
};
