import type { ConceptualProblem } from "@/lib/problems/types";

export const whyOpticalTweezersWorkForNeutralAtoms: ConceptualProblem = {
  meta: {
    slug: "why-optical-tweezers-work-for-neutral-atoms",
    title: "Why Optical Tweezers, Not Electric Fields, Trap Neutral Atoms",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/neutral-atoms",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["neutral-atoms"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/neutral-atoms"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why an electric-field-based ion trap can't confine a neutral atom the way it confines an ion, and what optical tweezers use instead.",
    placeholder: "An ion trap's electric fields work by pulling on a charge; a neutral atom has no net charge, so...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["no net charge", "neutral", "no charge for", "field to grip"],
      ["induced dipole", "focused light", "intensity", "optical tweezer"],
    ],
    incorrectFeedback: "Address why the ion trap's mechanism specifically requires charge, and what optical tweezers use in its place.",
    partialFeedback: "Good — now be explicit about the mechanism optical tweezers actually use (light intensity / induced dipole).",
  },
  hints: [
    { text: "An ion trap's electric fields exert force on a NET CHARGE — a neutral atom has none." },
    { text: "Optical tweezers instead rely on how an atom's INDUCED electric dipole interacts with light intensity." },
    { text: "The atom is attracted toward the point of highest light intensity, at the laser's focus." },
  ],
  solution: {
    steps: [
      { description: "An ion trap's electric fields exert force directly on a net electric charge — this is the whole basis of the confinement mechanism." },
      { description: "A neutral atom carries no net charge, so an electric field exerts no net force on it the same way." },
      { description: "Optical tweezers instead use a focused laser beam: the atom's induced electric dipole (caused by the light itself) interacts with the light's intensity gradient, attracting the atom toward the point of highest intensity — a completely different physical mechanism suited to an uncharged particle." },
    ],
    finalAnswer: "A neutral atom has no net charge for an electric field to grip; optical tweezers instead use an induced-dipole interaction with focused light intensity to trap it.",
  },
  explanation: {
    correctIdea: "This makes explicit exactly why the trapped-ion lesson's mechanism doesn't transfer to neutral atoms, and what specifically replaces it.",
    whyCorrect: "Matches the lesson's Engineering Development section's explicit explanation.",
    whyWrong: ["Saying 'lasers are used instead of electric fields' without explaining WHY (charge vs. no charge) misses the actual physical reasoning."],
  },
};
