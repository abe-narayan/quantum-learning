import type { ConceptualProblem } from "@/lib/problems/types";

export const cssCommutationCondition: ConceptualProblem = {
  meta: {
    slug: "css-commutation-condition",
    title: "Why CSS Stabilizer Generators Require C2 Contained in C1",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/css-codes-and-the-general-stabilizer-formalism",
    difficulty: "master",
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
      {
        phrases: ["dot product", "g dot h", "even", "mod 2", "overlap"],
        missingFeedback:
          "Commutation of two Pauli strings is a counting statement about the positions where both act non-trivially. Say what that count has to be, and write it as a binary condition on g and h.",
      },
      {
        phrases: ["c1 perp", "c2 subset", "nested", "sits inside c1", "also a c1 codeword", "every c2 word is a c1 word", "membership in c1"],
        missingFeedback:
          "The criterion is right. Now use what the construction gives you. Ask what relation h has to C1 by virtue of being one of its parity-check rows, and what relation every g has to C1 by virtue of coming from C2. Those two relations are what make the criterion hold with no work at all.",
      },
    ],
    incorrectFeedback:
      "State the commutation criterion for X^g and Z^h as a condition on g and h, in plain arithmetic. Then bring in what the code construction guarantees: h is a row of C1's parity-check matrix, and every g comes from C2. Say what those two facts together force the criterion to evaluate to, and why no case-by-case check is ever needed.",
    modelAnswers: [
      "Two Pauli strings commute exactly when the number of positions where both act non-trivially is even, which in binary means g.h = 0 mod 2. Because C2 sits inside C1, every X-generator's codeword g is also a C1 codeword, and h lies in C1's dual, so the dot product is automatically 0 mod 2 and the generators commute.",
      "The commutation condition is a dot product over F2: the overlap has to be even. C2 being nested inside C1 makes every g a C1 word, and every h is orthogonal to all of C1 by definition of the dual, so g dot h vanishes mod 2.",
    ],
  },
  hints: [
    { text: "X^g and Z^h anticommute at each qubit where both g and h carry a 1. Ask what makes the two strings commute overall." },
    { text: "h is a row of C1's parity-check matrix. Say what that forces about h paired against anything in C1." },
    { text: "Every g used for an X-stabilizer comes from C2. Where does C2 sit relative to C1?" },
  ],
  solution: {
    steps: [
      { description: "$X^g$ and $Z^h$ commute iff $g\\cdot h \\equiv 0 \\pmod 2$ (an even number of anticommuting single-qubit pairs)." },
      { description: "$h\\in C_1^\\perp$ means $h\\cdot c=0$ for every $c\\in C_1$." },
      { description: "If $C_2\\subseteq C_1$, then $g\\in C_2$ is also in $C_1$, so $g\\cdot h=0$ automatically for every such pair." },
    ],
    finalAnswer: "C2 contained in C1 guarantees every X-generator's codeword is also a C1 codeword, which is what makes it orthogonal (dot product 0 mod 2) to every C1-dual vector used for a Z-generator. That orthogonality is the algebraic content of 'commute'.",
  },
  explanation: {
    correctIdea: "Commutation of Pauli strings reduces to a binary orthogonality condition, and the CSS nesting condition is built to guarantee that orthogonality.",
    whyCorrect: "The Steane code's choice of C2 as the Hamming code's own dual, checked by HH^T=0, is one concrete way of satisfying C2 subset C1. Its stabilizers therefore commute by construction, with no case-by-case verification needed.",
  },
};
