import { StateVector } from "@/lib/quantum/state";
import { applySingleQubitGate, applyCNOT, HADAMARD } from "@/lib/quantum/gates";
import type { ConceptualProblem } from "@/lib/problems/types";

// Independently recompute the lesson's entanglement-free comparison case
// through the real engine, so the 0.25 figure referenced in the prompt is
// verified rather than just quoted from the lesson's own display.
const productStart = applySingleQubitGate(StateVector.zero(2), HADAMARD, 0); // |+>|0>, unentangled
const decoded = applySingleQubitGate(applyCNOT(productStart, 0, 1), HADAMARD, 0);
const probabilityOf00 = decoded.probabilities()[0];

export const superdenseEntanglementFree25PercentExplanation: ConceptualProblem = {
  meta: {
    slug: "superdense-entanglement-free-25-percent-explanation",
    title: "Why the Entanglement-Free Case Gives Exactly 0.25 Each",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/superdense-coding",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["superdense-coding", "entanglement", "measurement"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/superdense-coding"],
  },
  question: {
    type: "conceptual",
    prompt: `In the entanglement-free comparison frame (Bob's decode circuit run on a product state instead of a genuine Bell pair), every one of the four outcomes has probability exactly ${probabilityOf00.toFixed(2)}, confirmed directly by the engine. Using the general fact that measuring any qubit prepared independently of another gives no information about it, explain why $0.25 = 0.5\\times0.5$ is exactly what you'd expect here.`,
    placeholder: "If the two qubits were never entangled, then measuring one of them tells you nothing about...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["never entangled", "unentangled", "independently prepared", "product state"],
      [
        "each qubit separately",
        "each factor on its own",
        "one qubit at a time",
        "independent probabilities",
        "independent",
        "statistically independent",
        "uncorrelated",
        "tells you nothing about",
        "on its own",
        "separately",
      ],
      {
        phrases: [
          "multiply the probabilities",
          "product of the two probabilities",
          "multipl",
          "product of the",
          "product of two",
          "0.5 times 0.5",
          "0.5 × 0.5",
          "0.5 x 0.5",
          "half times a half",
        ],
        missingFeedback:
          "You have said the two qubits are independent. Now use it: for independent outcomes the joint probability is the product of the two marginals, and 0.5 × 0.5 is where the 0.25 comes from.",
      },
    ],
    incorrectFeedback:
      "Address why an unentangled product state means the two qubits' measurement outcomes are statistically independent, and why independent probabilities multiply rather than add or average.",
    partialFeedback:
      "Good — now make the connection to the specific numbers explicit: why each qubit alone gives $0.5$, and why the joint outcome's probability is their product.",
  },
  hints: [
    { text: "In a product (unentangled) state, each qubit's measurement statistics are entirely independent of the other qubit's." },
    { text: "Bob's decode circuit, run on this unentangled input, effectively measures each qubit's own $0.5/0.5$ distribution separately." },
    { text: "For independent events, the probability of a specific joint outcome (e.g. both reading $0$) is the product of each individual probability." },
  ],
  solution: {
    steps: [
      { description: "The product state's two qubits are, by construction, statistically independent — measuring one tells you nothing about the other." },
      { description: "Each qubit's own decode-circuit measurement gives a $0.5/0.5$ split, exactly the mismatched-basis-style result of a qubit uncorrelated with its partner." },
      { description: `For independent events, $P(\\text{joint outcome}) = P(\\text{qubit 0's result})\\times P(\\text{qubit 1's result}) = 0.5\\times0.5 = ${probabilityOf00.toFixed(2)}$, matching every one of the four bars exactly.` },
    ],
    finalAnswer: `$0.25 = 0.5\\times0.5$ is exactly the independent-probability product rule applied to two qubits that were never entangled.`,
  },
  explanation: {
    correctIdea:
      "Entanglement is precisely the resource that breaks this independent-multiplication rule; without it, joint probabilities factor into a simple product of each qubit's own marginal probability.",
    whyCorrect:
      "This is the same general principle used elsewhere in this course whenever a qubit is prepared independently of another: their joint statistics multiply rather than exhibiting the correlations a Bell pair provides.",
  },
};
