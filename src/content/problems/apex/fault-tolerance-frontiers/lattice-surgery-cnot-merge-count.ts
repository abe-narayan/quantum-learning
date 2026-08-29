import type { NumericProblem } from "@/lib/problems/types";

export const latticeSurgeryCnotMergeCount: NumericProblem = {
  meta: {
    slug: "lattice-surgery-cnot-merge-count",
    title: "Counting Merges in the Lattice-Surgery CNOT",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/lattice-surgery",
    difficulty: "master",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["lattice-surgery", "cnot", "fault-tolerance"],
    prerequisites: ["apex/fault-tolerance-frontiers/surface-codes-in-depth"],
  },
  question: {
    type: "numeric",
    prompt:
      "In the lesson's ancilla-mediated logical CNOT protocol (control patch C, target patch T, ancilla patch A prepared in |+>_L), how many separate merge-then-split lattice-surgery operations are performed in total, not counting the final single-patch X-basis measurement of A?",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value: 2,
    tolerance: 0,
    incorrectFeedback:
      "Two common miscounts. Including the final X-basis measurement of A, which touches a single patch and so is not a merge. Or counting each merge and its split as separate operations, when the prompt asks for merge-then-split pairs.",
  },
  hints: [
    { text: "Go through the protocol's steps in order and ask of each one: does it join two patches along a shared boundary and then separate them again? Only those steps count." },
    { text: "The joint parity measurements are the merges: a ZZ-type measurement between C and A, and an XX-type measurement between A and T." },
    { text: "The final measurement of A involves no second patch, so it is not a merge. Count the operations that remain." },
  ],
  solution: {
    steps: [
      { description: "Merge/split 1: C and A merged along their smooth boundaries to measure $Z_CZ_A$, then split apart." },
      { description: "Merge/split 2: A and T merged along their rough boundaries to measure $X_AX_T$, then split apart." },
      { description: "The subsequent measurement of A in the X basis is a single-patch operation, not a merge, so it isn't counted." },
    ],
    finalAnswer: "2 merge-then-split operations.",
  },
  explanation: {
    correctIdea:
      "The protocol uses exactly two two-patch joint measurements (a ZZ merge/split and an XX merge/split), plus one ordinary single-patch measurement to consume the ancilla -- mirroring teleportation's structure of joint measurements followed by classically-controlled corrections, just at the logical-patch level.",
  },
};
