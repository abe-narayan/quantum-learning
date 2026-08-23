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
    prompt: "Which of these is NOT one of the photon properties this lesson names for encoding a qubit?",
    options: [
      { id: "a", text: "The photon's rest mass" },
      { id: "b", text: "Polarization (horizontal vs. vertical)" },
      { id: "c", text: "Path (which of two waveguides/fibers it travels)" },
      { id: "d", text: "Both (b) and (c) are valid encodings named in the lesson" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Polarization IS one of the two encodings the lesson names — this is a valid encoding, not the answer to 'which is NOT.'",
      c: "Path encoding IS the other encoding the lesson names — also valid, not the answer to 'which is NOT.'",
      d: "Both b and c are indeed valid — but the question asks which option is NOT a named encoding, which is (a).",
    },
    defaultIncorrectFeedback: "A photon has zero rest mass — this can't serve as a two-level encoding since there's no 'other value' to encode against.",
  },
  hints: [
    { text: "Photons are massless particles — rest mass isn't a two-valued property that could encode a qubit." },
    { text: "The lesson names exactly two encodings: polarization and path." },
    { text: "Rest mass isn't one of them, and couldn't be (photons have no rest mass at all, let alone two distinct values of it)." },
  ],
  solution: {
    steps: [{ description: "Photons have zero rest mass — not a two-valued property at all, so it cannot serve as a qubit encoding. Polarization and path are the two valid encodings this lesson names." }],
    finalAnswer: "(a) The photon's rest mass",
  },
  explanation: {
    correctIdea: "This tests recall of the lesson's specific named encodings while flagging a physically impossible distractor (rest mass) rather than just a plausible-but-unmentioned one.",
    whyCorrect: "Matches the lesson's Engineering Development section.",
    whyWrong: ["Polarization and path are both explicitly named, real, standard photonic qubit encodings."],
  },
};
