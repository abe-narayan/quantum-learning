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
      { id: "a", text: "No: trapping and gate driving are separate functions, served by separately tuned laser systems" },
      { id: "b", text: "Yes: one beam holds the atom and drives its transitions, which is what makes the setup compact" },
      { id: "c", text: "No: the tweezer holds the atom, and microwaves rather than lasers drive the Rydberg excitation" },
      { id: "d", text: "Yes for one-qubit gates, since the trap beam already sits on resonance; two-qubit gates add a second laser" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The two jobs want different light. Trapping wants a tightly focused, deliberately off-resonant beam that shifts levels without exciting anything; a gate wants a beam tuned onto a transition. One beam cannot be both off resonance and on it.",
      c: "The trapping half is right, the driving half is not. Rydberg excitation is driven optically, since the transition to a Rydberg level sits at optical frequencies, far above the microwave band.",
      d: "A trap beam sitting on resonance would excite the atom instead of holding it. Tweezers are kept off resonance precisely so they do not drive transitions.",
    },
    defaultIncorrectFeedback: "Both jobs use light, but they want opposite things from it: a trap beam is deliberately off resonance, and a gate beam is deliberately on it.",
  },
  hints: [
    { text: "Both roles use light, so the question is whether one beam can meet both sets of requirements." },
    { text: "A trap works by shifting the atom's energy without exciting it, which needs a beam held away from any transition." },
    { text: "A gate works by driving a specific transition, which needs a beam sitting on it. Ask whether one frequency can do both." },
  ],
  solution: {
    steps: [{ description: "Trapping uses a tightly focused beam held off resonance, so it shifts the atom's energy without exciting it. Driving a gate needs a beam tuned onto a transition. Those requirements conflict, so the two roles are filled by separately tuned laser systems." }],
    finalAnswer: "No: trapping and gate driving are separate functions with conflicting tuning requirements, so they use separate laser systems.",
  },
  explanation: {
    correctIdea: "Trapping light and gate light are both light, but a trap is built from detuning and a gate is built from resonance, so one beam cannot serve both roles.",
    whyCorrect: "Matches the lesson's Common Mistakes point distinguishing trapping light from manipulation light.",
    whyWrong: [
      { optionId: "b", text: "Treats light as one undifferentiated tool, missing that the two roles need opposite detunings." },
      { optionId: "c", text: "Gets the trap right and the drive wrong. Rydberg transitions are optical, not microwave." },
      { optionId: "d", text: "Assumes the trap beam is already resonant. It is held off resonance on purpose, or it would excite the atom it is meant to hold." },
    ],
  },
};
