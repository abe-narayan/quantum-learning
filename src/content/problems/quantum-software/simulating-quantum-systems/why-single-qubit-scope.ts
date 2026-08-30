import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const whySingleQubitScope: MultipleChoiceProblem = {
  meta: {
    slug: "why-single-qubit-scope",
    title: "Why runNoisyCircuit Is Scoped to a Single Qubit",
    course: "simulating-quantum-systems",
    lesson: "quantum-software/simulating-quantum-systems/noise-simulation",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["noise-simulation"],
    prerequisites: ["quantum-software/simulating-quantum-systems/noise-simulation"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Why is this platform's runNoisyCircuit scoped to single-qubit circuits, per the lesson's explicit explanation?",
    options: [
      { id: "a", text: "Extending it means expanding every gate to a 2ⁿ×2ⁿ unitary, standard machinery that nothing here needs yet" },
      { id: "b", text: "Kraus channels are defined for a single system, so a two-qubit channel needs a different formalism" },
      { id: "c", text: "A multi-qubit density matrix has 4ⁿ entries, which makes even two qubits impractical in a browser tab" },
      { id: "d", text: "Correlated noise across qubits has no agreed model, so a multi-qubit simulator would have to guess at the physics" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The Kraus formalism is defined for a system of any dimension: the operators just become larger matrices satisfying the same completeness condition. Nothing about it is single-qubit.",
      c: "A two-qubit density matrix is 4×4, sixteen complex numbers. Cost is a reason to stop somewhere eventually, and it is not the reason to stop at one qubit.",
      d: "Correlated-noise models exist and are standard; the lesson simply has no lesson that needs one. An unbuilt feature is not an unsettled one.",
    },
    defaultIncorrectFeedback: "Separate what is impossible from what is merely unbuilt. The lesson names what a multi-qubit version would take, which is the sign of a scope decision rather than a limitation.",
  },
  hints: [
    { text: "Ask whether the lesson describes something that cannot be done, or something that has not been done here." },
    { text: "A lesson that names what the extension would require is describing a scope decision, not a wall." },
    { text: "The requirement it names is about how single-qubit gates and channels are lifted onto a larger register." },
  ],
  solution: {
    steps: [{ description: "The single-qubit scope is a deliberate choice. Lifting the implementation to n qubits means expanding each gate and each Kraus operator to act on the full 2ⁿ-dimensional space via tensor products, which is standard machinery, just machinery nothing in this course calls for." }],
    finalAnswer: "Extending it needs tensor-product gate expansion: understood machinery that nothing in this course requires.",
  },
  explanation: {
    correctIdea: "A deliberate scope decision and a theoretical limitation look alike from outside. The tell is that the lesson can name what the extension would take.",
    whyCorrect: "Nothing in the physics blocks a multi-qubit version: Kraus operators lift to n qubits by tensoring each one up to the full space. The limit here is scope rather than formalism, and saying so is different from claiming the extension would be hard.",
    whyWrong: [
      { optionId: "b", text: "Restricts the Kraus formalism to one qubit. It is dimension-agnostic." },
      { optionId: "c", text: "Cites a cost that does not bite until far past two qubits." },
      { optionId: "d", text: "Turns an unbuilt feature into an unsettled question. Correlated-noise models are standard." },
    ],
  },
};
