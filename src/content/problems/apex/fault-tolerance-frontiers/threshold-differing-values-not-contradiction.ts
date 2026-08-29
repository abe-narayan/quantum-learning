import type { ConceptualProblem } from "@/lib/problems/types";

export const thresholdDifferingValuesNotContradiction: ConceptualProblem = {
  meta: {
    slug: "threshold-differing-values-not-contradiction",
    title: "Why Threshold Theorems Quote Different Numbers",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/the-threshold-theorem",
    difficulty: "master",
    estimatedMinutes: 8,
    problemType: "conceptual",
    tags: ["threshold-theorem", "surface-codes", "concatenated-codes"],
    prerequisites: ["apex/fault-tolerance-frontiers/the-threshold-theorem", "apex/fault-tolerance-frontiers/decoding-surface-codes"],
  },
  question: {
    type: "conceptual",
    prompt:
      "The original concatenated-code threshold theorems (Steane-code based) are often quoted with proven threshold values far below 1%, while surface-code threshold estimates are often quoted at roughly percent-level physical error rates. Explain why these very different numbers are not a contradiction -- what is actually different between the two figures?",
    placeholder:
      "Think about what kind of claim each number represents: a worst-case proof versus a numerical simulation, and under what noise model and decoder each was obtained.",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["rigorous", "proof", "prove", "adversarial", "worst-case", "worst case", "proven", "theorem"],
        missingFeedback:
          "You have described the surface-code side. Say what kind of claim the concatenated-code number is: a rigorous theorem that has to hold against a worst-case (often adversarial) noise model, which is why the constant it can prove comes out small.",
      },
      {
        phrases: [
          "numerical",
          "numerics",
          "simulation",
          "simulated",
          "monte carlo",
          "decoder",
          "specific noise model",
          "particular noise model",
          "heuristic",
          "estimate",
          "empirical",
        ],
        missingFeedback:
          "You have described the concatenated-code side. Say what kind of claim the surface-code number is: a numerical estimate from simulating one specific noise model with one specific decoder, which is not a worst-case guarantee and so comes out far more optimistic.",
      },
    ],
    incorrectFeedback:
      "The concatenated-code threshold theorems are typically fully rigorous, adversarial-noise-model proofs, which tend to yield small, pessimistic constants; surface-code threshold values are typically numerical, simulation-based estimates for one specific noise model and decoder, which tend to be far more optimistic and hardware-relevant. Different assumptions and methods, not different physics.",
    partialFeedback:
      "You've identified one side of the distinction. Make sure your answer also addresses the other type of claim (rigorous adversarial proof vs. numerical/simulation-based estimate) and why that difference in method, not different underlying physics, explains the different numbers.",
  },
  hints: [
    { text: "Consider what kind of mathematical claim an adversarial-noise proof can guarantee, versus what a large-scale numerical simulation for one specific, realistic noise model can only estimate." },
    { text: "A worst-case adversarial proof must hold even against the worst possible noise pattern consistent with its general assumptions; a numerical simulation only has to describe one specific, realistic noise model and decoder." },
    { text: "Neither number is wrong -- they answer different technical questions." },
  ],
  solution: {
    steps: [
      { description: "The concatenated-code threshold theorems are proven as fully rigorous mathematical theorems, typically under a fairly general (often adversarial or local-stochastic) noise model. To remain valid against that worst case, the constants they can actually prove tend to be small and pessimistic, often far below 1%." },
      { description: "Surface-code threshold values, by contrast, are typically obtained by large-scale numerical simulation (e.g. Monte Carlo decoding runs) for one specific, more realistic noise model and one specific decoding algorithm -- not proven for an adversarial worst case, but empirically far more optimistic, roughly percent-level." },
      { description: "Comparing 'the' threshold across code families, proof techniques, and noise-model assumptions is therefore comparing answers to different questions: a different quoted number reflects different assumptions and methods, not a disagreement about the underlying physics." },
    ],
    finalAnswer:
      "The gap reflects rigorous-but-pessimistic (concatenated-code proofs, adversarial noise) versus numerical-but-realistic (surface-code simulations, specific noise model and decoder) -- different assumptions and methods, not contradictory physics.",
  },
  explanation: {
    correctIdea:
      "Threshold values are only meaningful relative to a specific code, noise model, and proof or estimation method; they are not a single universal constant of nature.",
    whyCorrect:
      "This is exactly the honest distinction the lesson's Common Mistakes section draws: rigorous adversarial proofs versus numerical, decoder-specific simulations.",
    whyWrong: [
      "Assuming one of the two threshold values must simply be 'wrong', or that the two code families are being compared unfairly, rather than recognizing they are answers to genuinely different technical questions.",
    ],
  },
  relatedConcepts: ["apex/fault-tolerance-frontiers/decoding-surface-codes"],
};
