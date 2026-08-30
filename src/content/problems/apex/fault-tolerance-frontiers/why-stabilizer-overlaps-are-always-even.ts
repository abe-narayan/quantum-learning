import type { ConceptualProblem } from "@/lib/problems/types";

export const whyStabilizerOverlapsAreAlwaysEven: ConceptualProblem = {
  meta: {
    slug: "why-stabilizer-overlaps-are-always-even",
    title: "Why Every X/Z Stabilizer Pair Shares an Even Number of Qubits",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/surface-codes-in-depth",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["surface-codes", "css-codes", "commutation"],
    prerequisites: [
      "apex/fault-tolerance-frontiers/surface-codes-in-depth",
      "quantum-mastery/quantum-information-theory/css-codes-and-the-general-stabilizer-formalism",
    ],
  },
  question: {
    type: "conceptual",
    prompt:
      "The lesson verified that bulk X-stabilizer xB (q4,q5,q2,q7) and bulk Z-stabilizer zC (q6,q7,q4,q9) share exactly 2 qubits (q4,q7) and therefore commute. Stabilizers xE (q9,q10,q7,q12) and zD (q7,q8,q5,q10) also share exactly 2 qubits (q7,q10). Using the lattice's geometry (an X-stabilizer sits on a face, a Z-stabilizer sits on a vertex, and the qubits are the edges between them), explain why an X-stabilizer and a Z-stabilizer anywhere in the surface code can only ever share 0 or 2 qubits, never 1 or 3, so that every such pair is guaranteed to commute.",
    placeholder: "Think about the face's boundary as a closed loop drawn on the lattice. How many of that loop's edges can touch one specific vertex?",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: [
          "closed loop",
          "closed cycle",
          "boundary loop",
          "boundary is a loop",
          "cycle of edges",
          "enters and exits",
          "enter and exit",
          "enters and leaves",
          "passes through",
          "no loose end",
          "cannot end at",
        ],
        missingFeedback:
          "The parity conclusion is there, but not what forces it. The tempting answer is 'the four edges just happen to pair up.' They do not happen to: a face's edges form a single circuit with no free ends, and that is a fact about the drawing, not a coincidence. Say what a circuit with no free ends must do at any vertex it reaches.",
      },
      {
        phrases: ["even", "0 or 2", "zero or two", "even number", "two edges", "two qubits"],
        missingFeedback:
          "You have described the geometry correctly. Now state the arithmetic conclusion it forces about how many qubits the two checks can share, and why that parity is what makes them commute.",
      },
    ],
    incorrectFeedback:
      "The usual wrong answer appeals to the code's construction rather than to the picture. Commutation is not something CSS codes are handed; it is something the lattice geometry forces. Draw the four edges around one face, pick a single vertex sitting on it, and count how many of that face's edges can meet there. The count you get is the whole argument.",
    modelAnswers: [
      "The face's boundary is a closed loop of edges. A loop that reaches a vertex has to leave it again, so it uses two edges there, and if it never reaches that vertex it uses none. So the overlap is 0 or 2, always an even number, and the two stabilizers commute.",
      "Think of the X-stabilizer as a closed cycle of edges around a face. At any vertex the cycle either passes through, using two edges, or misses it entirely. There is no way to end at a vertex with a single loose end, so the number of shared qubits is even.",
    ],
  },
  hints: [
    { text: "An X-stabilizer's qubits are exactly the edges bounding one face; a Z-stabilizer's qubits are exactly the edges touching one vertex." },
    { text: "The face's boundary edges form a single closed loop drawn on the lattice. Ask: how many of that loop's edges can meet at one particular vertex?" },
    { text: "A closed loop either misses a given vertex entirely or passes through it, and passing through always uses an entering edge and a distinct exiting edge." },
  ],
  solution: {
    steps: [
      { description: "An X-stabilizer (face) is bounded by a closed loop of edges (its qubits); a Z-stabilizer (vertex) is the qubits (edges) meeting at one point." },
      { description: "If the vertex lies strictly inside or outside the face's boundary loop, none of the face's edges touch it: 0 shared qubits." },
      { description: "If the vertex lies exactly on the face's boundary, the closed loop must both enter and leave through it, using exactly 2 of the loop's edges there: 2 shared qubits." },
      { description: "A count of exactly 1 would require the loop to have a loose end at that vertex, impossible for a closed boundary loop. So the overlap is always 0 or 2, both even, and by the binary dot-product commutation rule (Objective from CSS Codes and the General Stabilizer Formalism), X and Z always commute." },
      { description: "The weight-3 boundary faces need one extra sentence, and they get the same answer. Their edge set is an open path rather than a closed loop, so it does have two loose ends, but a face is truncated precisely where the lattice runs out: the vertices those loose ends reach lie off the patch and carry no $Z$-stabilizer. Against every vertex that is a stabilizer, the path still enters and leaves, and the overlap is even. Checking the lesson's own patch confirms it: all 36 X/Z generator pairs overlap in 0 or 2 qubits." },
    ],
    finalAnswer: "0 or 2 shared qubits, always even, because a face's boundary is a closed loop that can only pass fully through a vertex (using 2 edges) or miss it (0 edges). It can never touch a vertex with a single loose end.",
  },
  explanation: {
    correctIdea: "The surface code's commutation guarantee is not a coincidence of the small patch checked by hand. It is forced by the topology of faces and vertices on any planar lattice, so it holds at every stabilizer pair, at every distance d.",
    whyCorrect: "This is the geometric reason underneath the same algebraic fact CSS Codes and the General Stabilizer Formalism proved via the binary dot product g.h mod 2: here, 'g.h is even' becomes 'a closed loop meets a point an even number of times,' the topological version of the same statement.",
    whyWrong: ["Assuming the even-overlap property only holds for the specific bulk pairs checked by hand in the lesson misses that it's a structural guarantee of the vertex/face lattice geometry itself, true for every stabilizer pair including boundary (weight-3) ones."],
  },
};
