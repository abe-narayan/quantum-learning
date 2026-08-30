import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const photonEncodingOptions: MultipleChoiceProblem = {
  meta: {
    slug: "photon-encoding-options",
    title: "Which Property Can Encode a Photonic Qubit?",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/photonic-qubits",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["photonic-qubits"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/photonic-qubits"],
  },
  question: {
    type: "multiple-choice",
    prompt: "A photonic qubit is encoded in some two-valued property of a single photon. Which of these photon properties could not serve that role at all?",
    options: [
      { id: "a", text: "Rest mass (a light photon versus a heavy one)" },
      { id: "b", text: "Polarization (horizontal versus vertical axis)" },
      { id: "c", text: "Path (which of two waveguides it travels)" },
      { id: "d", text: "Arrival time (which of two time bins it lands in)" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Polarization is one of the two encodings this lesson builds on, and it is what real BB84 hardware sends down a fiber.",
      c: "Path encoding is the lesson's other named option: a photon in superposition across two waveguides is a photonic qubit.",
      d: "Time-bin encoding is a working photonic qubit encoding, standard in fiber links. This lesson focuses on polarization and path, but arrival time is a two-valued property all the same.",
    },
    defaultIncorrectFeedback: "An encoding needs a property that takes two distinguishable values. Ask which of these four takes only one value, the same value, for every photon there is.",
  },
  hints: [
    { text: "An encoding needs a property with two distinguishable settings, one for |0⟩ and one for |1⟩." },
    { text: "Three of these four properties differ from photon to photon. One is the same number for every photon in the universe." },
    { text: "Photons are massless. There is no heavy photon to pair against a light one." },
  ],
  solution: {
    steps: [{ description: "Every photon has zero rest mass, so rest mass takes one value and cannot label two basis states. Polarization, path and arrival time each take two distinguishable settings, which is what an encoding needs." }],
    finalAnswer: "Rest mass: it is zero for every photon, so there is no second value to encode |1⟩ against.",
  },
  explanation: {
    correctIdea: "A qubit encoding needs a physical property that can take two distinguishable values on the same particle. Rest mass fails that test for photons before any hardware question arises.",
    whyCorrect: "An encoding needs a property that takes two distinguishable values. Rest mass takes exactly one value for every photon there is, so there is nothing to label |1⟩ with, while polarization, path and time bin each supply the required pair.",
    whyWrong: [
      { optionId: "b", text: "Names the lesson's primary encoding. Horizontal and vertical are two settings of one property." },
      { optionId: "c", text: "Names the lesson's second encoding. Which of two waveguides the photon is in is two-valued." },
      { optionId: "d", text: "Names time-bin encoding, real and in use, just not this lesson's focus." },
    ],
  },
};
