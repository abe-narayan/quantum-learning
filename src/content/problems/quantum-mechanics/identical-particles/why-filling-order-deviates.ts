import type { ConceptualProblem } from "@/lib/problems/types";

export const whyFillingOrderDeviates: ConceptualProblem = {
  meta: {
    slug: "why-filling-order-deviates",
    title: "Why 4s Fills Before 3d",
    course: "identical-particles",
    lesson: "quantum-mechanics/identical-particles/multi-electron-atoms-introduction",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["shell-filling", "conceptual"],
    prerequisites: ["quantum-mechanics/identical-particles/multi-electron-atoms-introduction"],
  },
  question: {
    type: "conceptual",
    prompt: "Real multi-electron atoms fill 4s before 3d, even though n=3<n=4. Name the specific physical effect responsible, and explain why it depends on l as well as n.",
    placeholder: "This is caused by... which depends on l because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["electron-electron repulsion", "screening", "shielding"],
        missingFeedback:
          "Name the physical effect. It is something that exists only because there is more than one electron in the atom.",
      },
      {
        phrases: ["closer to the nucleus", "penetrat", "depends on l"],
        missingFeedback:
          "You have named the effect. Now say why it treats two orbitals with the same n but different shapes differently: what does the shape change about where the electron spends its time?",
      },
    ],
    incorrectFeedback: "You answered '4s is lower in energy', which is the observation the question asks you to explain. Hydrogen's ladder depends on n alone because its potential is exactly Coulombic. Ask what the outer electron in a many-electron atom actually feels instead, and why two states with the same n would feel it differently.",
    partialFeedback: "Now say why different l states at the same n are affected differently by this effect.",
    modelAnswers: [
      "It is electron-electron screening: the inner electrons shield the nuclear charge, so an outer electron does not see the full Z. That depends on l because low-l orbitals penetrate the inner cloud and get closer to the nucleus, where the shielding is weaker, so 4s ends up below 3d.",
      "Shielding from the other electrons breaks hydrogen's l-independence. Different l values at the same n penetrate the core differently, so their energies split and the answer depends on l as well as n.",
    ],
  },
  hints: [
    { text: "Hydrogen's l-independence rested on the potential being exactly 1/r. Ask what an outer electron in a many-electron atom is actually sitting in." },
    { text: "The inner electrons sit between the nucleus and the outer one, and they carry charge of their own. Name the effect that has on the charge the outer electron experiences." },
    { text: "Now compare a 4s radial function with a 3d one near the origin. One of them spends noticeably more of its time inside the inner cloud than the other. What does that do to the charge it sees?" },
  ],
  solution: {
    steps: [
      { description: "The effect is electron-electron repulsion / screening: inner electrons partially shield outer electrons from the full nuclear charge." },
      { description: "This depends on l because different l states at the same n have different radial shapes: lower-l states penetrate closer to the nucleus, feeling less screening and more attraction than higher-l states at the same n." },
      { description: "So energy depends on both n and l in real atoms, unlike in pure hydrogen, and a lower-n, higher-l state (3d) can end up higher in energy than a higher-n, lower-l state (4s). That is the 4s-before-3d filling order." },
    ],
    finalAnswer: "Electron-electron screening breaks hydrogen's exact l-independence, since different l states at the same n penetrate the inner electron cloud differently, which can push 3d above 4s in energy.",
  },
  explanation: {
    correctIdea: "This connects back to Hydrogen Energy Levels' l-independence result and explains why it fails for real multi-electron atoms.",
    whyCorrect: "Screening makes the effective nuclear charge depend on how far in the electron gets, and how far in it gets depends on l through the centrifugal barrier. So an effect that is invisible in one-electron hydrogen becomes an l-dependence in a many-electron atom.",
    whyWrong: ["Attributing this to exclusion alone misses the point: exclusion sets the capacity per orbital, while screening is what changes the relative ENERGY ordering of the orbitals."],
  },
};
