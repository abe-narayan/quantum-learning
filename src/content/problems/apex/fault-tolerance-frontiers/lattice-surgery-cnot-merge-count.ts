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
    prerequisites: ["apex/fault-tolerance-frontiers/surface-codes-in-depth", "apex/fault-tolerance-frontiers/lattice-surgery"],
  },
  question: {
    type: "numeric",
    prompt:
      "In the lesson's ancilla-mediated logical CNOT protocol (control patch C, target patch T, ancilla patch A prepared in |+>_L), how many separate merge-then-split lattice-surgery operations are performed in total, not counting the final single-patch logical Z-basis measurement of A?",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value: 2,
    tolerance: 0,
    incorrectFeedback:
      "Two common miscounts. Including the final single-patch $Z$-basis measurement of A, which touches only one patch and so is not a merge. Or counting each merge and its split as separate operations, when the prompt asks for merge-then-split pairs.",
    // The prose above already named both miscounts; these encode them, so a
    // student who submits 3 or 4 is told which of the two they made rather
    // than being handed both and left to work out which one applies to them.
    nearMisses: [
      {
        value: 3,
        feedback:
          "3 counts the final single-patch $Z$-basis measurement of A as a third operation. That measurement acts on a single patch, so it merges nothing: the protocol's two-patch operations are the $Z_CZ_A$ merge and the $X_AX_T$ merge.",
      },
      {
        value: 4,
        feedback:
          "4 counts each merge and its split separately. The prompt asks for merge-then-split operations, and each of the two is one such operation: merge C with A and split them, then merge A with T and split them.",
      },
    ],
  },
  hints: [
    { text: "Go through the protocol's steps in order and ask of each one: does it join two patches along a shared boundary and then separate them again? Only those steps count." },
    { text: "The joint parity measurements are the merges: a ZZ-type measurement between C and A, and an XX-type measurement between A and T." },
    { text: "The final step measures A on its own, in the Z basis. It involves no second patch, so it is not a merge. Count the operations that remain." },
  ],
  solution: {
    steps: [
      { description: "Merge/split 1: C and A are bridged along the facing edges that support a $Z$-type seam, measuring $Z_CZ_A$ (outcome $m_1$), then split apart." },
      { description: "Merge/split 2: A and T are bridged along the facing edges that support an $X$-type seam, measuring $X_AX_T$ (outcome $m_2$), then split apart." },
      { description: "A is then measured on its own in the $Z$ basis (outcome $m_3$). $Z_A$ anticommutes with the $X_AX_T$ just measured, so it returns a fresh random bit and breaks the ancilla-target correlation instead of collapsing T. That step acts on one patch alone, so it joins nothing and is not a merge; it does not enter the count." },
      { description: "The classical correction that follows, $Z_C$ if $m_2=-1$ and $X_T$ if $m_1m_3=-1$, is Pauli frame bookkeeping, not a lattice-surgery operation." },
    ],
    finalAnswer: "2 merge-then-split operations.",
  },
  explanation: {
    correctIdea:
      "The protocol uses two two-patch joint measurements (a $Z_CZ_A$ merge/split and an $X_AX_T$ merge/split), plus one single-patch $Z$-basis measurement to consume the ancilla, followed by classically controlled Pauli corrections. That mirrors teleportation's structure of joint measurements followed by classically controlled corrections, at the logical-patch level.",
  },
};
