import type { ConceptualProblem } from "@/lib/problems/types";

export const qsvtVersusTrotterAsymptoticClaim: ConceptualProblem = {
  meta: {
    slug: "qsvt-versus-trotter-asymptotic-claim",
    title: "Does QSVT Make Trotterization Obsolete?",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/the-quantum-singular-value-transformation",
    difficulty: "advanced",
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
      ["asymptotic", "big-o", "big o", "query complexity", "scaling"],
      ["constant factor", "overhead", "practical", "circuit depth", "fixed", "small problem", "doesn't mean"],
      ["unify", "unifying", "framework", "special case", "explains why"],
    ],
    incorrectFeedback:
      "Focus on the difference between an asymptotic scaling statement (how error or cost grows as a limit is approached) and a claim about which method is better for a specific, fixed-size problem, and on what QSVT's role as a unifying framework actually means.",
    partialFeedback:
      "You're on the right track — be explicit that an asymptotic advantage in 1/ε doesn't rule out Trotterization having lower overhead or a simpler circuit for a modest, fixed problem size, and that QSVT's real contribution is explaining Trotterization and Grover's algorithm as special cases within one framework, not proving them obsolete.",
  },
  hints: [
    { text: "'Better asymptotic scaling' is a statement about behavior as t or 1/ε grows without bound — it says nothing directly about which method has fewer gates for a specific, modest t and ε." },
    { text: "QSVT-based simulation's near-optimal query complexity can still carry larger constant factors, deeper block-encoding circuits, or costlier phase-finding than a simple Trotter step for realistic near-term sizes." },
    { text: "This lesson's 'Common Mistake' callout states the general principle directly: QSVT explains why these methods work as special cases of one construction, and can (not always does) give an asymptotic improvement." },
  ],
  solution: {
    steps: [
      { description: "First-order Trotterization's error bound scales polynomially in 1/ε (roughly poly(t²/ε) steps for a fixed accuracy target), while QSVT-based simulation achieves query complexity scaling like t + log(1/ε)/loglog(1/ε) — provably near-optimal, and asymptotically better in ε." },
      { description: "'Asymptotically better' describes behavior as ε→0 or t→∞; it is a statement about scaling exponents, not a claim that QSVT wins for every concrete, fixed-size instance. Constant factors, ancilla overhead, and the cost of constructing and controlling the block encoding itself can make Trotterization cheaper in practice for modest t and modest accuracy targets." },
      { description: "QSVT's actual contribution here is explanatory and organizational: it shows Hamiltonian simulation (in any product-formula or QSVT-based form) and Grover-style amplitude amplification are both special cases of one polynomial-transformation construction, applied to different choices of P. That unification is real and significant, but it is a different claim from 'always strictly better,' which the asymptotic result alone does not establish." },
    ],
    finalAnswer:
      "The claim conflates an asymptotic query-complexity advantage (real, for large t or small ε) with a universal practical one; QSVT's actual contribution is unifying Hamiltonian simulation and Grover's algorithm as special cases of one construction, which is compatible with Trotterization still being the better choice for many fixed, modest-size problems.",
  },
  explanation: {
    correctIdea: "An asymptotic complexity result and a practical recommendation for a fixed problem size are different claims, and QSVT's significance is as a unifying framework, not as a blanket replacement for every specialized method it generalizes.",
    whyCorrect: "This is exactly the distinction the lesson's 'Common Mistake' callout draws: QSVT explains why Grover's algorithm and Hamiltonian simulation work, and can sometimes — not always — give an asymptotic improvement.",
    whyWrong: ["Concluding Trotterization is 'obsolete' ignores that near-optimal asymptotic scaling says nothing about constant factors, block-encoding overhead, or circuit depth at any particular, fixed problem size."],
  },
};
