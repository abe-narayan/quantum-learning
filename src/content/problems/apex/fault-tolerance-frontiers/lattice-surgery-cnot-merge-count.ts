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
      "Count the merge/split pairs only: one ZZ merge/split between C and A, and one XX merge/split between A and T. The final measurement of A is a single-patch operation, not a merge.",
  },
  hints: [
    { text: "Step 2 of the protocol is one merge/split pair (a ZZ measurement between C and A)." },
    { text: "Step 3 is a second, separate merge/split pair (an XX measurement between A and T)." },
    { text: "Step 4 (measuring A directly) does not involve a second patch, so it isn't a merge at all." },
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
