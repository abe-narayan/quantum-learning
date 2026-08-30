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
      {
        phrases: ["spread evenly", "uniformly across", "uniform", "evenly", "applies to every sifted bit", "every bit", "each bit", "same error rate throughout", "same probability", "randomly distributed", "independently", "not concentrated"],
        missingFeedback:
          "Sampling only works if what you are sampling sits the same way everywhere. Say how Eve's disturbance is distributed across the sifted bits.",
      },
      {
        phrases: ["representative sample", "representative", "statistically reflect", "statistic", "estimate the error rate", "estimate the error", "estimate", "with high confidence", "confidence", "a large enough sample", "law of large numbers"],
        missingFeedback:
          "You have said how the disturbance is distributed. Now say what the sample buys them: what can they work out about the bits they never checked, and how sure can they be of it?",
      },
      {
        phrases: [
          "discard the sample",
          "discard",
          "sacrificed bits",
          "sacrific",
          "thrown away",
          "throw away",
          "never used",
          "not used as key",
          "remaining key stays secret",
          "rest of the key",
          "remaining bits",
          "unused portion stays private",
          "never revealed",
        ],
        missingFeedback:
          "You have explained why a sample tracks the true error rate. The other half is why it costs nothing: say what happens to the positions Alice and Bob read out over the public channel, and whether any of them survives into the final key.",
      },
    ],
    incorrectFeedback:
      "You answered that 'checking some bits is faster', which is a cost argument rather than a correctness one. Three things have to hold: how an eavesdropper's damage is distributed across the sifted key, what that distribution lets a random subset tell you about the whole, and why the bits compared in public are harmless afterwards.",
    partialFeedback:
      "Some of it is there. Check all three: how the damage is spread, what a random subset therefore tells you about the whole, and what becomes of the positions you compared in public.",
    modelAnswers: [
      "Eve's disturbance is spread evenly across the sifted key, not concentrated in a few positions, so a random sample is representative and lets Alice and Bob estimate the error rate of the whole key with high confidence. The sampled bits are then discarded, so revealing them costs no secrecy.",
      "Because Eve has to guess a basis on every bit independently, the same probability of a flip applies to each bit. A large enough sample therefore statistically reflects the whole key, and since those bits are thrown away afterwards the rest of the key stays secret.",
    ],
  },
  hints: [
    { text: "Eve's intercept-resend attack hits each sifted position on its own, at one fixed rate, with no preference for any particular position. Say what that means for where the errors end up." },
    { text: "If a rate is the same everywhere along the key, a random subset of positions has a rate of its own. How close should the two be, and what makes them close?" },
    { text: "Now account for the cost. The compared positions were read out over a public channel. Say what Alice and Bob do with them next, and what that means for the secrecy of what is left." },
  ],
  solution: {
    steps: [
      { description: "An intercept-resend eavesdropper disturbs each sifted bit independently with the same $25\\%$ probability, so the error is spread uniformly rather than concentrated on a few bits." },
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
