import type { ConceptualProblem } from "@/lib/problems/types";

export const sStatesHaveNoCentrifugalBarrier: ConceptualProblem = {
  meta: {
    slug: "s-states-have-no-centrifugal-barrier",
    title: "Why s States (l=0) Have No Centrifugal Barrier",
    course: "the-hydrogen-atom",
    lesson: "quantum-mechanics/the-hydrogen-atom/the-radial-equation",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "conceptual",
    tags: ["radial-equation", "centrifugal-term"],
    prerequisites: ["quantum-mechanics/the-hydrogen-atom/the-radial-equation"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why V_eff(r) reduces to exactly V(r), with no centrifugal contribution at all, for l=0 states — and what this implies about whether an s-state electron can be found at r=0.",
    placeholder: "The centrifugal term is l(l+1)ħ²/2mr². For l=0...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["l(l+1)", "l=0", "zero", "vanishes"],
      ["r=0", "at the nucleus", "origin"],
    ],
    incorrectFeedback: "Substitute l=0 into the centrifugal coefficient l(l+1) and note what value it gives.",
    partialFeedback: "Good — now connect this to whether an s-state electron can have nonzero probability density at the nucleus.",
  },
  hints: [
    { text: "The centrifugal coefficient is l(l+1)." },
    { text: "For l=0: 0(0+1)=0 — the entire centrifugal term vanishes identically." },
    { text: "With no repulsive barrier, s states are the only states with nonzero probability density exactly at the nucleus." },
  ],
  solution: {
    steps: [
      { description: "l(l+1)ħ²/2mr² with l=0 gives 0×1×ħ²/2mr²=0 for any r>0." },
      { description: "So V_eff(r)=V(r) exactly for l=0 — no effective repulsion pushes the electron away from r=0." },
      { description: "This is why only s states (l=0) have nonzero probability density exactly at the nucleus; every l>0 state is forced away from r=0 by its centrifugal barrier." },
    ],
    finalAnswer: "l(l+1)=0 for l=0, so the centrifugal term vanishes identically and V_eff=V — s states alone can have nonzero density at r=0.",
  },
  explanation: {
    correctIdea: "This directly explains a real, checkable feature of the radial wavefunctions built in this course: radial1s(0)=2 (nonzero), while radial2p(0)=0.",
    whyCorrect: "Matches both the algebra (l(l+1)=0 only at l=0) and the actual radial wavefunctions' behavior at r=0.",
    whyWrong: ["Claiming all states vanish at r=0, or that none do, contradicts the explicit l-dependence of the centrifugal term."],
  },
};
