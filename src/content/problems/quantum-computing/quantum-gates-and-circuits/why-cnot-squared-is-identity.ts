import type { ConceptualProblem } from "@/lib/problems/types";

export const whyCnotSquaredIsIdentity: ConceptualProblem = {
  meta: {
    slug: "why-cnot-squared-is-identity",
    title: "Why CNOT² = I",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/controlled-gates-and-cnot",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "conceptual",
    tags: ["cnot", "reversibility"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/controlled-gates-and-cnot"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain, without matrix multiplication, why applying CNOT twice in a row always returns a state to where it started.",
    placeholder: "Explain in a sentence or two...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      // Bare "two" and bare "target" made both groups free on a question whose
      // prompt is already about a two-qubit control/target gate: "CNOT is a
      // two-qubit gate with a control and a target" used to grade as fully
      // correct. Each phrase now carries part of the argument itself.
      {
        phrases: ["control never changes", "control is unchanged", "control does not change", "control doesn't change", "control stays", "control is left alone", "control untouched", "leaves the control alone", "leaves the control untouched", "leaves the control unchanged", "does not touch the control", "never touches the control", "touches only the target", "acts only on the target", "changes only the target", "same control value", "control still holds"],
        missingFeedback:
          "Look at the control qubit across the two applications. Say what CNOT does to it, and therefore what the second application sees.",
      },
      {
        phrases: ["same decision", "same choice", "same reading", "flips back", "flip back", "flips it back", "undoes the flip", "undoes it", "flipped twice", "flips twice", "two flips cancel", "x applied twice", "x twice", "cancels out", "cancel out", "back to its original", "returns to its original"],
        missingFeedback:
          "You have settled what happens to the control. Now follow the target: say what happens to it on the first pass and on the second, in both of the cases the control can be in.",
      },
    ],
    incorrectFeedback: "You said CNOT is 'its own inverse', which restates the claim. Argue it: say what CNOT does to the control qubit, and then what that fact fixes about the decision the gate makes on its second run.",
    partialFeedback: "Say explicitly what happens to the control across the two applications, then what the target does on the second pass.",
    modelAnswers: [
      "CNOT never touches the control, so the control still holds the same value on the second application and the gate makes the same decision both times. If it flipped the target the first time it flips it back the second time, and if it did not, nothing happens either way.",
      "The control is unchanged by the gate, so both applications read the same control value. X applied twice is the identity, so the target either flips twice and cancels out or is left alone, and the state returns to its original.",
    ],
  },
  hints: [
    { text: "CNOT touches only one of its two qubits. Say which one, and what that means for the other when the gate runs a second time." },
    { text: "The gate's action is decided by reading the control. If the control has not moved, what can you say about the two readings?" },
    { text: "Both passes therefore read the same thing. Work out what a target that flipped on the first pass does on the second." },
  ],
  solution: {
    steps: [
      { description: "CNOT never modifies the control qubit. Only the target can change, and only when the control is 1." },
      { description: "Because the control's value is unchanged after the first CNOT, the second CNOT sees the exact same control value and makes the exact same decision." },
      { description: "If the target flipped on the first application, it flips again (identically) on the second, undoing the first flip. If it didn't flip the first time, it doesn't flip the second time either." },
    ],
    finalAnswer: "The control never changes, so both applications make the same decision. A target that flipped once flips back on the second application, and a target that did not flip stays put both times, so the net effect is the identity.",
  },
  explanation: {
    correctIdea: "Since CNOT leaves the control qubit unchanged, two applications always make the identical flip-or-not decision.",
    whyCorrect: "A bit flipped twice returns to its original value; a bit left alone twice also keeps its original value. Either way, two applications cancel.",
    whyWrong: [
      "Assuming the second CNOT might behave differently ignores that the control qubit, the only thing CNOT's decision depends on, is never altered by CNOT itself.",
    ],
  },
};
