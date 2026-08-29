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
        phrases: ["T rather than t", "capital T", "transmission probability", "includes the k2/k1 factor", "k2/k1", "flux factor", "flux correction", "r+t=1", "r + t = 1", "reflection plus transmission"],
        missingFeedback:
          "You have said t is an amplitude rather than a probability. Name the quantity that is bounded: the transmission probability T = (k₂/k₁)|t|², whose flux factor is what makes R + T = 1 and keeps T inside [0,1].",
      },
      ["amplitude", "not itself a probability", "flux-corrected"],
    ],
    incorrectFeedback: "Name both pieces: that t is an amplitude, not a probability, and that the actual transmission probability T = (k2/k1)*|t|^2 (which includes the flux-correction factor) is what's guaranteed to stay between 0 and 1, not t itself.",
  },
  hints: [{ text: "Is t itself ever claimed to be a probability anywhere in the derivation?" }],
  solution: {
    steps: [
      { description: "$t$ is a wave amplitude, not a probability — nothing in the derivation ever claims $|t|\\le1$." },
      { description: "The actual transmission *probability* $T=(k_2/k_1)|t|^2$ includes the flux-correction factor $k_2/k_1$, and it's $T$ (together with $R$) that's guaranteed to satisfy $R+T=1$, hence $0\\le T\\le1$." },
    ],
    finalAnswer: "t is an amplitude, not a probability, so it isn't bounded by 1 — only the flux-corrected transmission probability T = (k2/k1)|t|^2 is guaranteed to stay within [0,1].",
  },
  explanation: {
    correctIdea: "This is exactly why the k2/k1 factor in the T formula isn't optional — it's what converts an unbounded amplitude ratio into a genuine, bounded probability.",
    whyCorrect: "Matches the R+T=1 algebraic identity proven directly in the lesson.",
    whyWrong: ["Concluding 'something is wrong with the derivation' because t>1 is possible misunderstands the distinction between wave amplitudes (which can exceed 1) and probabilities (which cannot) — a distinction present since the very first lesson on wavefunctions."],
  },
};
