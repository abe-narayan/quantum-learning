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
      "The original concatenated-code threshold theorems (Steane-code based) are often quoted with proven threshold values far below 1%, while surface-code threshold estimates are often quoted at roughly percent-level physical error rates. Explain why these very different numbers are not a contradiction. What is different between the two figures?",
    placeholder:
      "Think about what kind of claim each number represents: a worst-case proof versus a numerical simulation, and under what noise model and decoder each was obtained.",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["rigorous", "proof", "prove", "adversarial", "worst-case", "worst case", "proven", "guarantee"],
        missingFeedback:
          "The measured side is described. The other number is a bound, and the point is what a bound has to survive: every error pattern its assumptions permit, including ones no real device ever produces. Say why that requirement forces the constant down.",
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
          "empirical",
          "crossover",
        ],
        missingFeedback:
          "The bound side is described. The other number is not a bound at all. Say where it comes from: running one concrete error model through one concrete matching algorithm and watching where the logical error rate crosses over. That is a measurement, and a measurement of a favourable case lands higher.",
      },
    ],
    incorrectFeedback:
      "Nothing about the physics differs between the two numbers. What differs is the question each one answers and the standard of evidence behind it. One is a bound that must survive the nastiest error pattern its assumptions allow, which is why it lands low; the other is a measured crossing point for one concrete error model and one concrete matching algorithm, which is why it lands high. Reading them as competing claims about the same quantity is the error.",
    partialFeedback:
      "One side of the comparison is described and the other is missing. Say what standard of evidence sits behind each number, and make clear that the gap between them comes from the standard, not from any disagreement about how the code behaves.",
    modelAnswers: [
      "They are measuring different things. The concatenated-code number comes out of a rigorous proof that has to hold under worst-case adversarial noise, so it is deliberately pessimistic. The percent-level surface code figure comes from numerical simulation with a particular noise model and a specific decoder, so it is realistic but not proven.",
      "One is a proven guarantee against adversarial noise, the other is an empirical crossover found by Monte Carlo simulation of one decoder. Different assumptions and different methods, so different numbers, not a contradiction.",
    ],
  },
  hints: [
    { text: "Ask what each number is a number about. Are the two answering the same question?" },
    { text: "One of them has to hold against every error pattern its assumptions allow, including patterns chosen to be maximally awkward. The other only has to describe one concrete, realistic error model run through one concrete matching algorithm." },
    { text: "Neither number is wrong. They answer different technical questions, and the gap between them is a statement about method, not about the code." },
  ],
  solution: {
    steps: [
      { description: "The concatenated-code threshold theorems are proven as fully rigorous mathematical theorems, typically under a fairly general (often adversarial or local-stochastic) noise model. To remain valid against that worst case, the constants they can actually prove tend to be small and pessimistic, often far below 1%." },
      { description: "Surface-code threshold values, by contrast, are typically obtained by large-scale numerical simulation (e.g. Monte Carlo decoding runs) for one specific, more realistic noise model and one specific decoding algorithm. They are not proven for an adversarial worst case, but they come out empirically far more optimistic, roughly percent-level." },
      { description: "Comparing 'the' threshold across code families, proof techniques, and noise-model assumptions is therefore comparing answers to different questions: a different quoted number reflects different assumptions and methods, not a disagreement about the underlying physics." },
    ],
    finalAnswer:
      "The gap reflects rigorous-but-pessimistic (concatenated-code proofs, adversarial noise) versus numerical-but-realistic (surface-code simulations, specific noise model and decoder): different assumptions and methods, not contradictory physics.",
  },
  explanation: {
    correctIdea:
      "Threshold values are only meaningful relative to a specific code, noise model, and proof or estimation method; they are not a single universal constant of nature.",
    whyCorrect:
      "The two numbers answer different questions. One is a bound that has to survive the nastiest error pattern its assumptions permit; the other is a measured crossing point for one particular error model run through one particular matching algorithm. The gap is a difference of method, not of physics.",
    whyWrong: [
      "Assuming one of the two threshold values must simply be 'wrong', or that the two code families are being compared unfairly, rather than recognizing they are answers to genuinely different technical questions.",
    ],
  },
  relatedConcepts: ["apex/fault-tolerance-frontiers/decoding-surface-codes"],
};
