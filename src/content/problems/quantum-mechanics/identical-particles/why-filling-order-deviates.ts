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
      ["electron-electron repulsion", "screening", "shielding"],
      ["closer to the nucleus", "penetrat", "depends on l"],
    ],
    incorrectFeedback: "Name the specific effect (screening/electron-electron repulsion) and explain why it makes energy depend on l, not just n.",
    partialFeedback: "Good — now be explicit about why different l states at the same n are affected differently by this effect.",
  },
  hints: [
    { text: "Hydrogen's exact l-independence of energy relies on a pure 1/r potential — only the nucleus, no other electrons." },
    { text: "In a multi-electron atom, inner electrons partially 'screen' the nuclear charge felt by outer electrons." },
    { text: "Different l states at the same n have different radial shapes, so they penetrate the inner screening electron cloud differently — breaking l-independence." },
  ],
  solution: {
    steps: [
      { description: "The effect is electron-electron repulsion / screening: inner electrons partially shield outer electrons from the full nuclear charge." },
      { description: "This depends on l because different l states (at the same n) have different radial shapes — some (lower l) penetrate closer to the nucleus, feeling less screening and more attraction, than others (higher l) at the same n." },
      { description: "This makes energy depend on both n and l in real atoms (unlike pure hydrogen), and can make a lower-n, higher-l state (like 3d) end up higher in energy than a higher-n, lower-l state (like 4s) — explaining the 4s-before-3d filling order." },
    ],
    finalAnswer: "Electron-electron screening breaks hydrogen's exact l-independence, since different l states at the same n penetrate the inner electron cloud differently — this can make 3d sit above 4s in energy.",
  },
  explanation: {
    correctIdea: "This connects directly back to Hydrogen Energy Levels' l-independence result and explains precisely why it fails for real multi-electron atoms.",
    whyCorrect: "Matches the lesson's Mathematical Development section's explicit explanation of screening.",
    whyWrong: ["Attributing this to exclusion alone misses the point — exclusion sets capacity per orbital, but screening is what changes the relative ENERGY ordering of orbitals."],
  },
};
