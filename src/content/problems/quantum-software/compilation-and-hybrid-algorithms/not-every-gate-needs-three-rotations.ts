import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const notEveryGateNeedsThreeRotations: MultipleChoiceProblem = {
  meta: {
    slug: "not-every-gate-needs-three-rotations",
    title: "How Many Native Rotations Does Z Actually Need?",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["gate-decomposition"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/gate-decomposition"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Per this lesson's verified decompositions, how many native rotations does the Z gate need?",
    options: [
      { id: "a", text: "One: Z is Rz(π), because Z's rotation axis is already one of the native axes" },
      { id: "b", text: "Two, as H needs, since Z also has to move the axis before rotating about it" },
      { id: "c", text: "Three, the general Euler upper bound, which every single-qubit gate has to pay" },
      { id: "d", text: "Zero: Z only relabels basis states, so a compiler absorbs it into later gates for free" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "H does need two, because its axis is halfway between Z and X and no single Rz or Ry reaches it. Z's axis is already the rotation axis of Rz, so no repositioning is needed.",
      c: "Three is the upper bound for an arbitrary unitary, not a toll every gate pays. A gate whose axis is already native costs less.",
      d: "A compiler can often commute a Z through later gates, but that is an optimization, not a decomposition. Asked to emit Z by itself, it emits one Rz(π).",
    },
    defaultIncorrectFeedback: "Count the native rotations needed, and check whether Z's rotation axis is already one of the native axes.",
  },
  hints: [
    { text: "Rz(θ) rotates about the z-axis. Ask which axis Z itself rotates about." },
    { text: "A gate needs more than one native rotation only when its axis differs from every native axis, as H's does." },
    { text: "Compare against H, which the lesson decomposes as Ry(π/2)Rz(π), and ask whether Z needs the same repositioning." },
  ],
  solution: {
    steps: [{ description: "Z rotates about the z-axis by π, and Rz is the native z-axis rotation, so Z = Rz(π) up to global phase. One native rotation, no composition." }],
    finalAnswer: "One: Z is Rz(π) on its own, since its rotation axis is already a native axis.",
  },
  explanation: {
    correctIdea: "The three-rotation Euler form is a worst case for an arbitrary unitary. A gate whose axis is already native, such as Z, S or T, costs a single rotation.",
    whyCorrect: "Three rotations is an upper bound for an arbitrary single-qubit unitary, not a toll every gate pays. Z already turns about a native axis, so it needs one Rz(π) and nothing else; the Euler count only bites when the target axis is not one the hardware offers.",
    whyWrong: [
      { optionId: "b", text: "Borrows H's cost. H pays for a rotation axis that no native rotation reaches; Z does not." },
      { optionId: "c", text: "Reads a worst-case bound as a fixed price. It is an upper bound over all unitaries." },
      { optionId: "d", text: "Confuses an optimization with a decomposition. Commuting a Z away is a circuit-level trick, not the cost of emitting Z." },
    ],
  },
};
