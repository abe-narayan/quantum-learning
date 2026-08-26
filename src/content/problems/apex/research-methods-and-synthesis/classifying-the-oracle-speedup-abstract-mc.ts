import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const classifyingTheOracleSpeedupAbstractMc: MultipleChoiceProblem = {
  meta: {
    slug: "classifying-the-oracle-speedup-abstract-mc",
    title: "Classifying an 'Exponential Speedup' Abstract",
    course: "research-methods-and-synthesis",
    lesson: "apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "multiple-choice",
    tags: ["paper-reading", "oracle-separation", "abstract-vs-theorem", "claim-evaluation"],
    prerequisites: ["apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "Recall this lesson's illustrative worked example: the abstract claims an 'exponential speedup' for verifying a local Hamiltonian's ground-state energy, with no further qualification, while the paper's Theorem 4.2 proves an exponential separation only for algorithms restricted to black-box sparse-access queries to the Hamiltonian, and states no comparable result for the setting where the Hamiltonian is given explicitly. Which is the most precise assessment of the relationship between the abstract and the theorem?",
    options: [
      {
        id: "a",
        text: "The abstract's phrasing is technically accurate but incomplete: Theorem 4.2 is a real, correctly proved exponential separation in the black-box query model, and the abstract's unqualified wording risks readers assuming (incorrectly) that this is an unconditional result about explicitly-given Hamiltonians in general -- which, given that the problem is QMA-complete, it is not, and is not claimed to be.",
      },
      {
        id: "b",
        text: "The abstract and the theorem contradict each other, so the paper contains an error that should be corrected before publication.",
      },
      {
        id: "c",
        text: "Since the numerical experiments (up to 20 qubits) support the exponential speedup, the oracle-model restriction in Theorem 4.2 is just a technicality that the numerics already resolve for the explicit-Hamiltonian setting.",
      },
      {
        id: "d",
        text: "Because local Hamiltonian verification is QMA-complete, Theorem 4.2 must be false as stated, since no exponential quantum speedup can exist for a QMA-complete problem.",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "There is no contradiction: the theorem is narrower in scope than the abstract's wording suggests, not inconsistent with it. Precise oracle-model theorems narrower than their abstract's framing are extremely common and not, by themselves, errors.",
      c: "This is exactly the numerical-vs-proven misreading the lesson warns about. Numerics at n<=20 are evidence for the oracle-model theorem already proven, not independent evidence that the result extends to a different setting (explicitly-given Hamiltonians) that the theorem does not address at all.",
      d: "QMA-completeness is a statement about the explicitly-given-Hamiltonian setting; it says nothing about the black-box query model, where classical algorithms are handicapped to oracle access only. An oracle-model exponential separation is fully consistent with QMA-completeness of the real, explicitly-given problem.",
    },
    defaultIncorrectFeedback:
      "Reread the model/assumptions language in Theorem 4.2 ('black-box query access,' 'no explicit description of H's local terms') and ask specifically what setting the abstract's unqualified 'exponential speedup' would lead a reader to assume, versus what setting the theorem actually covers.",
  },
  hints: [
    { text: "What specific phrase in Theorem 4.2 restricts which algorithms the classical lower bound applies to?" },
    { text: "Is 'the explicit-Hamiltonian setting' the same setting Theorem 4.2 is proven in, or a different one?" },
    { text: "The correct option should neither call the paper wrong nor treat the numerics as closing the gap." },
  ],
  solution: {
    steps: [
      { description: "Theorem 4.2's classical lower bound holds only for algorithms restricted to black-box query access to O_H -- this is an oracle/query-model separation, not a statement about algorithms with an explicit description of H." },
      { description: "The abstract's 'exponential speedup,' stated without this qualification, would naturally be read as applying more broadly -- including to the explicit-Hamiltonian setting, where the problem is QMA-complete and no such unconditional result is proven or claimed." },
      { description: "The numerical experiments (n<=20) test instances within the same oracle-access construction the theorem already covers; they are corroborating evidence for that proven claim, not independent evidence for a broader, unproven one." },
    ],
    finalAnswer: "(a)",
  },
  explanation: {
    correctIdea:
      "A correctly proved oracle-model separation can still be described by an abstract in language broad enough to mislead a reader who never finds the numbered theorem -- the fix is reading the model/assumptions section, not doubting the theorem itself.",
    whyCorrect:
      "Option (a) correctly locates the gap precisely where this lesson's anatomy predicts it: between an unqualified abstract sentence and a theorem whose black-box restriction is stated explicitly in its own hypotheses, without accusing the paper of error or dismissing the result.",
    whyWrong: [
      "(b) mistakes narrower scope for contradiction.",
      "(c) lets small-scale numerics stand in for a proof extending to a setting the theorem never addressed.",
      "(d) misapplies QMA-completeness (a fact about the explicit setting) to rule out a theorem proven in an entirely different, oracle-restricted setting.",
    ],
  },
};
