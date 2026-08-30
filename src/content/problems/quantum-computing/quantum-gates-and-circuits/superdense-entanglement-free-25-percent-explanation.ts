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
    prompt: `Bob's decode circuit is the exact inverse of the circuit that prepares the Bell pair, so it is a readout of which of the four Bell states it was handed: each one goes to its own computational-basis outcome. Run it instead on the unentangled $|+\\rangle\\otimes|0\\rangle$ and all four outcomes come out at ${probabilityOf00.toFixed(2)}, confirmed by the engine. Explain what that readout finds when it is pointed at $|+\\rangle\\otimes|0\\rangle$, and what the answer costs Bob.`,
    placeholder: "Write |+>|0> in terms of the four Bell states first...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: [
          "equal overlap",
          "overlaps all four",
          "overlap with all four",
          "equal weight",
          "equal amplitude on each",
          "same amplitude on each",
          "spread equally over the four",
          "spread evenly over the four",
          "combination of all four bell",
          "superposition of all four bell",
          "mixture of all four bell",
          "sum of all four bell",
          "not one of the four",
          "is not a bell state",
          "isn't a bell state",
          "is not any bell state",
        ],
        missingFeedback:
          "The readout answers a question about the Bell basis, so start there. Rewrite the unentangled input in terms of the four Bell states and say how its weight is distributed among them.",
      },
      {
        phrases: [
          "no information",
          "carries no information",
          "learns nothing",
          "learn nothing",
          "tells bob nothing",
          "tells him nothing",
          "cannot tell which message",
          "can not tell which message",
          "no better than guessing",
          "no better than a guess",
          "same distribution whatever alice",
          "same distribution for every message",
          "identical for every message",
          "identical whichever message",
          "the message is lost",
          "the two bits are lost",
        ],
        missingFeedback:
          "You have described what the readout finds. Now price it: say what a reading that comes out the same way whichever message Alice sent is worth to Bob.",
      },
      {
        phrases: [
          "entanglement is the resource",
          "entanglement was the resource",
          "entanglement is what",
          "superposition alone",
          "superposition on its own",
          "superposition by itself",
          "merely in superposition",
          "merely superposed",
          "not enough to be in superposition",
          "correlation between the two qubits",
          "correlated with bob",
          "never correlated",
          "uncorrelated",
        ],
        missingFeedback:
          "You have the readout and its cost. Finish with the lesson's point: name which property of the pair the protocol actually spends, and which nearby property is not enough on its own.",
      },
    ],
    incorrectFeedback:
      "You observed that all four bars are level without saying where the level comes from. Notice first that the input is a product state and so cannot be any of the four things the readout is built to recognize; then work out how it sits relative to all four at once.",
    partialFeedback:
      "Part of it is there. The full account has three pieces: how the unentangled input sits relative to the four Bell states, what a reading that is the same whichever message was sent buys Bob, and which property of the pair the protocol was really spending.",
    modelAnswers: [
      "Written in the Bell basis, |+>|0> is an equal-weight combination of all four Bell states, so the readout has the same amplitude on each and lands on each outcome a quarter of the time. That distribution is identical for every message Alice could have sent, so Bob learns nothing and is no better than guessing. Entanglement is the resource here; superposition on Alice's qubit alone was never enough.",
      "The product state is not one of the four things the decode circuit can recognize. It has equal overlap with all four Bell states, so all four bars come out level, the same distribution for every message, which carries no information at all. That is the point of the comparison: the correlation between the two qubits is what the protocol spends, not superposition by itself.",
    ],
  },
  hints: [
    { text: "The decode circuit sorts Bell states. So write the unentangled input in the Bell basis before anything else, and look at the four coefficients you get." },
    { text: "All four coefficients have the same size. Square one and compare it with the number the engine reports for each bar." },
    { text: "Now ask what Bob does with that reading. Would it have looked any different for a different message, and if not, what has he learned?" },
  ],
  solution: {
    steps: [
      { description: "Bob's decode inverts the preparation, so it sorts the four Bell states onto the four computational-basis outcomes, one each. Pointed at anything else, it reports which Bell state the input most resembles, with probabilities set by the overlaps." },
      { description: "The product state is not one of the four. In the Bell basis it is an equal-weight combination of all of them: $|+\\rangle\\otimes|0\\rangle=\\tfrac12(|\\Phi^+\\rangle+|\\Phi^-\\rangle+|\\Psi^+\\rangle-|\\Psi^-\\rangle)$." },
      { description: `Each coefficient has magnitude $\\tfrac12$, so each outcome carries $|\\tfrac12|^2 = ${probabilityOf00.toFixed(2)}$, matching all four bars exactly.` },
      { description: "That same level distribution would appear whichever gate Alice had applied, so it distinguishes nothing: Bob is left guessing. The pair being merely in superposition was never the resource. The entanglement between the two qubits is what the protocol spends." },
    ],
    finalAnswer: `In the Bell basis the unentangled input is an equal-weight combination of all four Bell states, so the readout splits ${probabilityOf00.toFixed(2)} across every outcome. The reading is identical for every message Alice could send, so it carries no information: entanglement, not superposition on its own, is what the protocol was spending.`,
  },
  explanation: {
    correctIdea:
      "Bob's decoder recognizes exactly four inputs, the Bell states. An unentangled pair has equal overlap with all four, so the decoder answers uniformly at random and no message survives.",
    whyCorrect:
      "The decode circuit is the preparation circuit run backwards, which makes it a Bell-basis readout. Overlap with all four Bell states being equal is precisely the condition for a flat output distribution, and a flat distribution is the same one Alice's every message would have produced.",
    whyWrong: [
      "Arguing that the two qubits were prepared independently, so the joint probability is just 0.5 times 0.5, does not survive contact with the circuit. Bob's decode contains a CNOT, which correlates the pair before anything is measured, and the same argument applied to the product state |0⟩⊗|0⟩ would predict 0.25 across the board where the real circuit gives a half on |00⟩, a half on |10⟩ and nothing elsewhere.",
    ],
  },
};
