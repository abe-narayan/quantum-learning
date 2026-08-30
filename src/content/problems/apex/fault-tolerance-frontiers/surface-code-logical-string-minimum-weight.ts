import type { NumericProblem } from "@/lib/problems/types";

export const surfaceCodeLogicalStringMinimumWeight: NumericProblem = {
  meta: {
    slug: "surface-code-logical-string-minimum-weight",
    title: "Weight of the Shortest Boundary-to-Boundary String",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/surface-codes-in-depth",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["surface-codes", "code-distance", "logical-operators", "stabilizer-formalism"],
    prerequisites: ["apex/fault-tolerance-frontiers/surface-codes-in-depth"],
  },
  question: {
    type: "numeric",
    prompt:
      "On this lesson's distance-3 unrotated patch (13 data qubits q₁ to q₁₃, six X-stabilizers on the columns x ∈ {0,2,4} and six Z-stabilizers on the rows y ∈ {0,2,4}), a logical X operator is a string of physical X's running from the left rough boundary to the right rough boundary: a support that commutes with every Z-stabilizer and is not itself a product of X-stabilizers. Over every such support, what is the smallest number of qubits it can act on?",
    inputHint: "an integer (a number of qubits)",
  },
  answer: {
    type: "numeric",
    value: 3,
    tolerance: 0,
    incorrectFeedback:
      "Two conditions have to hold at once. The support must overlap every Z-stabilizer in an even number of qubits, so nothing flags, and it must not be a product of X-stabilizers, so it does something to the encoded qubit. Sweep the patch for the shortest support meeting both, then note that this minimum is what the word 'distance' names.",
    nearMisses: [
      {
        value: 1,
        feedback:
          "A single-qubit X always flags at least one Z-stabilizer: every data qubit sits on at least one, including the corners, where q₁ touches z_A alone. A support that flags is detected, so it is an error and not a logical operator.",
      },
      {
        value: 2,
        feedback:
          "No pair of qubits reaches from x=0 to x=4 on this lattice. The coordinate grid is 5 wide, so at least three qubits are needed to bridge it, and any two-qubit support that does not bridge it either flags a stabilizer or is a stabilizer product.",
      },
      {
        value: 6,
        feedback:
          "6 is the weight of the top row and bottom row together, which is a product of X-stabilizers and therefore acts trivially on the encoded qubit. The question asks for the shortest support that is not such a product.",
      },
      {
        value: 13,
        feedback:
          "13 is the data-qubit count n, not a string length. A logical operator touches only the qubits along one boundary-to-boundary path.",
      },
    ],
  },
  hints: [
    { text: "A support commutes with a Z-stabilizer exactly when the two overlap in an even number of qubits, so a string may not stop halfway: it has to leave every vertex it enters." },
    { text: "The rough boundaries sit at x=0 and x=4, and the coordinate grid runs 0 to 4 in steps of 2. Count the qubits any path from one to the other has to touch." },
    { text: "Once you have a candidate, check the other half: is it a product of X-stabilizers? If it is, it acts as the identity on the encoded qubit and does not count." },
  ],
  solution: {
    steps: [
      {
        description:
          "The middle row $\\bar X = X_6X_7X_8$ runs from $q_6$ on the left rough boundary ($x=0$) through the centre $q_7$ to $q_8$ on the right rough boundary ($x=4$). It shares an even number of qubits with every $Z$-stabilizer, so it flags nothing, and it is not a product of $X$-stabilizers, so it acts nontrivially on the encoded qubit. Weight 3.",
      },
      {
        description:
          "Nothing shorter works. A weight-1 support anticommutes with at least one $Z$-generator, since every data qubit lies on one, so it is a detected error rather than a logical operator. A weight-2 support cannot bridge $x=0$ to $x=4$ across a grid five coordinates wide, and any weight-2 support that stays inside the patch either flags or is a stabilizer product.",
      },
      {
        description:
          "Sweeping all $2^{13}$ supports against the lesson's six $Z$-stabilizers and the 64-element $X$-stabilizer group leaves exactly three minimum-weight logical representatives, all of weight 3: the top row $q_1q_2q_3$, the middle row $q_6q_7q_8$, and the bottom row $q_{11}q_{12}q_{13}$. Any two of them differ by a stabilizer product.",
      },
      {
        description:
          "The code distance is defined as this minimum, so the patch has $d=3$, which is where the name 'distance-3 patch' comes from.",
      },
    ],
    finalAnswer: "3 qubits. The shortest boundary-to-boundary string has weight 3, and that minimum is the code distance.",
  },
  explanation: {
    correctIdea:
      "Code distance is not a separate parameter attached to the code; it is the length of the shortest undetectable operator, and on the surface code those operators are exactly the strings joining opposite boundaries.",
    whyCorrect:
      "Anything shorter than a full crossing either terminates inside the patch, where its loose end flags a stabilizer and gets caught, or closes into a loop, which is a stabilizer product and does nothing. Only a string that runs boundary to boundary escapes both, and on a five-coordinate-wide grid the shortest such string touches three qubits.",
    whyWrong: [
      "Reading the distance off the qubit count rather than off the operator length. n and d grow together but they answer different questions: n counts what the patch costs, d counts how much damage it takes to go undetected.",
      "Forgetting the second condition. A weight-6 closed loop commutes with everything, but it is a stabilizer product and acts as the identity, so it is not a logical operator at all.",
    ],
  },
};
