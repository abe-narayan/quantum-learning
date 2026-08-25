import type { ConceptualProblem } from "@/lib/problems/types";

export const whyUZeroKillsTheBoundaryTerm: ConceptualProblem = {
  meta: {
    slug: "why-u-zero-kills-the-boundary-term",
    title: "Why u(0)=0 Is Enough at the Radial Equation's Singular Origin",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/sturm-liouville-theory",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["sturm-liouville", "boundary-conditions", "conceptual"],
    prerequisites: ["quantum-mastery/hilbert-space-and-spectral-theory/sturm-liouville-theory"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Lagrange's identity's boundary term is [p(y₂y₁′−y₁y₂′)]ₐᵇ. For the hydrogen radial equation (p=1 everywhere, including at r=0), explain exactly why the boundary condition u(0)=0 (applied to BOTH eigenfunctions u₁,u₂) is enough to make this term vanish at the r=0 end, using the term's explicit form.",
    placeholder: "At r=0, the boundary term becomes p(0)·(u₂(0)u₁′(0) − u₁(0)u₂′(0)). If u(0)=0 for both u₁ and u₂, then...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["u1(0)=0", "u2(0)=0", "both vanish", "both eigenfunctions vanish"],
      ["each term", "product", "zero times", "multiplied by zero"],
    ],
    incorrectFeedback:
      "Substitute u₁(0)=0 and u₂(0)=0 directly into the boundary term's explicit form p(0)(u₂(0)u₁′(0)−u₁(0)u₂′(0)) and show each of the two products vanishes.",
    partialFeedback: "Good — now be explicit that BOTH products in the bracket vanish individually, because each contains a factor u(0)=0.",
  },
  hints: [
    { text: "Write out the boundary term at r=0 explicitly: p(0)[u₂(0)u₁′(0) − u₁(0)u₂′(0)]." },
    { text: "If both u₁(0)=0 and u₂(0)=0 (the radial equation's boundary condition, applied to any two eigenfunctions), substitute directly." },
    { text: "Each of the two products in the bracket contains a factor that is exactly zero, so the whole bracket is zero — regardless of what u₁′(0), u₂′(0), or p(0) are." },
  ],
  solution: {
    steps: [
      {
        description: "Write the boundary term at the r=0 end explicitly, for two radial eigenfunctions u₁, u₂ (both satisfying the same u(0)=0 condition).",
        latex: "p(0)\\big[u_2(0)u_1'(0) - u_1(0)u_2'(0)\\big]",
      },
      {
        description: "Substitute u₁(0)=0 and u₂(0)=0 directly.",
        latex: "p(0)\\big[0\\cdot u_1'(0) - 0\\cdot u_2'(0)\\big] = p(0)\\cdot 0 = 0",
      },
    ],
    finalAnswer:
      "Both products in the bracket contain a factor u(0)=0, so the bracket is exactly zero regardless of the derivatives u₁′(0), u₂′(0) or the value of p(0) — the boundary term vanishes at r=0 purely from the Dirichlet-type condition, without needing p to vanish there too.",
  },
  explanation: {
    correctIdea:
      "u(0)=0 is a genuine Dirichlet boundary condition (not a 'natural'/singular one relying on p vanishing) — it kills the boundary term the same direct way the infinite well's y(±a)=0 does, even though r=0 is a singular endpoint of the underlying 3D problem.",
    whyCorrect: "Matches the lesson's explicit boundary-term formula, substituted directly with the radial equation's own boundary condition.",
    whyWrong: [
      "Claiming the term vanishes because p(0)=0 is wrong for this specific operator — p=1 everywhere in the radial equation's Sturm-Liouville form, so it's the u(0)=0 condition itself doing the work, not a vanishing p.",
    ],
  },
};
