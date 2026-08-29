import type { ConceptualProblem } from "@/lib/problems/types";

export const mitigationVsCorrectionWhatGetsRepaired: ConceptualProblem = {
  meta: {
    slug: "mitigation-vs-correction-what-gets-repaired",
    title: "Error Mitigation vs. Error Correction: What Actually Gets Repaired?",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["quantum-error-mitigation", "error-correction", "conceptual"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation"],
  },
  question: {
    type: "conceptual",
    prompt:
      "After a full zero-noise-extrapolation protocol finishes, is the quantum state the device actually prepared on any single circuit run any less noisy than before? Explain what error mitigation actually corrects, and how that differs from what error correction corrects.",
    placeholder: "Every individual run is still exactly as noisy as before; what changes is...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["not less noisy", "no cleaner", "not cleaner", "still noisy", "unchanged", "exactly as noisy", "just as noisy", "as noisy as"],
      ["expectation value", "the number", "statistics", "post-processing", "classically corrected", "computed value"],
      ["extra qubits", "physical state", "quantum state itself", "ancilla", "syndrome", "repairs the state"],
    ],
    incorrectFeedback:
      "Cover all three parts: whether any single run's physical state gets cleaner, what quantity actually gets corrected instead, and what error correction repairs that mitigation does not.",
    partialFeedback:
      "Good start — make sure you also name what error mitigation DOES correct (a classically-computed expectation value) and what error correction repairs instead (the physical quantum state, using extra qubits).",
  },
  hints: [
    { text: "Zero-noise extrapolation runs the same noisy circuit several times, at different amplified noise levels, and never once prepares a cleaner physical state." },
    { text: "What gets 'corrected' is a single classically-computed NUMBER — an expectation value combined from several individually-noisy measurement runs — not any physical qubit." },
    { text: "Error correction, in contrast, repairs the quantum state itself, using extra ancilla qubits, syndrome measurement, and an explicit recovery operation, before the computation continues." },
  ],
  solution: {
    steps: [
      { description: "No — every individual circuit execution during a mitigation protocol is exactly as noisy as an unmitigated run would be. Mitigation never touches the physical state produced on any single run." },
      { description: "What gets corrected is a classically-computed expectation value, obtained by combining measurement statistics from several noisy runs (e.g. at different folded noise levels) in a specific way — extrapolation is purely classical post-processing." },
      { description: "Error correction solves a different problem: it repairs the actual quantum state mid-computation, using extra ancilla qubits, syndrome measurement, and an explicit recovery operation — at a real physical-qubit overhead that mitigation doesn't pay." },
    ],
    finalAnswer:
      "No — every single run stays exactly as noisy as before. Error mitigation statistically corrects a classically-computed expectation value from many noisy runs; error correction instead repairs the quantum state itself using extra ancilla qubits and an explicit recovery step.",
  },
  explanation: {
    correctIdea:
      "Mitigation and correction fix different objects entirely: mitigation fixes a number computed after the fact; correction fixes the state during the computation.",
    whyCorrect:
      "This is exactly the lesson's own opening distinction, reinforced by its PredictBeforeReveal: 'No, every individual run is exactly as noisy as ever; only the extrapolated NUMBER is corrected.'",
    whyWrong: [
      "Claiming mitigation 'purifies' the state on every run confuses it with error correction — mitigation uses no extra qubits and never intervenes on any single run's physical execution.",
      "Treating mitigation as simply a cheaper version of correction ignores that they solve different problems with fundamentally different resource trades (extra circuit repetitions vs. extra physical qubits), not two strengths of the same fix.",
    ],
  },
};
