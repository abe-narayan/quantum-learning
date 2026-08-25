import type { ConceptualProblem } from "@/lib/problems/types";

export const cssCommutationCondition: ConceptualProblem = {
  meta: {
    slug: "css-commutation-condition",
    title: "Why CSS Stabilizer Generators Require C2 Contained in C1",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/css-codes-and-the-general-stabilizer-formalism",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["css-codes", "stabilizer-formalism"],
    prerequisites: ["quantum-mastery/quantum-information-theory/css-codes-and-the-general-stabilizer-formalism"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In the CSS(C1,C2) construction, X-type stabilizers come from codewords g of C2 and Z-type stabilizers come from parity checks h of C1 (h in C1's dual). Explain, using the binary dot product g.h mod 2, why C2 being contained in C1 is exactly what's needed for every X-type and Z-type generator to commute.",
    placeholder: "What does h being in C1's dual mean about h dotted with any codeword of C1?",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["dot product", "g.h", "even", "mod 2", "overlap"],
      ["dual", "c1 perp", "c2 subset", "contained"],
    ],
    incorrectFeedback:
      "X^g and Z^h commute exactly when g.h is even (0 mod 2). Since h is in C1's dual, h.c=0 for every codeword c of C1; if C2 is a subset of C1, every g in C2 is such a c, so g.h=0 automatically.",
  },
  hints: [
    { text: "X^g and Z^h anticommute at each qubit where both g and h have a 1; overall they commute iff the total overlap g.h is even." },
    { text: "h being a row of C1's parity-check matrix means h is in C1's dual: h.c=0 mod 2 for every codeword c of C1." },
    { text: "If C2 is a subset of C1, every g used for an X-stabilizer is itself a codeword of C1." },
  ],
  solution: {
    steps: [
      { description: "$X^g$ and $Z^h$ commute iff $g\\cdot h \\equiv 0 \\pmod 2$ (an even number of anticommuting single-qubit pairs)." },
      { description: "$h\\in C_1^\\perp$ means $h\\cdot c=0$ for every $c\\in C_1$." },
      { description: "If $C_2\\subseteq C_1$, then $g\\in C_2$ is also in $C_1$, so $g\\cdot h=0$ automatically for every such pair." },
    ],
    finalAnswer: "C2 contained in C1 guarantees every X-generator's codeword is also a C1 codeword, which is exactly what makes it orthogonal (dot product 0 mod 2) to every C1-dual vector used for a Z-generator -- the precise algebraic content of 'commute'.",
  },
  explanation: {
    correctIdea: "Commutation of Pauli strings reduces to a binary orthogonality condition, and the CSS nesting condition is exactly built to guarantee that orthogonality.",
    whyCorrect: "This is exactly why the Steane code's specific choice (C2 = the Hamming code's own dual, verified via HH^T=0) works: it's a concrete instance of C2 subset C1.",
  },
};
