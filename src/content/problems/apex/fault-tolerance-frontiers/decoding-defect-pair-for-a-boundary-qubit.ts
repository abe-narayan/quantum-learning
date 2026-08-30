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
      { id: "a", text: "N02 and N12, the two vertices at the ends of the edge V02 sits on" },
      { id: "b", text: "N01 and N11, the endpoints of the vertical edge in the column to the left" },
      { id: "c", text: "N02 alone, since V02 is a boundary qubit with one endpoint off the patch" },
      { id: "d", text: "The face (X-type) stabilizers that V02 borders, not the vertex ones" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Right rule, wrong edge. N01 and N11 are the endpoints of V01, one column over. Each edge qubit flips the stabilizers at its own two endpoints.",
      c: "Being on the boundary is what makes some qubits flip a single stabilizer, so the instinct is sound, but V02 is not one of them. Its column is on the boundary; the edge itself still runs between two vertices that both exist, N02 and N12.",
      d: "Reads the error type as selecting its own stabilizer type. It is the other way round: an X error commutes with the X-type face operators and so leaves them silent, and anticommutes with the Z-type vertex operators, which is what makes those flip.",
    },
    defaultIncorrectFeedback:
      "A vertex (Z-type) stabilizer is the product of Z over every qubit touching that vertex. An X error anticommutes with any Z it is multiplied against, so it flips the stabilizers at its own two endpoint vertices and no others.",
  },
  hints: [
    { text: "A vertex stabilizer is a product of Z over the qubits (edges) touching that vertex." },
    { text: "X and Z anticommute on the same qubit; X and X (or Z and Z) commute. So an X error only flips stabilizers built from Z's on qubits it touches." },
    { text: "Trace V02's two endpoints in the lattice. An edge meets exactly two vertices." },
  ],
  solution: {
    steps: [
      {
        description:
          "The vertex stabilizer at N02 includes $Z$ on V02 (one of N02's two incident edges); the vertex stabilizer at N12 includes $Z$ on V02 as well (one of N12's three incident edges). Every other vertex stabilizer's product has no $Z$ on V02 at all, so it commutes with the X error and reports no flip.",
      },
      {
        description:
          "An X error on a qubit anticommutes with exactly the stabilizers whose product contains a $Z$ on that qubit. Here that is N02 and N12, and nothing else.",
      },
    ],
    finalAnswer: "N02 and N12. The defect pair is V02's two endpoint vertices.",
  },
  explanation: {
    correctIdea:
      "A single-qubit error flips exactly the stabilizers of the opposite Pauli type that contain that qubit. For the surface code's edge qubits, that means the two vertices (or two faces) touching that edge.",
    whyCorrect:
      "This is the defect-pair mechanic the whole decoding graph is built from: every single-qubit error corresponds to one edge of the decoding graph, connecting its two endpoint defects.",
    whyWrong: [
      { optionId: "b", text: "Confuses V02 with a different qubit. N01 and N11 are V01's endpoints; each edge qubit has its own pair." },
      { optionId: "c", text: "Applies the boundary exception to the wrong qubit. A single defect does occur where an edge runs off the patch, but V02 lies between two vertices that are both present." },
      { optionId: "d", text: "Mismatches error type to stabilizer type. X errors are caught by the Z-type (vertex) stabilizers, not the X-type (face) ones." },
    ],
  },
};
