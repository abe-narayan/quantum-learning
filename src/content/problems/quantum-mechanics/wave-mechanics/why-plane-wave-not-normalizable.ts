import type { ConceptualProblem } from "@/lib/problems/types";

export const whyPlaneWaveNotNormalizable: ConceptualProblem = {
  meta: {
    slug: "why-plane-wave-not-normalizable",
    title: "Why a Plane Wave Cannot Be Normalized",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/free-particle-wave-packets",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["wave-packet", "normalization"],
    prerequisites: ["quantum-mechanics/wave-mechanics/free-particle-wave-packets"],
  },
  question: {
    type: "conceptual",
    prompt: "In one or two sentences, explain why a single plane wave e^(ikx) cannot represent a physical particle state, using the normalization condition.",
    placeholder: "Explain why plane waves aren't normalizable...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["|e^(ikx)|^2 = 1", "constant magnitude", "modulus 1 everywhere"],
      ["diverges", "integral over all space is infinite", "cannot be normalized"],
    ],
    incorrectFeedback: "Explain both pieces: that |e^(ikx)|^2 = 1 everywhere (constant, never decaying), and that integrating a constant over all of infinite space diverges.",
    partialFeedback: "You're partway there — be explicit that the integral of a constant over infinite space diverges.",
  },
  hints: [{ text: "What is |e^(ikx)|^2, and what happens when you integrate a constant over all of x from -infinity to infinity?" }],
  solution: {
    steps: [
      { description: "$|e^{ikx}|^2=1$ for every $x$ — the density never decays." },
      { description: "$\\int_{-\\infty}^{\\infty}1\\,dx$ diverges, so no rescaling constant can make this integral equal 1." },
    ],
    finalAnswer: "A plane wave's probability density is constant (never decaying), so its normalization integral diverges — no rescaling fixes this.",
  },
  explanation: {
    correctIdea: "Plane waves are useful idealized momentum eigenstates but not themselves valid, normalizable physical states.",
    whyCorrect: "This is exactly why wave packets (superpositions across a band of momenta) are needed for real, localized particles.",
    whyWrong: ["Saying plane waves 'have infinite energy' misses the actual issue — the problem is the normalization integral diverging, not the energy."],
  },
};
