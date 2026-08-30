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
      "The upper bound D(rho,sigma) <= sqrt(1-F(rho,sigma)^2) is proved via contractivity of trace distance under partial trace, applied to Uhlmann-optimal purifications. Explain why this bound becomes an equality exactly when rho and sigma are both already pure.",
    placeholder: "Think about what 'purification' even means when the state is already pure...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["own purification", "trivial purification", "purifies itself", "itself", "themselves", "trivial B", "one-dimensional"],
        missingFeedback:
          "Ask what the purifications used in the proof actually are when the states going in are already pure. Say what the reference system looks like in that case.",
      },
      {
        phrases: ["contractivity", "contraction", "equality", "no partial trace needed", "nothing to trace out", "b is trivial", "no slack", "loses nothing", "tight"],
        missingFeedback:
          "You have noticed what the construction hands back when the state carries no mixedness. Say what that does to the proof. There is exactly one lossy step in it, and it comes from discarding the auxiliary system. Ask how much gets discarded when that system has a single dimension.",
      },
    ],
    incorrectFeedback:
      "Ask what the upper-bound proof actually does, step by step, and where the one lossy step in it sits. Then ask what the Uhlmann construction hands you for the auxiliary system when neither state carries any mixedness, and how much a trace over such a system can throw away.",
    modelAnswers: [
      "If rho and sigma are already pure, each one purifies itself: the reference system B is trivial, one-dimensional. The proof's only inequality is contractivity of trace distance under the partial trace over B, and with nothing to trace out that step loses nothing, so the bound is tight.",
      "A pure state is its own purification, so B is trivial and there is no partial trace left to perform. The contractivity step becomes an equality rather than an inequality, which is why the bound is saturated.",
    ],
  },
  hints: [
    { text: "What is the smallest auxiliary system that will purify a state carrying no mixedness?" },
    { text: "The upper bound came from D(rho,sigma) <= D(purifications). Which way does discarding the auxiliary system push the distance, and why?" },
    { text: "If that system has a single dimension, how much is actually being discarded, and what does that do to the step you just described?" },
  ],
  solution: {
    steps: [
      { description: "A pure rho=|psi><psi| purifies itself trivially, with B taken to be one-dimensional." },
      { description: "The contractivity step D(rho,sigma) <= D(purifications) traces out B; with B trivial, there is nothing to trace out, so this step is an equality, not a strict inequality." },
      { description: "The pure-pure identity D(|psi>,|phi>)=sqrt(1-|<psi|phi>|^2) then applies directly, giving D(rho,sigma)=sqrt(1-F(rho,sigma)^2) exactly." },
    ],
    finalAnswer: "For pure states, the purifications used in the proof are rho and sigma themselves (trivial B), so the contractivity inequality never loses anything and the bound is exactly tight.",
  },
  explanation: {
    correctIdea: "The upper bound's only source of slack is the partial trace over B in the contractivity step; a pure state's trivial purification means that step traces out nothing.",
    whyCorrect: "The worked example's mixed rho_AD and rho_DP show real slack for the opposite reason: neither is its own purification, so B is nontrivial and tracing it out genuinely discards something.",
  },
};
