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
        text: "QSVT explains each algorithm as an instance of one construction and sometimes improves its scaling, while block encodings stay research problems",
      },
      {
        id: "b",
        text: "QSVT unifies the constructions, and because the construction they share is identical, each ends up with the same query complexity once implemented",
      },
      {
        id: "c",
        text: "QSVT usually supplies the polynomial for a target function automatically; what remains hard is building a block encoding of the matrix",
      },
      {
        id: "d",
        text: "QSVT re-derives the three algorithms but improves on none of them, since a unification generally cannot outperform what it unifies",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The capstone's own comparison shows otherwise. Grover-via-QSVT reproduces Θ(√N), which was already optimal, while QSVT-based Hamiltonian simulation beats first-order Trotter. The construction is shared; the costs are not.",
      c: "This has the two halves the wrong way round. Once you hold a feasible polynomial, QSVT realises it as a circuit; producing that polynomial for a new target function is approximation-theory work nothing here automates.",
      d: "Too modest in one direction. QSVT-based Hamiltonian simulation genuinely improves on first-order Trotter's scaling, so the framework does more than restate what it absorbs, even though it does not improve everything it touches.",
    },
    defaultIncorrectFeedback:
      "The calibrated claim sits between two overclaims: that the framework flattens these algorithms into one cost, and that it makes designing a new algorithm automatic. Say what it does deliver, and what it leaves open.",
  },
  hints: [
    { text: "The capstone warns against overclaiming in two directions at once: that the framework flattens the algorithms into a single cost, and that it makes designing a new one automatic." },
    { text: "Two things QSVT does not hand you for free are named directly in the lesson: a good block encoding, and a good polynomial approximation." },
    { text: "Check the query-complexity comparison: does every unified algorithm end up with the same cost, or does the framework unify the construction while costs still differ?" },
  ],
  solution: {
    steps: [
      { description: "The capstone frames QSVT as an organizing principle and design tool, not a magic wand." },
      { description: "It explicitly lists what remains hard: constructing an efficient block encoding for a new matrix, and finding a good polynomial approximation for a new target function." },
      { description: "It also shows the unification does not equalize costs: Grover-via-QSVT matches (not beats) Θ(√N), while QSVT-based Hamiltonian simulation beats first-order Trotter's derived scaling." },
    ],
    finalAnswer: "QSVT unifies the constructions and sometimes improves their scaling, while finding block encodings and good polynomials stays open research work.",
  },
  explanation: {
    correctIdea: "QSVT is a genuine, powerful organizing/design framework, evaluated honestly: it explains and sometimes improves on older constructions, without making block-encoding or polynomial-approximation research obsolete.",
    whyCorrect: "This mirrors the capstone's explicit 'what remains genuinely open' section and its worked query-complexity comparison.",
    whyWrong: [
      { optionId: "b", text: "Flattens the costs. Grover-via-QSVT reproduces Θ(√N) while QSVT-based Hamiltonian simulation beats first-order Trotter: the construction unifies, the query complexities do not." },
      { optionId: "c", text: "Treats polynomial design as solved. A block encoding buys circuit realizability once a feasible polynomial is in hand; it does not hand you the approximation." },
      { optionId: "d", text: "Understates the result. The framework is not merely a restatement: for Hamiltonian simulation it delivers a genuinely better asymptotic cost than the construction it absorbs." },
    ],
  },
};
