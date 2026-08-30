import type { ConceptualProblem } from "@/lib/problems/types";

export const fourSGatesSandwiched: ConceptualProblem = {
  meta: {
    slug: "four-s-gates-sandwiched",
    title: "Four S Gates Sandwiched by H",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/building-qubit-circuits",
    difficulty: "advanced",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["circuits", "composition", "s-gate"],
    prerequisites: [
      "quantum-computing/qubits-and-quantum-states/building-qubit-circuits",
      "quantum-computing/qubits-and-quantum-states/quantum-gates",
    ],
  },
  question: {
    type: "conceptual",
    prompt:
      "A friend built the circuit H, S, S, S, S, H (four S gates in a row, sandwiched by an H on each side) and claims it does absolutely nothing to any input state. Is this correct? Justify your answer using a fact from an earlier lesson in this course.",
    placeholder: "What do four S gates in a row equal? What about H applied twice?",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["the friend is right", "friend is right", "the friend is correct", "friend is correct", "the claim holds", "claim holds", "the circuit is the identity", "circuit is the identity", "equals the identity", "acts as the identity", "reduces to the identity", "net effect is the identity", "no net effect"],
        missingFeedback:
          "Give a verdict first: say whether it survives, and what the whole circuit does when taken as a single operation.",
      },
      // The superscript characters are load-bearing on their own: they strip to
      // the empty string, so they can only ever match as a literal substring of
      // what the student typed. Spelling them as "s⁴" or "h²=i" instead would
      // strip to "s" and "h i", which match almost any English sentence and
      // made these groups free.
      {
        phrases: ["s to the fourth", "s to the 4", "s^4", "s4", "s⁴", "ssss", "four s", "fourth power", "s applied four times", "four applications of s"],
        missingFeedback:
          "You have a verdict. Now justify the middle of the circuit: say what that run of identical gates multiplies out to.",
        anchors: {
          "s⁴": "The superscript is the form the lesson prints and the form a student copying it types. It survives normalization as the bare letter s, so the raw glyph is what is being tested.",
          "s4": "Normalizes to a single two-character token, matched whole rather than as a prefix. It is here to catch the student who types S4 on a keyboard without a superscript.",
        },
      },
      {
        phrases: ["h squared", "h is its own inverse", "h is self-inverse", "self-inverse", "self inverse", "own inverse", "hh=i", "hh = i", "h twice", "h^2", "h² is the identity", "h² = the identity", "two h gates", "outer h", "h cancel"],
        missingFeedback:
          "You have dealt with the middle. Now deal with the two gates on either end: name the earlier fact about that gate which finishes the argument.",
      },
    ],
    incorrectFeedback: "You reasoned from the picture (six gates must do something) rather than from the algebra. Earlier lessons supply both pieces: the number of S applications that return the identity exactly, and what a pair of H gates in a row amounts to. Quote both, then multiply.",
    partialFeedback: "State exactly what the middle block of gates comes to, and what the two outer ones come to, then combine.",
    modelAnswers: [
      "The friend is right. S to the fourth is exactly I, so the four middle gates come to nothing, and H is its own inverse, so the two outer H gates cancel as well. The whole circuit acts as the identity.",
      "Yes, the claim holds. Four S gates in a row give S^4 = I, and then you are left with H twice, and H squared is the identity, so the net effect is the identity.",
    ],
  },
  hints: [
    { text: "The Quantum Gates lesson states the exact number of S applications that return the identity, on the nose rather than up to a phase. Look it up." },
    { text: "Count the S gates in the middle of this circuit and compare with that number. What is left between the two gates on either end?" },
    { text: "Now the pair on the ends. Recall whether H undoes itself, and finish the simplification." },
  ],
  solution: {
    steps: [
      { description: "$S^4=I$ exactly (from Quantum Gates: two quarter-turns give a half-turn, $S^2=Z$; two more give a full turn, $S^4=I$)." },
      { description: "So the middle four S gates act as the identity: $H\\,S^4\\,H = H\\,I\\,H = H^2$." },
      { description: "$H$ is its own inverse, $H^2=I$, so the entire six-gate circuit is exactly the identity." },
    ],
    finalAnswer: "The friend is right: S^4 = I exactly, so the four middle gates come to the identity, and H is its own inverse, so the two outer gates cancel as well. The whole circuit is the identity.",
  },
  explanation: {
    correctIdea: "S⁴ = I is an exact matrix identity (not merely 'up to global phase'), so four S gates in a row cancel outright, and H² = I finishes the job.",
    whyCorrect: "Both facts (S⁴=I, H²=I) were already established directly in earlier lessons; this problem is just composing them, the same skill the HZH=X derivation practiced.",
    whyWrong: [
      "Assuming the claim must be false because six gates look as though they should do something. A circuit's net effect is the operator product, which can be the identity however many gates it contains.",
      "Confusing S⁴=I with a case that holds only up to global phase. No phase subtlety arises here: S⁴ is I on the nose.",
    ],
  },
};
