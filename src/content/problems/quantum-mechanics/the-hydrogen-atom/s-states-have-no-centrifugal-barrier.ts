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
    prompt: "Explain why V_eff(r) reduces to exactly V(r), with no centrifugal contribution at all, for l=0 states, and what this implies about whether an s-state electron can be found at r=0.",
    placeholder: "The centrifugal term is l(l+1)ħ²/2mr². For l=0...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["l(l+1)=0", "l(l+1) = 0", "0(0+1)", "coefficient vanishes", "coefficient is zero", "term vanishes", "vanishes identically", "vanishes entirely", "centrifugal term vanishes", "centrifugal term disappears", "drops out", "becomes zero", "evaluates to zero", "zero times one"],
        missingFeedback:
          "Evaluate the centrifugal term's coefficient at l=0 before anything else. Say what number it comes to, and what that does to the term it multiplies.",
      },
      {
        phrases: ["nonzero density at r=0", "nonzero probability at r=0", "nonzero at r=0", "nonzero at the origin", "nonzero amplitude there", "can be found at the nucleus", "can reach the nucleus", "reaches the origin", "found at the origin", "nothing keeps it away", "no barrier keeping", "only s states", "only s-states"],
        missingFeedback:
          "You have the effective potential. Now say what its shape near the origin allows, and what that means for whether an s state has any presence at the nucleus.",
      },
    ],
    incorrectFeedback: "You quoted the shape of V_eff without evaluating it. Put the s-state's angular quantum number into the centrifugal coefficient and compute the number it gives, then say what a potential with nothing extra added to it permits at the very centre.",
    partialFeedback: "You have the coefficient's value. Now draw the physical consequence: with nothing pushing the electron outward, is there anything stopping it from being found at the very centre of the atom?",
    modelAnswers: [
      "With l=0 the coefficient is 0(0+1)=0, so the centrifugal term vanishes identically and V_eff is exactly V(r). Since nothing keeps the electron away from the origin, an s state can have nonzero density at r=0, which a p state cannot.",
      "The centrifugal term's coefficient is zero when l=0, so that term drops out entirely. There is no barrier keeping the electron out, so it can be found at the nucleus.",
    ],
  },
  hints: [
    { text: "The centrifugal term carries a coefficient that depends on the angular quantum number. Write that coefficient down." },
    { text: "Now evaluate it for an s state. What number comes out, and what does the whole centrifugal term become?" },
    { text: "Compare V_eff with V. With nothing added, ask what stops the electron reaching the very centre, and then check whether the 1s and 2p radial functions agree with your answer there." },
  ],
  solution: {
    steps: [
      { description: "l(l+1)ħ²/2mr² with l=0 gives 0×1×ħ²/2mr²=0 for any r>0." },
      { description: "So V_eff(r)=V(r) exactly for l=0, and no effective repulsion pushes the electron away from r=0." },
      { description: "This is why only s states (l=0) have nonzero probability density exactly at the nucleus; every l>0 state is forced away from r=0 by its centrifugal barrier." },
    ],
    finalAnswer: "l(l+1)=0 for l=0, so the centrifugal term vanishes identically and V_eff=V. Only s states can have nonzero density at r=0.",
  },
  explanation: {
    correctIdea: "This directly explains a real, checkable feature of the radial wavefunctions built in this course: radial1s(0)=2 (nonzero), while radial2p(0)=0.",
    whyCorrect: "Matches both the algebra (l(l+1)=0 only at l=0) and the actual radial wavefunctions' behavior at r=0.",
    whyWrong: ["Claiming all states vanish at r=0, or that none do, contradicts the explicit l-dependence of the centrifugal term."],
  },
};
