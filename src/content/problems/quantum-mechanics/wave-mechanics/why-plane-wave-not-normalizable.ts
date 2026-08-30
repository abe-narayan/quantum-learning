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
      {
        phrases: ["|e^(ikx)|^2 = 1", "constant", "modulus 1 everywhere", "never decays", "does not decay", "same everywhere"],
        missingFeedback:
          "Compute the probability density of a plane wave first. Say what it equals as a function of position.",
      },
      {
        phrases: ["diverges", "integral over all space is infinite", "cannot be normalized"],
        missingFeedback:
          "You have the density. Now integrate it over all space and say what you get, and what that means for normalizing the state.",
      },
    ],
    incorrectFeedback: "You said a plane wave has definite momentum, or that it is 'not a real state'. Both are true and neither answers the question. Compute |e^(ikx)|^2 explicitly, then try to carry out the integral over all of x and say what stops you.",
    partialFeedback: "You have half of it. The other half is the arithmetic of the normalization condition itself: write the integral down with the value you just computed inserted, and evaluate it.",
    modelAnswers: [
      "The probability density of a plane wave is constant, the same everywhere and never decaying. Integrating a constant over all space diverges, so the normalization integral is infinite and no rescaling can fix it: it cannot be normalized.",
      "Its modulus is 1 everywhere, so the density does not decay at all. The integral over all space is infinite, so it is not a normalizable state.",
    ],
  },
  hints: [
    { text: "Normalization is a statement about the integral of |psi|^2 over the whole line, so begin by working out the integrand." },
    { text: "e^(ikx) sits on the unit circle for every real x. Write its squared modulus as a function of x and notice that x has dropped out." },
    { text: "Now integrate that from minus infinity to plus infinity, and compare the result with what normalization demands." },
  ],
  solution: {
    steps: [
      { description: "$|e^{ikx}|^2=1$ for every $x$, so the density never decays." },
      { description: "$\\int_{-\\infty}^{\\infty}1\\,dx$ diverges, so no rescaling constant can make this integral equal 1." },
    ],
    finalAnswer: "A plane wave's probability density is constant (never decaying), so its normalization integral diverges. No rescaling fixes this.",
  },
  explanation: {
    correctIdea: "Plane waves are useful idealized momentum eigenstates but not themselves valid, normalizable physical states.",
    whyCorrect: "This is why wave packets (superpositions across a band of momenta) are needed for real, localized particles.",
    whyWrong: ["Saying plane waves 'have infinite energy' misses the issue: the problem is the normalization integral diverging, not the energy."],
  },
};
