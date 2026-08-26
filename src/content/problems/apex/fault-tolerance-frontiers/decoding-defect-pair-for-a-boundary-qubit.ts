import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const decodingDefectPairForABoundaryQubit: MultipleChoiceProblem = {
  meta: {
    slug: "decoding-defect-pair-for-a-boundary-qubit",
    title: "Which Defect Pair Does a Boundary-Column Error Flip?",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/decoding-surface-codes",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["surface-codes", "decoding", "minimum-weight-perfect-matching"],
    prerequisites: ["apex/fault-tolerance-frontiers/decoding-surface-codes"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "In the lesson's 3×3-vertex patch, qubit V02 is the vertical edge in the rightmost column, connecting vertex N02 (top-right corner) to vertex N12 (right-boundary, middle row). A lone X error strikes only V02. Which vertex (Z-type) stabilizers does this flip?",
    options: [
      { id: "a", text: "N02 and N12 — exactly the two vertices V02 touches" },
      { id: "b", text: "N01 and N11, since every X error flips the lattice's central stabilizer" },
      { id: "c", text: "All 9 vertex stabilizers, since one error should be globally detectable" },
      { id: "d", text: "None — X errors are only ever caught by face (X-type) stabilizers" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "N01 and N11 are the endpoints of a different qubit (V01), not V02. Each edge qubit has its own two endpoint vertices.",
      c: "A single-qubit error away from unusual degeneracies flips only the stabilizers that actually contain it in their product — for an edge qubit, that's exactly its two endpoint vertices, not the whole lattice.",
      d: "X errors anticommute with Z-containing operators. The vertex stabilizers are the Z-type ones, so they are exactly what an X error flips — face (X-type) stabilizers commute with an X error and stay silent.",
    },
    defaultIncorrectFeedback:
      "A vertex (Z-type) stabilizer is the product of Z over every qubit touching that vertex. An X error anticommutes with any Z it's multiplied against, so it flips precisely the stabilizers at its own two endpoint vertices — no others.",
  },
  hints: [
    { text: "A vertex stabilizer is a product of Z over the qubits (edges) touching that vertex." },
    { text: "X and Z anticommute on the same qubit; X and X (or Z and Z) commute. So an X error only flips stabilizers built from Z's on qubits it touches." },
    { text: "V02 touches exactly two vertices: N02 and N12 — trace the edge's two endpoints in the lattice." },
  ],
  solution: {
    steps: [
      {
        description:
          "The vertex stabilizer at N02 includes $Z$ on V02 (one of N02's two incident edges); the vertex stabilizer at N12 includes $Z$ on V02 as well (one of N12's three incident edges). Every other vertex stabilizer's product has no $Z$ on V02 at all, so it commutes with the X error and reports no flip.",
      },
      {
        description:
          "An X error on a qubit anticommutes with exactly the stabilizers whose product contains a $Z$ on that qubit — here, that's N02 and N12, and nothing else.",
      },
    ],
    finalAnswer: "N02 and N12 — the defect pair is exactly V02's two endpoint vertices.",
  },
  explanation: {
    correctIdea:
      "A single-qubit error flips exactly the stabilizers of the opposite Pauli type that contain that qubit — for the surface code's edge qubits, that means exactly the two vertices (or two faces) touching that edge.",
    whyCorrect:
      "This is the defect-pair mechanic the whole decoding graph is built from: every possible single-qubit error corresponds to exactly one edge of the decoding graph, connecting its two endpoint defects.",
    whyWrong: [
      "Option b confuses V02 with a different qubit (V01), which has different endpoints.",
      "Option c overstates locality — surface-code stabilizers are local by design, precisely so a single error's effect stays confined to its immediate neighborhood.",
      "Option d mismatches error type to stabilizer type — X errors are caught by Z-type (vertex) stabilizers, not X-type (face) ones.",
    ],
  },
};
