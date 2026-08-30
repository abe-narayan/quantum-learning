import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const recommendPlatformForNetworking: MultipleChoiceProblem = {
  meta: {
    slug: "recommend-platform-for-networking",
    title: "Which Platform Fits a Networking-First Application?",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["capstone"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms"],
  },
  question: {
    type: "multiple-choice",
    prompt: "An application needs to distribute entanglement between two physically distant quantum computers. Which platform's comparison-table entry is naturally suited to this specific role?",
    options: [
      { id: "a", text: "Photonic, because the qubit carrier is light, which already travels between locations" },
      { id: "b", text: "Trapped ions, because a two-second coherence time survives the flight between sites" },
      { id: "c", text: "Spin qubits, because their small footprint packs the most qubits per chip at each end" },
      { id: "d", text: "Superconducting qubits, because nanosecond gates finish before the link decoheres" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "A trapped ion does not fly anywhere. Its coherence time is spent sitting in a trap, which helps local computation and does nothing to carry a state across a room.",
      c: "Qubit density at each end says nothing about the link between the ends. Small dots are a fabrication win, not a transmission mechanism.",
      d: "Fast gates shorten the local circuit, but the entanglement still has to physically get from one machine to the other, and a superconducting qubit cannot leave its fridge.",
    },
    defaultIncorrectFeedback: "The task is to move a quantum state between distant machines. Ask which platform's qubit carrier can leave the device at all.",
  },
  hints: [
    { text: "The task is transmission between two machines, not computation inside one." },
    { text: "Three of these platforms encode the qubit in something bolted to a chip or a trap." },
    { text: "One platform's qubit carrier is already in motion by its nature." },
  ],
  solution: {
    steps: [{ description: "Photons are the fit here: light already travels, so a photonic qubit is the natural carrier for connecting physically separate quantum devices." }],
    finalAnswer: "Photonic, since light is the one qubit carrier here that can leave the device and travel to the other machine.",
  },
  explanation: {
    correctIdea: "Matching a platform to an application means matching the application's binding requirement, here mobility, rather than picking the platform with the best headline number.",
    whyCorrect: "The task is transport, and only one of these carriers moves on its own. A photon can be launched down a fibre to a second machine, while the other three platforms hold their qubits in place by design, which is what suits them to computing and not to linking.",
    whyWrong: [
      { optionId: "b", text: "Cites a real trapped-ion strength that applies to a stationary qubit. Coherence does not transport a state." },
      { optionId: "c", text: "Cites density at the endpoints, which is a fabrication property rather than a link property." },
      { optionId: "d", text: "Cites gate speed, which shortens local circuits and leaves the distance problem untouched." },
    ],
  },
};
