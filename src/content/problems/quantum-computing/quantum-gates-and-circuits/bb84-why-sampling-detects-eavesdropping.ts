import type { ConceptualProblem } from "@/lib/problems/types";

export const bb84WhySamplingDetectsEavesdropping: ConceptualProblem = {
  meta: {
    slug: "bb84-why-sampling-detects-eavesdropping",
    title: "Why a Public Sample Suffices to Detect Eve",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["bb84", "quantum-key-distribution", "eavesdropping"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Why does comparing a random public sample of the sifted key (and then discarding that sample) work to detect eavesdropping, rather than Alice and Bob needing to inspect their entire sifted key?",
    placeholder: "Think about whether the eavesdropper's disturbance is spread evenly across the sifted key, or concentrated in a few positions...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["spread evenly", "uniformly across", "applies to every sifted bit", "same error rate throughout", "randomly distributed"],
      ["representative sample", "statistically reflect", "estimate the error rate", "with high confidence", "a large enough sample"],
      ["discard the sample", "sacrificed bits", "remaining key stays secret", "unused portion stays private", "rest of the key is never revealed"],
    ],
    incorrectFeedback:
      "Address three things: why an eavesdropper's disturbance is spread evenly (not concentrated) across the sifted key, why that means a random sample statistically reflects the true error rate, and why revealing the sampled bits publicly doesn't compromise the rest of the key.",
    partialFeedback:
      "Good start — make sure you cover both why a sample is statistically representative and why discarding it afterward keeps the remaining key secret.",
  },
  hints: [
    { text: "Eve's intercept-resend attack disturbs every sifted bit independently with the same probability (1/4) — it doesn't concentrate errors on a few positions." },
    { text: "A random sample of a large key, if the true error rate is uniform, statistically reflects that rate with high confidence — you don't need to check every bit to estimate it." },
    { text: "Alice and Bob never use the sampled bits as part of their actual secret key — they're revealed publicly and thrown away, so revealing them leaks nothing about the retained key." },
  ],
  solution: {
    steps: [
      { description: "An intercept-resend eavesdropper disturbs each sifted bit independently with the same $25\\%$ probability — the error is spread uniformly, not concentrated on a few bits." },
      { description: "Because the error rate is uniform, a random subset of the sifted key is a statistically representative sample of the whole: comparing it publicly gives a reliable estimate of the true error rate without touching every bit." },
      { description: "The sampled positions are discarded afterward and never used as key material, so publicly revealing their bit values leaks nothing about the remaining, retained key." },
    ],
    finalAnswer:
      "A random sample works because Eve's disturbance is uniform across the sifted key (making the sample statistically representative) and because the sampled bits are discarded, not kept as key material.",
  },
  explanation: {
    correctIdea:
      "Sampling trades a small, deliberately sacrificed piece of the key for a statistically reliable estimate of the whole key's error rate.",
    whyCorrect:
      "Both pieces are necessary: uniformity is what makes the sample representative, and discarding the sample is what keeps the estimate from costing Alice and Bob any of their actual secret key.",
    whyWrong: [
      "Inspecting the entire key would also detect eavesdropping, but it would consume the entire key as the cost of verification, leaving nothing left over to use as a secret.",
    ],
  },
};
