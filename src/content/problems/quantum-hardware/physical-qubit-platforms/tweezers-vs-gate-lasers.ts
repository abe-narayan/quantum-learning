import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const tweezersVsGateLasers: MultipleChoiceProblem = {
  meta: {
    slug: "tweezers-vs-gate-lasers",
    title: "Trapping Light vs. Gate Light",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/neutral-atoms",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["neutral-atoms"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/neutral-atoms"],
  },
  question: {
    type: "multiple-choice",
    prompt: "In a neutral-atom platform, is the same laser used both to trap the atom (optical tweezers) and to drive gates/Rydberg excitation?",
    options: [
      { id: "a", text: "No — trapping and manipulation are distinct engineering functions, generally using separately-tuned lasers" },
      { id: "b", text: "Yes — one single laser beam does both jobs simultaneously" },
      { id: "c", text: "No laser is used for gates; only microwaves drive Rydberg excitation" },
      { id: "d", text: "Optical tweezers are only used for readout, not trapping" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Trapping requires a specific frequency/intensity profile focused for confinement; Rydberg excitation requires a very different, precisely tuned frequency — one beam generally can't serve both roles well.",
      c: "Rydberg excitation is typically driven optically (with lasers), not by microwaves alone.",
      d: "Optical tweezers are specifically the TRAPPING mechanism, as this lesson and the previous lesson (Trapped Ions, by analogy) both describe.",
    },
    defaultIncorrectFeedback: "Trapping and gate-driving are distinct engineering functions, even though both typically use lasers — they are not generally the same beam doing both jobs.",
  },
  hints: [
    { text: "Trapping needs a focused intensity profile to create a confining potential." },
    { text: "Rydberg excitation needs a precisely tuned frequency resonant with a specific atomic transition." },
    { text: "These are different engineering requirements, generally met by separate laser systems." },
  ],
  solution: {
    steps: [{ description: "Trapping (optical tweezers) and manipulation (Rydberg excitation for gates) are distinct functions, generally requiring separately-tuned lasers, even though both use light." }],
    finalAnswer: "(a) No — these are distinct functions, generally using separate lasers",
  },
  explanation: {
    correctIdea: "This directly tests the lesson's explicit Common Mistakes point distinguishing trapping light from manipulation light.",
    whyCorrect: "Matches the lesson's explicit statement.",
    whyWrong: ["Assuming 'light' is a single undifferentiated tool misses that trapping and driving atomic transitions have very different physical requirements."],
  },
};
