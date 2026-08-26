import type { ConceptualProblem } from "@/lib/problems/types";

export const fuchsVanDeGraafPureEquality: ConceptualProblem = {
  meta: {
    slug: "fuchs-van-de-graaf-pure-equality",
    title: "Why the Upper Fuchs-van de Graaf Bound Is Tight for Pure States",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/trace-distance-and-fidelity",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["fuchs-van-de-graaf", "trace-distance", "fidelity"],
    prerequisites: ["quantum-mastery/quantum-information-theory/trace-distance-and-fidelity"],
  },
  question: {
    type: "conceptual",
    prompt:
      "The upper bound D(rho,sigma) <= sqrt(1-F(rho,sigma)^2) is proved via contractivity of trace distance under partial trace, applied to Uhlmann-optimal purifications. Explain why this bound becomes an EQUALITY exactly when rho and sigma are both already pure.",
    placeholder: "Think about what 'purification' even means when the state is already pure...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["own purification", "already pure", "trivial purification", "itself"],
      ["contractivity", "equality", "no partial trace needed", "b is trivial"],
    ],
    incorrectFeedback:
      "If rho and sigma are already pure, their own Uhlmann-optimal purifications can be taken to be themselves (a trivial one-dimensional B system), so the contractivity step used to derive the upper bound involves no actual partial trace, and the pure-pure trace-distance identity applies directly with no loss.",
  },
  hints: [
    { text: "A pure state is trivially its own purification, using a one-dimensional (trivial) system B." },
    { text: "The upper-bound proof used D(rho,sigma) <= D(purifications), a contraction under partial trace over B." },
    { text: "If B is trivial, there's nothing to trace out, so the inequality in that step is automatically an equality." },
  ],
  solution: {
    steps: [
      { description: "A pure rho=|psi><psi| purifies itself trivially, with B taken to be one-dimensional." },
      { description: "The contractivity step D(rho,sigma) <= D(purifications) traces out B; with B trivial, there is nothing to trace out, so this step is an equality, not a strict inequality." },
      { description: "The pure-pure identity D(|psi>,|phi>)=sqrt(1-|<psi|phi>|^2) then applies directly, giving D(rho,sigma)=sqrt(1-F(rho,sigma)^2) exactly." },
    ],
    finalAnswer: "For pure states, the purifications used in the proof ARE rho and sigma themselves (trivial B), so the contractivity inequality never actually loses anything, and the bound is exactly tight.",
  },
  explanation: {
    correctIdea: "The upper bound's only source of slack is the partial trace over B in the contractivity step; a pure state's trivial purification means that step traces out nothing.",
    whyCorrect: "This is exactly why the worked example's own numbers show real slack for the genuinely mixed rho_AD, rho_DP -- those states are not their own purifications, so B is nontrivial and information is genuinely lost tracing it out.",
  },
};
