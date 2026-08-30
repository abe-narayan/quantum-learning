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
      {
        phrases: ["not less noisy", "no cleaner", "not cleaner", "still noisy", "unchanged", "exactly as noisy", "just as noisy", "as noisy as"],
        missingFeedback:
          "Answer the question first. Say what happens, or does not happen, to the state on one individual run.",
      },
      {
        phrases: ["expectation value", "the number", "statistics", "post-processing", "classically corrected", "computed value"],
        missingFeedback:
          "You have said the runs themselves are untouched. Now say what mitigation does repair, and at what stage of the process it does it.",
      },
      {
        phrases: ["extra qubits", "physical state", "quantum state itself", "ancilla", "syndrome", "repairs the state"],
        missingFeedback:
          "You have said what mitigation fixes. Now draw the contrast: say what error correction operates on instead, and what extra hardware it needs in order to do so.",
      },
    ],
    incorrectFeedback:
      "Three questions, and the answer has to take all three. Does any individual run of the circuit come out less noisy than it would have? If not, what is it that the technique actually fixes up, and at what stage? And what does full error correction repair that this technique leaves alone?",
    partialFeedback:
      "Good start. Two pieces are still missing: name the thing the technique repairs (it is produced after the runs finish, not during them), and name what full error correction fixes instead, along with the machinery it needs to do so.",
    modelAnswers: [
      "No. Every individual run is exactly as noisy as before; nothing about the prepared state is cleaner. Zero-noise extrapolation corrects a classically computed expectation value in post-processing, from statistics over many noisy runs. Error correction is a different thing: it uses extra qubits and a syndrome measurement to repair the quantum state itself while the computation runs.",
      "The state is not less noisy at all, it is unchanged. Mitigation fixes the number you compute afterwards from the statistics; correction repairs the physical state during the run, with ancilla qubits.",
    ],
  },
  hints: [
    { text: "Zero-noise extrapolation runs the same circuit several times at different amplified error levels. Ask whether any one of those runs produces a better physical state than the original." },
    { text: "What comes out at the end is one figure assembled from several individually noisy runs. Ask what the technique adjusts: that figure, or the qubits." },
    { text: "Error correction, by contrast, acts during the computation, using helper qubits, a measured syndrome, and a recovery operation." },
  ],
  solution: {
    steps: [
      { description: "No. Every individual circuit execution during a mitigation protocol is exactly as noisy as an unmitigated run would be, and mitigation never touches the physical state produced on any single run." },
      { description: "What gets corrected is a classically computed expectation value, obtained by combining measurement statistics from several noisy runs, at different folded noise levels, in a specific way. Extrapolation is purely classical post-processing." },
      { description: "Error correction solves a different problem. It repairs the actual quantum state mid-computation, using extra ancilla qubits, syndrome measurement, and an explicit recovery operation, at a real physical-qubit overhead that mitigation does not pay." },
    ],
    finalAnswer:
      "No: every single run stays exactly as noisy as before. Error mitigation statistically corrects a classically computed expectation value from many noisy runs; error correction instead repairs the quantum state itself using extra ancilla qubits and an explicit recovery step.",
  },
  explanation: {
    correctIdea:
      "Mitigation and correction fix different objects entirely: mitigation fixes a number computed after the fact; correction fixes the state during the computation.",
    whyCorrect:
      "This is the lesson's own opening distinction: every individual run is exactly as noisy as ever, and only the extrapolated number is corrected.",
    whyWrong: [
      "Claiming mitigation 'purifies' the state on every run confuses it with error correction. Mitigation uses no extra qubits and never intervenes on any single run's physical execution.",
      "Treating mitigation as a cheaper version of correction ignores that they solve different problems with different resource trades, extra circuit repetitions versus extra physical qubits, rather than being two strengths of the same fix.",
    ],
  },
};
