import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const localHamiltonianPropagationTermNullSpaceMc: MultipleChoiceProblem = {
  meta: {
    slug: "local-hamiltonian-propagation-term-null-space-mc",
    title: "Which Slice Does the Propagation Term Accept?",
    course: "quantum-complexity-theory",
    lesson: "apex/quantum-complexity-theory/the-local-hamiltonian-problem",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "multiple-choice",
    tags: ["local-hamiltonian", "kitaev-construction", "history-state", "propagation-term"],
    prerequisites: ["apex/quantum-complexity-theory/the-local-hamiltonian-problem"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "In the lesson's toy history-state example, U1 = X (so U1|0> = |1> and U1|1> = |0>), and the propagation term H_prop,1 penalizes clock/computation mismatches between t=0 and t=1. Written in the basis {|0,0>, |0,1>, |1,0>, |1,1>} (clock qubit first), which of the following states has zero energy under H_prop,1?",
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
      b: "This pairs clock=0, computation=|0> with clock=1, computation=|0>. But U1|0>=|1>, not |0>, so the computational register did not transition correctly. This is the lesson's 'wrong transition slice', with energy 0.5 rather than 0.",
      c: "This pairs clock=0, computation=|1> with clock=1, computation=|1>. But U1|1>=|0>, not |1>, so this is not a valid U1-transition of any single |phi> across both terms.",
      d: "The magnitudes match a valid transition, but the relative minus sign breaks the cancellation the propagation term relies on. The cross terms (built from U1 acting between clock values) cancel the diagonal terms only when the two amplitudes carry the same relative sign, as in (|0,0> + |1,1>)/sqrt(2).",
    },
    defaultIncorrectFeedback:
      "The propagation term's zero-energy (ground) space consists exactly of states of the form (|t-1>|phi> + |t>*U_t|phi>)/sqrt(2) for some |phi>. Check which option has this form with U1=X.",
  },
  hints: [
    { text: "The propagation term penalizes any pairing where the clock advances but the computational register does not follow the gate. Ask what a state that escapes that penalty has to look like." },
    { text: "The general zero-energy form is (|t-1>|phi> + |t> U_t|phi>)/sqrt(2) for a single |phi>, the same |phi> in both halves." },
    { text: "With U1=X, take |phi>=|0>: then U1|phi>=|1>, and the two halves pair the clock value with its own register content. The relative sign has to stay positive for the cross terms to cancel." },
  ],
  solution: {
    steps: [
      { description: "The propagation term's zero-energy subspace is spanned by states (|t-1>|phi> + |t>U_t|phi>)/sqrt(2) for arbitrary |phi>, verified directly in the lesson by matrix computation." },
      { description: "With U1=X, taking |phi>=|0> gives U1|phi>=|1>, so the valid zero-energy state is (|0,0> + |1,1>)/sqrt(2)." },
      { description: "The lesson's computed energies confirm this. The correctly-transitioning slice (|0,0> + |1,1>)/sqrt(2) has energy 0, while the unchanged-register slice (|0,0> + |1,0>)/sqrt(2) has energy 0.5." },
    ],
    finalAnswer: "(|0,0> + |1,1>) / sqrt(2)",
  },
  explanation: {
    correctIdea:
      "The propagation term assigns zero energy exactly to superpositions that correctly apply the circuit's next gate between adjacent clock values, and positive energy to everything else.",
    whyCorrect:
      "H_prop,1 annihilates (|0,0>+|1,1>)/sqrt(2) because that state encodes the statement 'clock 1's register is U1 applied to clock 0's register', which is what the term was built to leave unpenalized.",
    whyWrong: [
      { optionId: "b", text: "Leaves the computational register unchanged across the clock transition, which U1=X does not do." },
      { optionId: "c", text: "Pairs the wrong output of U1 with the input |1>." },
      { optionId: "d", text: "Has the right magnitudes but the wrong relative sign, breaking the cancellation between the diagonal and cross terms." },
    ],
  },
};
