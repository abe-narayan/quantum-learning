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
      { id: "a", text: "Both reach the same Ωt=θ/2 condition; hardware picks whichever knob it controls more precisely" },
      { id: "b", text: "Only duration control gives a true rotation; varying Ω changes the rotation axis instead of the angle" },
      { id: "c", text: "Only amplitude control gives a true rotation; varying t just leaves the qubit idle for longer" },
      { id: "d", text: "They reach different angles, because θ depends on Ω and t separately rather than on their product" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Ω sets the rotation rate about the axis the drive phase picks out, not the axis itself. Doubling Ω at fixed drive phase doubles the angle swept; it does not tilt the axis.",
      c: "Holding Ω on for longer is not idling: the qubit keeps rotating for as long as the drive is applied, so t is a real angle knob.",
      d: "The angle is the single product Ωt, not two separate dependencies. Halving Ω and doubling t lands on the same rotation.",
    },
    defaultIncorrectFeedback: "The rotation angle depends on Ω and t only through their product Ωt. Either factor can be varied to hit Ωt=θ/2, so the two control strategies are equivalent rather than one being valid and the other not.",
  },
  hints: [
    { text: "Both Ω (set by drive amplitude) and t (pulse duration) appear in the same product, Ωt." },
    { text: "Either one can be varied to reach a target Ωt=θ/2, holding the other fixed." },
    { text: "Real hardware chooses between them on practical precision grounds, not because one of them fails to produce a rotation." },
  ],
  solution: {
    steps: [{ description: "Duration control (fixed Ω, vary t) and amplitude control (fixed reference t, vary Ω) both reach the same target Ωt=θ/2, so they are equivalent control strategies." }],
    finalAnswer: "Both are equivalent routes to Ωt=θ/2; hardware picks whichever knob it can control more precisely.",
  },
  explanation: {
    correctIdea: "The rotation angle is set by the single product Ωt, so amplitude and duration are two knobs on one quantity rather than two competing physical mechanisms.",
    whyCorrect: "Matches the lesson's 'Two equivalent control knobs' section directly.",
    whyWrong: [
      { optionId: "b", text: "Treats Ω as an axis knob. The drive phase sets the axis; Ω sets how fast the state rotates about it." },
      { optionId: "c", text: "Treats a longer pulse as idle time. While the drive is on, the state keeps rotating, so t is a real angle knob." },
      { optionId: "d", text: "Splits Ω and t into separate dependencies. Only their product enters the angle, which is why halving one and doubling the other changes nothing." },
    ],
  },
};
