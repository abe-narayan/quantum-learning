import type { ConceptualProblem } from "@/lib/problems/types";

export const whyUZeroKillsTheBoundaryTerm: ConceptualProblem = {
  meta: {
    slug: "why-u-zero-kills-the-boundary-term",
    title: "Why u(0)=0 Is Enough at the Radial Equation's Singular Origin",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/sturm-liouville-theory",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["sturm-liouville", "boundary-conditions", "conceptual"],
    prerequisites: ["quantum-mastery/hilbert-space-and-spectral-theory/sturm-liouville-theory"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Lagrange's identity's boundary term is [p(y₂y₁′−y₁y₂′)]ₐᵇ. For the hydrogen radial equation (p=1 everywhere, including at r=0), explain exactly why the boundary condition u(0)=0, applied to both eigenfunctions u₁ and u₂, is enough to make this term vanish at the r=0 end, using the term's explicit form.",
    placeholder: "At r=0, the boundary term becomes p(0)·(u₂(0)u₁′(0) − u₁(0)u₂′(0)). If u(0)=0 for both u₁ and u₂, then...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["both vanish", "both eigenfunctions vanish", "vanish at the origin", "vanish at zero", "zero at the origin", "dirichlet", "boundary condition at the origin"],
        missingFeedback:
          "State the condition you are given and say which functions it applies to. That is what determines whether the bracket has anything left in it.",
      },
      {
        phrases: ["each term", "product", "zero times", "multiplied by zero"],
        missingFeedback:
          "You have the condition. Now substitute it into the bracket and say what each of the two pieces inside it comes to.",
      },
    ],
    incorrectFeedback:
      "Do the substitution rather than describing it. Write the bracket out as p(0)(u₂(0)u₁′(0)−u₁(0)u₂′(0)), put the radial boundary condition into it, and show what happens to the two pieces separately. Note what the derivatives and p(0) are doing while that happens: nothing.",
    partialFeedback: "Good. Now be explicit about why the bracket dies without any help from the derivatives: take the two pieces one at a time and say what factor sits inside each of them.",
    modelAnswers: [
      "At r=0 the bracket is p(0)(u2(0)u1'(0) - u1(0)u2'(0)). Both eigenfunctions vanish at the origin, so each term in it is a product carrying a factor of zero, and the whole bracket dies whatever the derivatives or p(0) happen to be.",
      "Since u1 and u2 are both zero at the origin, every product in the bracket is multiplied by zero. It is a Dirichlet condition doing the work, so you never need p to vanish there as well.",
    ],
  },
  hints: [
    { text: "Write out the boundary term at r=0 explicitly: p(0)[u₂(0)u₁′(0) − u₁(0)u₂′(0)]." },
    { text: "If both u₁(0)=0 and u₂(0)=0 (the radial equation's boundary condition, applied to any two eigenfunctions), substitute directly." },
    { text: "Each of the two products in the bracket contains a factor that is exactly zero, so the whole bracket is zero regardless of what u₁′(0), u₂′(0), or p(0) are." },
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
      "Both eigenfunctions vanish at the origin, so each product in the bracket carries a factor of zero and the bracket dies regardless of the derivatives u₁′(0), u₂′(0) or the value of p(0). The Dirichlet-type condition alone does it, and p is not required to vanish there too.",
  },
  explanation: {
    correctIdea:
      "u(0)=0 is a genuine Dirichlet boundary condition, not a 'natural' or singular one relying on p vanishing. It kills the boundary term the same direct way the infinite well's y(±a)=0 does, even though r=0 is a singular endpoint of the underlying 3D problem.",
    whyCorrect: "Each of the two products in the bracket carries a factor u(0), and one zero factor kills a product regardless of what multiplies it. The derivatives and p(0) never enter, which is why the Dirichlet-type condition alone suffices and p is not required to vanish at the origin.",
    whyWrong: [
      "Claiming the term vanishes because p(0)=0 is wrong for this operator. p=1 everywhere in the radial equation's Sturm-Liouville form, so the u(0)=0 condition itself is doing the work, not a vanishing p.",
    ],
  },
};
