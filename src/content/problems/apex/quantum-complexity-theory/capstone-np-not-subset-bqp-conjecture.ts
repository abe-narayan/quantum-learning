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
      {
        phrases: ["black-box", "black box", "oracle", "query model"],
        missingFeedback:
          "Name the setting the two lower-bound techniques actually operate in. The proof is airtight there, and the conjecture is about somewhere else.",
      },
      {
        phrases: ["structured", "explicitly given", "explicit instance", "real 3-sat", "structure", "reads the clauses"],
        missingFeedback:
          "You have named the model the proof lives in, but not what is different about an NP-complete formula a solver is handed. Say what such an input gives the algorithm that the model deliberately withholds.",
      },
      {
        phrases: [
          "unconditional",
          "circuit-complexity separation",
          "circuit complexity",
          "circuit lower bound",
          "relativization",
          "relativizing",
          "baker-gill-solovay",
          "baker gill solovay",
          "extend the technique",
          "no known way to extend",
          "non-relativizing",
        ],
        missingFeedback:
          "You have said why the bound does not transfer. What is missing is the second half of the question: what kind of result would settle it, and why no stretching of the technique you just described can produce that result. A named barrier from earlier in this course explains exactly this.",
      },
    ],
    incorrectFeedback:
      "The mistake is treating a theorem proved in one setting as if it were a theorem about the world. The lower bounds you are invoking are proved against a function an algorithm may only evaluate, never read. A 3-SAT formula is not such a function: every clause is on the page, and an algorithm is free to look at it. Naming what the theorem actually quantifies over, and then naming the kind of result that would have to replace it, is the whole task.",
    partialFeedback:
      "Half the answer is there. Two things still need naming: the restriction under which the lower bound was actually proved, and the kind of theorem that would have to be found to remove that restriction. 'More research' is not an answer to the second.",
    modelAnswers: [
      "The adversary and polynomial methods only work in the black-box query model. A real 3-SAT formula is not a black box; the algorithm reads the clauses and can use that structure, so the lower bound simply does not apply. To upgrade it you would need an unconditional circuit lower bound, and relativization says query techniques cannot get you there.",
      "Grover optimality is proven about an oracle. Once the instance is explicitly given, the structure is available to the algorithm and the proof says nothing. Turning the conjecture into a theorem needs a non-relativizing circuit-complexity separation, which nobody has.",
    ],
  },
  hints: [
    { text: "The adversary and polynomial methods bound how many times an algorithm may consult a function it is only allowed to evaluate. Ask whether a 3-SAT formula written out in full is that kind of object." },
    { text: "'No algorithm that merely evaluates the function can do better' and 'no algorithm at all can do better' are different statements. Which one has actually been established?" },
    { text: "Earlier in this course a barrier was named that explains why arguments of this shape cannot, on their own, settle questions of this shape. Recall which one, and what it says." },
  ],
  solution: {
    steps: [
      { description: "The adversary method and the polynomial method both prove Grover's Theta(sqrt(N)) optimality specifically in the black-box query model: no algorithm that only queries an oracle can beat quadratic speedup for unstructured search, for every possible oracle." },
      { description: "An NP-complete problem given explicitly (a real 3-SAT formula, with its clauses fully visible) is not a black box. A structure-exploiting algorithm could, in principle, do better than generic unstructured search suggests, so the black-box lower bound doesn't transfer automatically." },
      { description: "This is the same shape of gap Lesson 1 flagged for BBBV: real, rigorous evidence in a restricted model, believed to generalize, but not a proof for the unrestricted, structured setting." },
      { description: "Upgrading this to a Tier 1 theorem would require an unconditional circuit-complexity separation, a technique that works outside the black-box model. The Baker-Gill-Solovay relativization barrier is why extending query-complexity-style arguments this way is an open problem, not a matter of more careful bookkeeping." },
    ],
    finalAnswer:
      "The adversary and polynomial methods prove Grover's optimality only in the black-box (oracle) query model. An explicitly-given NP-complete instance is not a black box, so the proof does not transfer to the general, structured setting, which leaves NP not-subset-BQP a Tier 2 conjecture. Upgrading it to a theorem would require an unconditional circuit-complexity separation technique that works outside the black-box model, which the relativization barrier shows current query techniques cannot directly provide.",
  },
  explanation: {
    correctIdea:
      "Rigorous evidence in a restricted model (black-box queries) is real and strong, but is a categorically different, weaker kind of statement than an unconditional proof in the general setting the conjecture is actually about.",
    whyCorrect:
      "Distinguishing a proof that holds in one specific model from a proof that holds unconditionally is the precision this course's three-tier framework is built to enforce, and the reason NP not-subset-BQP sits in Tier 2 rather than Tier 1 despite two independent rigorous proofs backing it.",
    whyWrong: [
      "Treating the adversary/polynomial method proofs as if they applied to explicitly-given instances ignores that both techniques are defined in terms of oracle queries, not circuit size on structured input.",
      "Assuming 'two independent proofs' automatically means 'proven in general' conflates robustness of evidence within a model with validity across models.",
    ],
  },
};
