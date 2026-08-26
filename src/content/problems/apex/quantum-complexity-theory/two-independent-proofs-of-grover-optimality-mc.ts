import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const twoIndependentProofsOfGroverOptimalityMc: MultipleChoiceProblem = {
  meta: {
    slug: "two-independent-proofs-of-grover-optimality-mc",
    title: "What 'Two Independent Proofs' Actually Establishes",
    course: "quantum-complexity-theory",
    lesson: "apex/quantum-complexity-theory/query-complexity-and-lower-bounds",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "multiple-choice",
    tags: ["adversary-method", "polynomial-method", "grover", "proof-technique", "complexity-theory"],
    prerequisites: ["apex/quantum-complexity-theory/query-complexity-and-lower-bounds"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "The quantum adversary method (a state-evolution / distinguishability argument) and the polynomial method (a classical function-approximation-theory argument) share essentially no common machinery, yet both independently prove Grover's Theta(sqrt(N)) query complexity is optimal for unstructured search. Which statement most precisely describes what this 'doubly-proven' status does and does not mean?",
    options: [
      {
        id: "a",
        text: "Grover's optimality is an unconditional, checkable theorem confirmed by two structurally independent proof techniques -- genuinely different in kind from a belief like P != NP or P != BQP, for which no unconditional proof exists by any technique. Having two independent routes reach the same bound is stronger evidence against a hidden flaw than either proof alone, but it remains a statement about the black-box query model specifically.",
      },
      {
        id: "b",
        text: "The two proofs are secretly the same argument written in different notation, so having both adds no confidence beyond having just one of them.",
      },
      {
        id: "c",
        text: "Since both techniques independently confirm a query lower bound this tight, they also establish that NP is not a subset of BQP, because the same style of argument that bounds Grover's algorithm directly rules out quantum speedups for NP-complete problems in general.",
      },
      {
        id: "d",
        text: "Because two independent techniques give a matching lower and upper bound in the query model, this also proves an unconditional time-complexity separation between classical and quantum computation for unstructured search on real, explicitly-given hardware.",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The adversary method tracks state-evolution distinguishability via inner products and spectral norms; the polynomial method tracks the algebraic degree of a real polynomial approximating a Boolean function. They rely on different mathematical objects (quantum states and operator norms versus classical polynomial approximation theory) and different foundational theorems (Ambainis's adversary bound versus Nisan-Szegedy/Paturi degree bounds) -- they are not the same argument in different notation.",
      c: "Both techniques are query-complexity results relative to a black-box oracle. An NP-complete problem given explicitly (e.g. a real 3-SAT formula) is not a black box -- its structure is available for inspection -- so neither technique says anything unconditional about NP subseteq BQP in the general, non-black-box setting.",
      d: "Query complexity counts only oracle calls, with all other computation free; it is a fundamentally different (and weaker) model than time/circuit complexity against explicitly-given problems. A matching query bound says nothing about time-complexity separations outside the black-box model.",
    },
    defaultIncorrectFeedback:
      "Recall the lesson's central point: two structurally independent techniques agreeing is exactly what makes Grover's optimality a genuine theorem rather than a belief -- but the agreement is still scoped to the query/black-box model, and doesn't extend to time-complexity or non-black-box claims.",
  },
  hints: [
    { text: "Ask what kind of statement (query model vs. time/circuit model, black-box vs. structured problems) each proof technique actually makes." },
    { text: "Neither 'the two proofs are the same' nor 'this settles NP vs BQP' nor 'this proves a time-complexity separation' is accurate -- check what the adversary method and polynomial method actually track." },
    { text: "The correct answer should contrast this doubly-proven theorem with genuinely open, single-technique-unproven questions like P != NP, while still respecting the query model's scope." },
  ],
  solution: {
    steps: [
      { description: "The adversary method and polynomial method use unrelated mathematical machinery (state-evolution distinguishability vs. polynomial degree), so their agreement is genuine independent confirmation, not redundant restatement." },
      { description: "This makes Grover's Theta(sqrt(N)) optimality an unconditional, doubly-proven theorem -- unlike P != NP or P != BQP, which have no unconditional proof by any technique." },
      { description: "Both techniques remain query-complexity results relative to a black-box oracle, so neither extends to unconditional claims about NP subseteq BQP or to time-complexity separations for explicitly-given, structured problems." },
    ],
    finalAnswer: "(a)",
  },
  explanation: {
    correctIdea:
      "Two structurally independent proof techniques landing on the same bound is genuinely stronger evidence of correctness than one proof alone, and is precisely what distinguishes a proven theorem from a widely-believed-but-unproven conjecture -- but the theorem's scope is still the black-box query model.",
    whyCorrect:
      "Option (a) correctly identifies both the epistemic strength of independent confirmation and the precise, limited scope (query model, black-box oracle) that the theorem does not exceed.",
    whyWrong: [
      "(b) is false: the two techniques' core objects (quantum state overlaps vs. real polynomial degree) and cited theorems (Ambainis's adversary bound vs. Nisan-Szegedy/Paturi degree bounds) are genuinely different.",
      "(c) overreaches by applying a black-box query result to general, structured NP-complete instances, exactly the mistake the lesson's first Common Mistake callout warns against.",
      "(d) conflates the query-complexity model (only oracle calls counted, everything else free) with time/circuit complexity against real, explicitly-given problems -- a fundamentally different and stronger kind of statement that neither technique makes.",
    ],
  },
};
