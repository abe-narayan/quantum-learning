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
      ["twice", "two", "second application", "again", "repeated"],
      ["flip", "target", "undo", "back", "returns", "reverses"],
    ],
    incorrectFeedback: "Think about what happens to the target qubit specifically on the second application, given the control never changes.",
    partialFeedback: "You're on the right track — be explicit about the control staying fixed and the target flipping back.",
  },
  hints: [
    { text: "CNOT never touches the control qubit — only the target can change." },
    { text: "Since the control doesn't change, the second CNOT makes exactly the same decision (flip or don't flip) as the first." },
    { text: "If the target flipped once, flipping it a second time under the identical condition undoes the flip." },
  ],
  solution: {
    steps: [
      { description: "CNOT never modifies the control qubit — only the target can change, and only when the control is 1." },
      { description: "Because the control's value is unchanged after the first CNOT, the second CNOT sees the exact same control value and makes the exact same decision." },
      { description: "If the target flipped on the first application, it flips again (identically) on the second, undoing the first flip. If it didn't flip the first time, it doesn't flip the second time either." },
    ],
    finalAnswer: "The control never changes, so both applications make the same decision — a target that flipped once flips back on the second application, and a target that didn't flip stays put both times, so the net effect is always the identity.",
  },
  explanation: {
    correctIdea: "Since CNOT leaves the control qubit unchanged, two applications always make the identical flip-or-not decision.",
    whyCorrect: "A bit flipped twice returns to its original value; a bit left alone twice also stays at its original value — either way, two applications cancel.",
    whyWrong: [
      "Assuming the second CNOT might behave differently ignores that the control qubit, the only thing CNOT's decision depends on, is never altered by CNOT itself.",
    ],
  },
};
