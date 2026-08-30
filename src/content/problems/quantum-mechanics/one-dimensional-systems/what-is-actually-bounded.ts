import type { ConceptualProblem } from "@/lib/problems/types";

export const whatIsActuallyBounded: ConceptualProblem = {
  meta: {
    slug: "what-is-actually-bounded",
    title: "Why the Transmission Amplitude Can Exceed 1",
    course: "one-dimensional-systems",
    lesson: "quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["scattering", "step-potential"],
    prerequisites: ["quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential"],
  },
  question: {
    type: "conceptual",
    prompt:
      "The amplitude t = 2*k1/(k1+k2) can be greater than 1 when k2 < k1. Explain in one or two sentences why this doesn't violate probability conservation, and what quantity actually is guaranteed to stay bounded by 1.",
    placeholder: "Explain why t > 1 is not a problem...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["T rather than t", "capital T", "transmission probability", "includes the k2/k1 factor", "(k2/k1)|t|^2", "flux factor", "flux correction", "flux-corrected", "r+t=1", "r + t = 1", "reflection plus transmission"],
        missingFeedback:
          "You have said what t is not. Now name the quantity that is bounded, write its formula, and point at the extra factor in front that t on its own lacks.",
      },
      {
        phrases: ["is an amplitude", "is only an amplitude", "is just an amplitude", "amplitude rather than a probability", "amplitude not a probability", "amplitude, not a probability", "amplitude is not a probability", "amplitudes are not probabilities", "not itself a probability", "not a probability", "ratio of wave heights", "ratio of two heights", "wave heights", "not bounded by 1", "never bounded by 1"],
        missingFeedback:
          "Say what kind of object t actually is. That is what settles whether a value above 1 is even surprising.",
      },
    ],
    incorrectFeedback: "You argued that t must be less than one after all, or that the formula is wrong. Neither is the case. Ask what physical claim probability conservation actually makes: it is a statement about fluxes crossing the step, and the ratio of two wave heights is not one of those fluxes.",
    modelAnswers: [
      "t is an amplitude, not a probability, so nothing requires it to be less than 1: it is a ratio of wave heights. The quantity guaranteed to stay in [0,1] is the flux-corrected transmission probability T = (k2/k1)|t|^2, which is what satisfies r + t = 1 as probabilities.",
      "An amplitude is not a probability, so t is not bounded by 1. Only the transmission probability, capital T, which includes the k2/k1 flux factor, is bounded, and it is the thing that adds with reflection to give one.",
    ],
  },
  hints: [
    { text: "Go back to where t was first written down. What two quantities was it comparing, and did anything in that definition promise a result at most as big as one?" },
    { text: "Probability conservation is a statement about how much probability flows in and how much flows out per unit time. Write down what that conserved statement actually equates." },
    { text: "Both outgoing quantities carry a speed as well as a height, and the two sides of the step have different speeds. Find the factor that difference contributes, and attach it before you compare anything with one." },
  ],
  solution: {
    steps: [
      { description: "$t$ is a wave amplitude, not a probability, and nothing in the derivation ever claims $|t|\\le1$." },
      { description: "The actual transmission *probability* $T=(k_2/k_1)|t|^2$ includes the flux-correction factor $k_2/k_1$, and it's $T$ (together with $R$) that's guaranteed to satisfy $R+T=1$, hence $0\\le T\\le1$." },
    ],
    finalAnswer: "t is an amplitude, not a probability, so it is not bounded by 1. Only the flux-corrected transmission probability T = (k2/k1)|t|^2 is guaranteed to stay within [0,1].",
  },
  explanation: {
    correctIdea: "This is why the k2/k1 factor in the T formula is not optional: it converts an unbounded amplitude ratio into a bounded probability.",
    whyCorrect: "The lesson's algebra gives R+T=1 identically, and it is R and T, not r and t, that appear in that identity. A sum of two nonnegative numbers equal to 1 forces each of them into [0,1]; nothing analogous constrains the bare amplitudes.",
    whyWrong: ["Concluding 'something is wrong with the derivation' because t>1 is possible misunderstands the distinction between wave amplitudes (which can exceed 1) and probabilities (which cannot), a distinction present since the first lesson on wavefunctions."],
  },
};
