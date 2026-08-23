import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const durationVsAmplitudeControl: MultipleChoiceProblem = {
  meta: {
    slug: "duration-vs-amplitude-control",
    title: "Two Ways to Reach the Same Rotation",
    course: "control-and-readout",
    lesson: "quantum-hardware/control-and-readout/control-electronics",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["control-electronics"],
    prerequisites: ["quantum-hardware/control-and-readout/control-electronics"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Per this lesson, which statement about pulse-duration control vs. pulse-amplitude control is correct?",
    options: [
      { id: "a", text: "Both are equivalent ways to reach Ωt=θ/2 — real hardware picks whichever is more precisely controllable" },
      { id: "b", text: "Only duration control is physically valid; amplitude control doesn't implement real rotations" },
      { id: "c", text: "Only amplitude control is physically valid; duration control doesn't implement real rotations" },
      { id: "d", text: "The two methods implement different gates entirely, not the same target rotation" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Amplitude control (varying Ω, which is proportional to drive field strength) is equally valid — it reaches the same Ωt=θ/2 condition.",
      c: "Duration control (varying t at fixed Ω) is equally valid — both are described as legitimate, equivalent options.",
      d: "Both methods target the identical condition Ωt=θ/2 — they reach the SAME rotation via different control knobs, not different gates.",
    },
    defaultIncorrectFeedback: "The lesson explicitly states both duration and amplitude control reach the identical target physics, Ωt=θ/2 — they're equivalent, not competing, valid-vs-invalid options.",
  },
  hints: [
    { text: "Both Ω (set by drive amplitude) and t (pulse duration) appear in the same product, Ωt." },
    { text: "Either one can be varied to reach a target Ωt=θ/2, holding the other fixed." },
    { text: "Real hardware chooses based on practical precision, not because one method is fundamentally invalid." },
  ],
  solution: {
    steps: [{ description: "Both duration control (fixed Ω, vary t) and amplitude control (fixed reference t, vary Ω) reach the same target Ωt=θ/2 — equally valid, equivalent control strategies." }],
    finalAnswer: "(a) Both are equivalent; hardware picks whichever is more precisely controllable",
  },
  explanation: {
    correctIdea: "This tests the lesson's explicit closing point about two equivalent control knobs, avoiding the false idea that one method is somehow more 'real' than the other.",
    whyCorrect: "Matches the lesson's 'Two equivalent control knobs' section directly.",
    whyWrong: ["Declaring one method invalid misunderstands that Ωt is a single combined quantity — either factor can be adjusted to reach the same target."],
  },
};
