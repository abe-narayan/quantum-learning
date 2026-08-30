import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const rydbergBlockadeMechanism: MultipleChoiceProblem = {
  meta: {
    slug: "rydberg-blockade-mechanism",
    title: "What Does Rydberg Blockade Actually Do?",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/neutral-atoms",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["neutral-atoms"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/neutral-atoms"],
  },
  question: {
    type: "multiple-choice",
    prompt: "What does Rydberg blockade do, physically, between two nearby neutral atoms?",
    options: [
      { id: "a", text: "One atom's Rydberg excitation shifts its neighbor's levels, so the drive that was resonant no longer is" },
      { id: "b", text: "The huge Rydberg orbital repels the neighbor mechanically, pushing the two atoms further apart in their traps" },
      { id: "c", text: "The tweezer beams holding the two atoms become entangled with each other, and the atoms inherit that entanglement" },
      { id: "d", text: "It suppresses Rydberg excitation across the whole array, which is why atoms are excited one at a time" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The atoms stay put. Blockade shifts where the neighbor's energy levels sit, and a level shift is not a force that moves an atom out of its trap.",
      c: "Tweezer beams position the atoms and take no part in the gate. Blockade is an interaction between the atoms' own internal states.",
      d: "The suppression is conditional and pairwise, not global: it applies to a neighbor while one atom is already excited, and lifts the moment that atom comes back down.",
    },
    defaultIncorrectFeedback: "Blockade works through an energy-level shift: one atom's Rydberg excitation moves the neighbor's levels far enough off resonance that the same drive can no longer excite it.",
  },
  hints: [
    { text: "A Rydberg state has an enormous electron orbit, giving it a strong interaction with a nearby atom." },
    { text: "Ask what that interaction changes about the neighbor: its position, or where its energy levels sit." },
    { text: "A drive tuned to an unshifted transition no longer matches a shifted one, and the effect lasts only while the first atom stays excited." },
  ],
  solution: {
    steps: [{ description: "One atom's Rydberg excitation shifts its neighbor's energy levels through a strong dipole interaction. The drive that was resonant with the neighbor's transition is now off resonance, so the neighbor cannot be excited while the first atom is up. Making the neighbor's response conditional on the first atom's state is what builds the entangling gate." }],
    finalAnswer: "One atom's Rydberg excitation shifts its neighbor's levels off resonance, blocking simultaneous excitation and making the neighbor's response conditional on the first atom's state.",
  },
  explanation: {
    correctIdea: "Blockade is an energy-level shift that lasts only while the first atom is excited, which is what makes it a conditional interaction and so a source of entanglement.",
    whyCorrect: "A Rydberg atom's enormous dipole shifts its neighbour's levels far enough that a drive which was resonant a moment ago no longer is. The neighbour's response therefore depends on whether the first atom is excited, and a conditional response is precisely what an entangling gate needs.",
    whyWrong: [
      { optionId: "b", text: "Turns a level shift into a mechanical push. The atoms do not move; their level structure does." },
      { optionId: "c", text: "Puts the mechanism in the trapping light rather than in the atoms' internal states." },
      { optionId: "d", text: "Makes the suppression global and permanent, which would leave no conditional dependence to entangle two atoms with." },
    ],
  },
};
