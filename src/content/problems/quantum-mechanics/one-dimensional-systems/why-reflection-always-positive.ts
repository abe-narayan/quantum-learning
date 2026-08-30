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
      {
        phrases: ["k1=k2 only when", "k1 = k2 only when", "only when v0=0", "only when v0 = 0", "only if v0 is zero", "numerator nonzero", "nonzero numerator", "numerator is nonzero", "different wavenumbers", "wavenumbers differ", "the two wavenumbers are not equal", "a step changes the wavenumber"],
        missingFeedback:
          "Look at the numerator. Say under exactly what circumstance those two quantities would come out the same, and whether that ever happens for a real step.",
      },
      {
        phrases: ["squared", "square", "never zero", "cannot vanish", "can not vanish", "always positive", "positive whatever the sign", "sign does not matter"],
        missingFeedback:
          "You have said the two wavenumbers differ for any real step. Finish it: apply the operation the formula performs on that difference, and say what that operation can never produce from a nonzero real input.",
      },
    ],
    incorrectFeedback: "You gave a physical reason (the particle 'feels' the step) instead of reading it off the formula. Two facts do the whole job: what the numerator can and cannot be when V0 is anything but zero, and what raising a nonzero real number to the second power gives.",
    modelAnswers: [
      "The two wavenumbers are not equal unless V0 is zero, so any real step makes the numerator nonzero, and squaring a nonzero number always gives something strictly positive.",
      "A step changes the wavenumber, so the numerator is nonzero whenever V0 is not zero. The square of a nonzero number is always positive, no matter how large E is.",
    ],
  },
  hints: [
    { text: "R is built from a single fraction. Ask first when that fraction's top line could possibly be zero." },
    { text: "The top line vanishes only if the two wavenumbers coincide, and they coincide only under one condition on the potential. State that condition." },
    { text: "So for every real step the top line is a nonzero real number. Now apply the exponent that sits outside the bracket and say what values the result can take." },
  ],
  solution: {
    steps: [
      { description: "$k_1=k_2$ only when $V_0=0$, meaning no step at all; any nonzero $V_0$ makes $k_1\\ne k_2$." },
      { description: "$R=\\left(\\dfrac{k_1-k_2}{k_1+k_2}\\right)^2$ is a square of a nonzero number whenever $k_1\\ne k_2$, hence strictly positive." },
    ],
    finalAnswer: "k1=k2 only when V0=0, so any real step makes the numerator nonzero, and squaring a nonzero number always gives something strictly positive.",
  },
  explanation: {
    correctIdea: "The persistence of reflection is a direct algebraic consequence of the formula's structure, not a separate physical assumption.",
    whyCorrect: "Raising E shrinks the gap between the two wavenumbers but never closes it while the step is there, so the numerator approaches zero without arriving. Squaring a number that is small but nonzero still gives something strictly above zero.",
    whyWrong: ["Arguing this only holds 'for small V0' misses that the algebraic argument (squaring a nonzero difference) works for any V0 != 0, large or small."],
  },
};
