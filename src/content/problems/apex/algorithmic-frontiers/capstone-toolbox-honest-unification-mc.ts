import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const capstoneToolboxHonestUnificationMc: MultipleChoiceProblem = {
  meta: {
    slug: "capstone-toolbox-honest-unification-mc",
    title: "What QSVT Does and Doesn't Prove",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/capstone-the-toolbox-that-ate-quantum-algorithms",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "multiple-choice",
    tags: ["capstone", "synthesis", "qsvt", "block-encoding"],
    prerequisites: [
      "apex/algorithmic-frontiers/the-quantum-singular-value-transformation",
      "apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems",
    ],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "This capstone shows Grover's algorithm, Hamiltonian simulation, and linear-systems solving are all QSVT with a different polynomial P(x). Which statement about this unification is the capstone's actual, calibrated claim?",
    options: [
      {
        id: "a",
        text: "QSVT explains each algorithm as one instance of a shared construction, and for some (like Hamiltonian simulation) matches or improves the original's asymptotic scaling — but finding a good block encoding or a good polynomial for a new problem can each still be genuinely hard, unsolved research questions",
      },
      {
        id: "b",
        text: "QSVT proves the original diffusion-operator Grover circuit, first-order Trotter-Suzuki formulas, and the original HHL circuit were all incorrect and should no longer be used",
      },
      {
        id: "c",
        text: "Once a block encoding of any matrix is available, QSVT automatically finds the optimal polynomial for any target function with no further research needed",
      },
      {
        id: "d",
        text: "Because all four algorithms reduce to the same construction, they must all now share exactly the same query complexity",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Nothing in the older constructions was wrong; the capstone is explicit that QSVT explains them as instances of one framework rather than invalidating any of them.",
      c: "QSVT guarantees a feasible polynomial *can* be realized as a circuit once you have one — it doesn't hand you the polynomial itself; finding a good approximation to a new target function is still real approximation-theory work.",
      d: "The capstone's own comparison shows the opposite: Grover-via-QSVT exactly reproduces Θ(√N) (no improvement, since it was already optimal), while QSVT-based Hamiltonian simulation provably beats naive first-order Trotter's scaling — the framework unifies the construction, not the cost.",
    },
    defaultIncorrectFeedback:
      "Recall the capstone's explicit distinction between 'QSVT organizes and often improves on these algorithms' and overclaims like 'QSVT makes them identical or makes algorithm design solved'.",
  },
  hints: [
    { text: "The capstone repeatedly warns against two specific overclaims: that older algorithms are now 'wrong', and that QSVT makes new algorithm design automatic." },
    { text: "Two things QSVT does not hand you for free are named directly in the lesson: a good block encoding, and a good polynomial approximation." },
    { text: "Check the query-complexity comparison: does every unified algorithm end up with the same cost, or does the framework unify the construction while costs still differ?" },
  ],
  solution: {
    steps: [
      { description: "The capstone frames QSVT as an organizing principle and design tool, not a magic wand." },
      { description: "It explicitly lists what remains hard: constructing an efficient block encoding for a new matrix, and finding a good polynomial approximation for a new target function." },
      { description: "It also shows the unification does not equalize costs: Grover-via-QSVT matches (not beats) Θ(√N), while QSVT-based Hamiltonian simulation beats first-order Trotter's derived scaling." },
    ],
    finalAnswer: "(a)",
  },
  explanation: {
    correctIdea: "QSVT is a genuine, powerful organizing/design framework, evaluated honestly: it explains and sometimes improves on older constructions, without making block-encoding or polynomial-approximation research obsolete.",
    whyCorrect: "This mirrors the capstone's explicit 'what remains genuinely open' section and its worked query-complexity comparison.",
    whyWrong: ["Options b, c, and d each state an overclaim the lesson explicitly warns against."],
  },
};
