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
      {
        phrases: ["no net charge", "neutral", "no charge for", "field to grip"],
        missingFeedback:
          "Say what an ion trap's fields actually pull on, and what the particle in question is missing.",
      },
      {
        phrases: ["induced dipole", "focused light", "intensity", "polarizability", "dipole force", "brightest point"],
        missingFeedback:
          "You have said why the electric trap has nothing to hold. Now name the mechanism tweezers use instead, and say what property of the light does the holding.",
      },
    ],
    incorrectFeedback: "Two things. First, say exactly what an ion trap's fields push on, and why an atom of the kind used here offers them nothing to push on. Second, name the different handle a tightly focused beam gets on such an atom, and what property of the beam the atom is drawn toward.",
    partialFeedback: "Good. Now name the mechanism rather than gesturing at it: what does the beam induce in the atom, and which feature of the beam does the atom then seek out?",
    modelAnswers: [
      "An ion trap pulls on a charge, and a neutral atom has no net charge for the field to grip, so the trap has nothing to act on. Optical tweezers instead use an induced dipole: tightly focused light polarizes the atom and pulls it toward the brightest point.",
      "The atom is neutral, so an electric field exerts no net force on it. Tweezers work through the dipole force, using the intensity gradient of focused light to hold the atom where the light is most intense.",
    ],
  },
  hints: [
    { text: "An ion trap's electric fields exert force on a net charge. Ask what this atom has in that department." },
    { text: "A beam of light polarises the atom slightly. Ask what force that gives you, and which way it points." },
    { text: "The atom is pulled toward the brightest point of the beam, at its focus." },
  ],
  solution: {
    steps: [
      { description: "An ion trap's electric fields exert force directly on a net electric charge, which is the whole basis of the confinement mechanism." },
      { description: "A neutral atom carries no net charge, so an electric field exerts no net force on it the same way." },
      { description: "Optical tweezers instead use a focused laser beam. The atom's induced electric dipole, caused by the light itself, interacts with the light's intensity gradient and is drawn toward the point of highest intensity. That is a different physical mechanism, suited to an uncharged particle." },
    ],
    finalAnswer: "A neutral atom has no net charge for an electric field to grip; optical tweezers instead use an induced-dipole interaction with focused light intensity to trap it.",
  },
  explanation: {
    correctIdea: "This makes explicit why the trapped-ion lesson's mechanism does not transfer to neutral atoms, and what replaces it.",
    whyCorrect: "An ion trap acts on charge, and a neutral atom presents none. A focused beam instead induces a dipole in the atom and draws it up the intensity gradient, so the handle is the atom's polarisability rather than its charge.",
    whyWrong: ["Saying 'lasers are used instead of electric fields' without explaining why, namely charge versus no charge, misses the physical reasoning."],
  },
};
