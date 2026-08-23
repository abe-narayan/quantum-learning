import type { ConceptualProblem } from "@/lib/problems/types";

export const whyReflectionAlwaysPositive: ConceptualProblem = {
  meta: {
    slug: "why-reflection-always-positive",
    title: "Why R > 0 for Any Nonzero Step",
    course: "one-dimensional-systems",
    lesson: "quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["scattering", "step-potential"],
    prerequisites: ["quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Using the formula R = ((k1-k2)/(k1+k2))^2, explain in one sentence why R is strictly positive whenever there is any step at all (V0 != 0), regardless of how large E is.",
    placeholder: "Explain why R is always positive for a nonzero step...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["k1 != k2", "different wavenumbers", "k1 equals k2 only when V0=0"],
      ["squared", "nonzero numerator squared is positive"],
    ],
    incorrectFeedback: "Name both pieces: that k1 and k2 are only equal when V0=0 (any step at all makes them different), and that squaring a nonzero difference always gives a strictly positive result.",
  },
  hints: [{ text: "When are k1 and k2 exactly equal? What does that require about V0?" }],
  solution: {
    steps: [
      { description: "$k_1=k_2$ only when $V_0=0$ (no actual step) — any nonzero $V_0$ makes $k_1\\ne k_2$." },
      { description: "$R=\\left(\\dfrac{k_1-k_2}{k_1+k_2}\\right)^2$ is a square of a nonzero number whenever $k_1\\ne k_2$, hence strictly positive." },
    ],
    finalAnswer: "k1=k2 only when V0=0, so any real step makes the numerator nonzero, and squaring a nonzero number always gives something strictly positive.",
  },
  explanation: {
    correctIdea: "The persistence of reflection is a direct algebraic consequence of the formula's structure, not a separate physical assumption.",
    whyCorrect: "This matches the lesson's own observation about the E -> infinity limit only approaching, never reaching, R=0.",
    whyWrong: ["Arguing this only holds 'for small V0' misses that the algebraic argument (squaring a nonzero difference) works for any V0 != 0, large or small."],
  },
};
