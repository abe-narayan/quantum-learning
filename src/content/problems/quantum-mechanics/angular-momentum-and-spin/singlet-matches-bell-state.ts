import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const singletMatchesBellState: MultipleChoiceProblem = {
  meta: {
    slug: "singlet-matches-bell-state",
    title: "Which Bell State Is the Spin Singlet?",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/addition-of-angular-momentum",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["addition-of-angular-momentum", "bell-states"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/addition-of-angular-momentum"],
  },
  question: {
    type: "multiple-choice",
    prompt: "The singlet |0,0⟩=(|↑↓⟩−|↓↑⟩)/√2 is identical to which Bell state from Quantum Gates & Circuits?",
    options: [
      { id: "a", text: "|Ψ⁻⟩ = (|01⟩−|10⟩)/√2" },
      { id: "b", text: "|Ψ⁺⟩ = (|01⟩+|10⟩)/√2" },
      { id: "c", text: "|Φ⁺⟩ = (|00⟩+|11⟩)/√2" },
      { id: "d", text: "|Φ⁻⟩ = (|00⟩−|11⟩)/√2" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "|Ψ⁺⟩ matches the triplet's m=0 state (the + sign), not the singlet (the − sign).",
      c: "|Φ⁺⟩ involves |00⟩ and |11⟩, but the singlet involves |01⟩ and |10⟩ (that is, ↑↓ and ↓↑). The basis terms are different.",
      d: "Same issue as |Φ⁺⟩: the basis terms are wrong for the singlet.",
    },
    defaultIncorrectFeedback: "Match the singlet's exact amplitude pattern (which basis terms, and which relative sign) against each Bell state directly.",
  },
  hints: [
    { text: "The singlet uses |↑↓⟩ and |↓↑⟩, matching |01⟩ and |10⟩ under the ↑↔0, ↓↔1 correspondence." },
    { text: "The singlet has a minus sign between the two terms." },
    { text: "Only one of the four options has both of those features at once: those two basis terms, and that sign between them." },
  ],
  solution: {
    steps: [{ description: "Matching basis terms (01,10) and relative sign (−) identifies the singlet exactly as |Ψ⁻⟩." }],
    finalAnswer: "|Ψ⁻⟩",
  },
  explanation: {
    correctIdea: "This is a vector identity, not an approximation, verified directly via the J²=0 eigenstate computation.",
    whyCorrect: "Relabel the spin arrows as computational basis states and the singlet's coefficients are already the Bell state's: an equal superposition of the two anti-aligned terms with a relative minus sign. The minus sign is what picks out this Bell state rather than any of the other three.",
    whyWrong: [
      { optionId: "b", text: "|Ψ⁺⟩ carries the plus sign, matching the triplet's m=0 state rather than the singlet." },
      { optionId: "c", text: "|Φ⁺⟩ is built from |00⟩ and |11⟩, but the singlet uses |01⟩ and |10⟩." },
      { optionId: "d", text: "|Φ⁻⟩ has the same wrong basis terms as |Φ⁺⟩, sign notwithstanding." },
    ],
  },
};
