import type { ConceptualProblem } from "@/lib/problems/types";

export const qsvtVersusTrotterAsymptoticClaim: ConceptualProblem = {
  meta: {
    slug: "qsvt-versus-trotter-asymptotic-claim",
    title: "Does QSVT Make Trotterization Obsolete?",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/the-quantum-singular-value-transformation",
    difficulty: "master",
    estimatedMinutes: 8,
    problemType: "conceptual",
    tags: ["qsvt", "hamiltonian-simulation", "trotterization", "asymptotics"],
    prerequisites: ["apex/algorithmic-frontiers/the-quantum-singular-value-transformation"],
  },
  question: {
    type: "conceptual",
    prompt:
      "A classmate claims: 'QSVT-based Hamiltonian simulation has better asymptotic query complexity in the target precision ε than first-order Trotterization, so Trotterization is now obsolete and QSVT always wins in practice.' Explain precisely what's wrong with this claim, distinguishing an asymptotic query-complexity result from a universal practical recommendation, and say what QSVT actually establishes about Trotterization and Grover's algorithm rather than replacing them.",
    placeholder: "Think about what 'asymptotic' means, and what QSVT's unifying role actually is versus what it guarantees for any one fixed problem size...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["asymptotic", "big-o", "big o", "query complexity", "scaling"],
        missingFeedback:
          "You have named the practical objection but not the kind of claim being objected to. Say what sort of statement a complexity result in epsilon actually is.",
      },
      {
        phrases: ["constant factor", "overhead", "practical", "circuit depth", "fixed", "small problem", "doesn't mean"],
        missingFeedback:
          "You have identified the kind of claim correctly. Now say why a better limit does not settle which method to run on a machine of a fixed size.",
      },
      {
        phrases: ["unify", "unifying", "unification", "framework", "special case", "explains why", "same construction", "one construction"],
        missingFeedback:
          "The limits-versus-instances half is there. The other half is about what this construction's existence actually establishes for Trotterization and Grover: not that they are obsolete, but something about their relationship to it. Say what that relationship is.",
      },
    ],
    incorrectFeedback:
      "Two different errors are stacked here. The first treats a statement about limiting behaviour as if it were a verdict on any particular instance a reader might actually run. The second treats 'contains X as a sub-case' as 'replaces X', which is backwards: a construction that reproduces an older method is evidence the older method was right, not a reason to retire it.",
    partialFeedback:
      "Half the claim is still standing. Name what a limiting statement about large t or tiny ε does not settle for a problem of a size someone actually runs, and say what it means for a newer construction to contain an older method as a sub-case rather than to supersede it.",
    modelAnswers: [
      "The claim mixes up an asymptotic query complexity result with a practical recommendation. Better big-O scaling in epsilon does not mean lower circuit depth on a fixed, small problem, where constant factors and overhead can easily go the other way. What QSVT really gives you is a unifying framework in which Hamiltonian simulation and Grover both come out as special cases of one construction, not a replacement for either.",
      "Asymptotic query complexity is about the limit, not about the machine you have. For a fixed problem size the constant factors and the overhead of block encoding can make Trotter cheaper in practice. QSVT's contribution is unification: it explains why those two algorithms work, as instances of the same construction.",
    ],
  },
  hints: [
    { text: "A claim about behaviour in the limit of large t or tiny ε is not a claim about any particular t and ε someone actually runs." },
    { text: "A method with the better limiting behaviour can still need more gates at the sizes near-term devices reach, once block encodings and phase finding are counted." },
    { text: "Ask what the newer construction does to Trotterization and Grover: does it discard them, or does it place them inside a single mathematical picture and thereby account for them?" },
  ],
  solution: {
    steps: [
      { description: "First-order Trotterization's error bound is linear in 1/ε (on the order of t²/ε steps for a fixed accuracy target), while QSVT-based simulation achieves query complexity scaling like t + log(1/ε)/loglog(1/ε), which is provably near-optimal and asymptotically better in ε." },
      { description: "'Asymptotically better' describes behavior as ε→0 or t→∞; it is a statement about scaling exponents, not a claim that QSVT wins for every concrete, fixed-size instance. Constant factors, ancilla overhead, and the cost of constructing and controlling the block encoding itself can make Trotterization cheaper in practice for modest t and modest accuracy targets." },
      { description: "QSVT's actual contribution here is explanatory and organizational: it shows Hamiltonian simulation (in any product-formula or QSVT-based form) and Grover-style amplitude amplification are both special cases of one polynomial-transformation construction, applied to different choices of P. That unification is real and significant, but it is a different claim from 'always strictly better,' which the asymptotic result alone does not establish." },
    ],
    finalAnswer:
      "The claim conflates an asymptotic query-complexity advantage (real, for large t or small ε) with a universal practical one; QSVT's actual contribution is unifying Hamiltonian simulation and Grover's algorithm as special cases of one construction, which is compatible with Trotterization still being the better choice for many fixed, modest-size problems.",
  },
  explanation: {
    correctIdea: "An asymptotic complexity result and a practical recommendation for a fixed problem size are different claims, and QSVT's significance is as a unifying framework, not as a blanket replacement for every specialized method it generalizes.",
    whyCorrect: "The claim runs together two separate things: what QSVT establishes about asymptotics, and what it establishes about which method to reach for. It recovers Grover's algorithm and Hamiltonian simulation as instances of one polynomial construction, which accounts for why they work; whether it also beats them at a given size is a different question with a different answer.",
    whyWrong: ["Concluding Trotterization is 'obsolete' ignores that near-optimal asymptotic scaling says nothing about constant factors, block-encoding overhead, or circuit depth at any particular, fixed problem size."],
  },
};
