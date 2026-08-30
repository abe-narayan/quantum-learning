import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const codeParametersShorVsBitflip: MultipleChoiceProblem = {
  meta: {
    slug: "code-parameters-shor-vs-bitflip",
    title: "Comparing [[n,k,d]] for the Bit-Flip Code and the Shor Code",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["code-parameters"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "Quote the [[n,k,d]] parameters of the 3-qubit bit-flip code and of the Shor code against the full Pauli error model, where an error may be X, Y or Z on any qubit. Which pair is right?",
    options: [
      { id: "a", text: "[[3,1,3]] and [[9,1,3]]: both codes reach distance 3, at different qubit costs" },
      { id: "b", text: "[[3,1,1]] and [[9,1,3]]: a single Z slips past the bit-flip code undetected, so its distance collapses to 1" },
      { id: "c", text: "[[3,1,3]] and [[9,1,9]]: distance tracks the number of physical qubits" },
      { id: "d", text: "[[3,1,1]] and [[9,1,1]]: no code built from three-qubit repetition blocks survives an arbitrary single-qubit error" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "b",
    optionFeedback: {
      a: "[[3,1,3]] is the bit-flip code's distance against X errors alone, which is the qualifier this question removes. Z on any single qubit commutes with both stabilizers, so it leaves the syndrome at (0,0) while flipping the sign of the |111⟩ branch: an undetectable weight-1 error that changes the logical state.",
      c: "Distance and qubit count are separate axes. The Shor code's six extra qubits buy coverage of a second error type, not a distance of 9.",
      d: "The Shor code does survive an arbitrary single-qubit error: its inner blocks catch X errors and its outer block catches the phase, which is exactly what distance 3 means. Only the bare bit-flip code drops to distance 1.",
    },
    defaultIncorrectFeedback:
      "Distance is the weight of the lightest error that both escapes detection and changes the logical state, and it has to be quoted against a stated error model. Ask which single-qubit Pauli each code fails to see.",
  },
  hints: [
    { text: "Both codes protect exactly 1 logical qubit, so k=1 in both. The bit-flip code uses 3 physical qubits and the Shor code uses 9." },
    { text: "For the distance, hunt for the lightest error that escapes detection and still changes the logical state. Try a single Z on one qubit of the bit-flip code and work out its syndrome." },
    { text: "That Z commutes with both Z₀Z₁ and Z₁Z₂, so the syndrome never fires, yet it takes α|000⟩+β|111⟩ to α|000⟩−β|111⟩. Weigh that error and compare it against the Shor code, which has no such blind spot." },
  ],
  solution: {
    steps: [
      { description: "Both codes encode one logical qubit, so k=1 for both, and n is 3 and 9 respectively. Only d is in question." },
      { description: "In the bit-flip code, Z on any single qubit commutes with both stabilizers Z₀Z₁ and Z₁Z₂, so the syndrome stays (0,0). It nonetheless sends α|000⟩+β|111⟩ to α|000⟩−β|111⟩, which is a logical Z. That is an undetectable weight-1 error that changes the encoded state, so d=1 against the full Pauli model." },
      { description: "The Shor code has no such blind spot: its three inner repetition blocks catch X errors and its outer block catches the phase, and the lightest undetectable logical error has weight 3. So it is a true [[9,1,3]]." },
    ],
    finalAnswer: "[[3,1,1]] and [[9,1,3]] against the full Pauli model. The bit-flip code's familiar distance 3 holds only against X errors.",
  },
  explanation: {
    correctIdea: "A distance is meaningless without the error model it is quoted against. Widen the model from X errors to all Paulis and the bit-flip code drops from d=3 to d=1, while the Shor code stays at d=3.",
    whyCorrect: "Distance is the weight of the lightest error that escapes detection and changes the logical state. For the bit-flip code under the full Pauli model that error is a single Z, of weight 1. For the Shor code it takes weight 3, which is what the extra six qubits bought.",
    whyWrong: [
      { optionId: "a", text: "Quotes the bit-flip code's X-only distance under a model that also allows Z. That is the qualifier the question strips away, and it is why the Shor code was built at all." },
      { optionId: "c", text: "Reads distance off the qubit count. Nine qubits buy the Shor code coverage of a second error type, not a distance of 9." },
      { optionId: "d", text: "Denies the Shor code its distance 3. It corrects any single-qubit Pauli, which is precisely what d=3 certifies." },
    ],
  },
};
