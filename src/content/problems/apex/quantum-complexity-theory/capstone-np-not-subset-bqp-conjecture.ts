import type { ConceptualProblem } from "@/lib/problems/types";

export const capstoneNpNotSubsetBqpConjecture: ConceptualProblem = {
  meta: {
    slug: "capstone-np-not-subset-bqp-conjecture",
    title: "Why NP ⊄ BQP Is a Conjecture, Not a Theorem",
    course: "quantum-complexity-theory",
    lesson: "apex/quantum-complexity-theory/capstone-what-we-know-and-dont",
    difficulty: "master",
    estimatedMinutes: 8,
    problemType: "conceptual",
    tags: ["complexity-theory", "np", "bqp", "query-complexity", "claim-evaluation"],
    prerequisites: [
      "apex/quantum-complexity-theory/capstone-what-we-know-and-dont",
      "apex/quantum-complexity-theory/query-complexity-and-lower-bounds",
    ],
  },
  question: {
    type: "conceptual",
    prompt:
      "This course's query-complexity lower-bound techniques (the adversary method and the polynomial method) prove that Grover's Theta(sqrt(N)) search is optimal. Explain precisely why this real, rigorous proof still leaves 'NP is not contained in BQP' as a Tier 2 conjecture rather than a Tier 1 theorem, and name exactly what kind of result would be needed to upgrade it.",
    placeholder:
      "Think about what model the adversary and polynomial methods actually operate in, and what's different about an explicitly-given NP-complete instance like a real 3-SAT formula...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["black-box", "black box", "oracle", "query model"],
      ["structured", "explicitly given", "not a black box", "explicit instance", "real 3-sat", "structure"],
      [
        "unconditional",
        "circuit-complexity separation",
        "relativization",
        "baker-gill-solovay",
        "extend the technique",
        "no known way to extend",
      ],
    ],
    incorrectFeedback:
      "The adversary and polynomial methods are rigorous, but they are proofs about the black-box (query) model specifically: they show no algorithm querying an oracle can beat quadratic speedup for generic unstructured search. An explicitly-given NP-complete instance, like a real 3-SAT formula, is not a black box -- its structure is fully visible, so a smart algorithm could in principle exploit it. Upgrading NP not-subset-BQP to a Tier 1 theorem would require an unconditional circuit-complexity separation technique that works outside the black-box model entirely, which nobody currently has (the Baker-Gill-Solovay relativization barrier is exactly why extending these query techniques that way is a genuinely open problem).",
    partialFeedback:
      "You have part of the picture -- make sure you name both the model the proof actually applies to (black-box/oracle) and what kind of result (an unconditional, non-relativizing circuit-complexity technique) would be needed to go further.",
  },
  hints: [
    { text: "The adversary method and polynomial method are proofs about queries to an oracle. Is a real, explicitly-given 3-SAT formula an oracle?" },
    { text: "What's the difference between 'no black-box algorithm can do better' and 'no algorithm at all, given the problem's explicit structure, can do better'?" },
    { text: "Recall the relativization barrier (Baker-Gill-Solovay) from earlier in this course -- why does it block black-box techniques from resolving P vs. NP-style questions directly?" },
  ],
  solution: {
    steps: [
      { description: "The adversary method and the polynomial method both prove Grover's Theta(sqrt(N)) optimality specifically in the black-box query model: no algorithm that only queries an oracle can beat quadratic speedup for unstructured search, for every possible oracle." },
      { description: "An NP-complete problem given explicitly (a real 3-SAT formula, with its clauses fully visible) is not a black box. A structure-exploiting algorithm could, in principle, do better than generic unstructured search suggests, so the black-box lower bound doesn't transfer automatically." },
      { description: "This is exactly the same shape of gap Lesson 1 flagged for BBBV: real, rigorous evidence in a restricted model, believed to generalize, but not a proof for the unrestricted, structured setting." },
      { description: "Upgrading this to a Tier 1 theorem would require an unconditional circuit-complexity separation -- a technique that works outside the black-box model. The Baker-Gill-Solovay relativization barrier is exactly why extending query-complexity-style arguments this way is a genuinely open problem, not a matter of more careful bookkeeping." },
    ],
    finalAnswer:
      "The adversary and polynomial methods prove Grover's optimality only in the black-box (oracle) query model. An explicitly-given NP-complete instance is not a black box, so the proof doesn't transfer to the general, structured setting -- making NP not-subset-BQP a Tier 2 conjecture. Upgrading it to a theorem would require an unconditional circuit-complexity separation technique that works outside the black-box model, which the relativization barrier shows current query techniques cannot directly provide.",
  },
  explanation: {
    correctIdea:
      "Rigorous evidence in a restricted model (black-box queries) is real and strong, but is a categorically different, weaker kind of statement than an unconditional proof in the general setting the conjecture is actually about.",
    whyCorrect:
      "Distinguishing a proof that holds in one specific model from a proof that holds unconditionally is exactly the precision this course's three-tier framework is built to enforce, and exactly why NP not-subset-BQP sits in Tier 2 rather than Tier 1 despite two independent rigorous proofs backing it.",
    whyWrong: [
      "Treating the adversary/polynomial method proofs as if they applied to explicitly-given instances ignores that both techniques are defined in terms of oracle queries, not circuit size on structured input.",
      "Assuming 'two independent proofs' automatically means 'proven in general' conflates robustness of evidence within a model with validity across models.",
    ],
  },
};
