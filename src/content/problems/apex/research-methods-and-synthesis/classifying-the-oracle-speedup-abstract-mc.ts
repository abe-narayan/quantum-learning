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
        text: "The abstract is accurate but incomplete: Theorem 4.2 proves a real separation in the query model, and its wording invites over-reading",
      },
      {
        id: "b",
        text: "The abstract and the theorem describe different settings, so the paper's framing is an error that review should have caught before publication",
      },
      {
        id: "c",
        text: "The numerical experiments up to 20 qubits already cover the explicit-Hamiltonian setting, so the oracle restriction is a formality in practice",
      },
      {
        id: "d",
        text: "Local Hamiltonian verification is QMA-complete, so no exponential speedup can exist for it and Theorem 4.2 must be misstated as written",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Reads a difference in scope as an inconsistency. The theorem is narrower than the abstract's wording suggests, and a narrow theorem under a broad abstract is the ordinary shape of a paper, not a defect review should have blocked.",
      c: "This is the numerical-versus-proven misreading the lesson warns about. Numerics at n<=20 are evidence for the oracle-model theorem already proven, not independent evidence that the result extends to a different setting (explicitly-given Hamiltonians) the theorem does not address.",
      d: "Applies a statement about one setting to another. QMA-completeness concerns the explicitly-given Hamiltonian; Theorem 4.2 concerns a classical algorithm restricted to oracle access, which is a handicap QMA-completeness says nothing about. The two claims sit side by side without conflict.",
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
      { description: "Theorem 4.2's classical lower bound holds only for algorithms restricted to black-box query access to O_H. That is an oracle/query-model separation, not a statement about algorithms with an explicit description of H." },
      { description: "The abstract's 'exponential speedup', stated without this qualification, would naturally be read as applying more broadly, including to the explicit-Hamiltonian setting, where the problem is QMA-complete and no such unconditional result is proven or claimed." },
      { description: "The numerical experiments (n<=20) test instances within the same oracle-access construction the theorem already covers; they are corroborating evidence for that proven claim, not independent evidence for a broader, unproven one." },
    ],
    finalAnswer: "The abstract is accurate but incomplete: Theorem 4.2 is a real separation in the black-box query model, and the unqualified wording invites a broader reading the theorem never claims.",
  },
  explanation: {
    correctIdea:
      "A correctly proved oracle-model separation can still be described by an abstract in language broad enough to mislead a reader who never finds the numbered theorem. The fix is reading the model/assumptions section, not doubting the theorem itself.",
    whyCorrect:
      "This locates the gap where the lesson's anatomy predicts it: between an unqualified abstract sentence and a theorem whose black-box restriction sits in its own hypotheses, without accusing the paper of error or dismissing the result.",
    whyWrong: [
      { optionId: "b", text: "Mistakes narrower scope for contradiction." },
      { optionId: "c", text: "Lets small-scale numerics stand in for a proof extending to a setting the theorem never addressed." },
      { optionId: "d", text: "Applies QMA-completeness, a fact about the explicit setting, to rule out a theorem proven in an oracle-restricted one." },
    ],
  },
};
