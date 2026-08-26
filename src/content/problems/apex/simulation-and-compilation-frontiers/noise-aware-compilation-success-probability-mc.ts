import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const noiseAwareCompilationSuccessProbabilityMc: MultipleChoiceProblem = {
  meta: {
    slug: "noise-aware-compilation-success-probability-mc",
    title: "Why the Two Compilations Differ",
    course: "simulation-and-compilation-frontiers",
    lesson: "apex/simulation-and-compilation-frontiers/noise-aware-compilation-and-resource-estimation",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["compilation", "noise-aware-routing", "calibration", "resource-estimation"],
    prerequisites: ["apex/simulation-and-compilation-frontiers/noise-aware-compilation-and-resource-estimation"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "The lesson's naive (identity) and noise-aware (mirrored) mappings both compile the same circuit into exactly 17 CNOT-equivalent two-qubit operations on the same 4-qubit linear-chain device, yet the naive mapping's estimated success probability (about 73.8%) is meaningfully lower than the noise-aware mapping's (about 83.8%). What best explains this gap?",
    options: [
      { id: "fewer-gates", text: "The noise-aware compiler found a way to use fewer total gates." },
      { id: "recalibrated", text: "The noise-aware compiler recalibrated the device's worst coupler before running." },
      { id: "remapped-load", text: "The noise-aware compiler chose a logical-to-physical mapping that routes fewer of the circuit's operations through the device's known highest-error coupler, while keeping the total gate count identical." },
      { id: "better-gate-set", text: "The noise-aware compiler used a more powerful native two-qubit gate that the naive compiler didn't have access to." },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "remapped-load",
    optionFeedback: {
      "fewer-gates": "Both mappings compile to exactly 17 CNOT-equivalent operations — the lesson holds gate count fixed specifically to isolate the effect of mapping choice alone.",
      "recalibrated": "Recalibration is a genuinely different fix, for coherent errors (Noise, Decoherence & Scaling's coherent/incoherent classification). Noise-aware compilation doesn't change the hardware's error rates at all; both mappings run on the identical, unmodified device.",
      "better-gate-set": "Nothing in the lesson's example changes which native gates are available. Both mappings use the same CNOTs and SWAPs; only which physical coupler each one runs on differs.",
    },
    defaultIncorrectFeedback:
      "Compare the two mappings' operation tallies per coupler: naive puts 7 of 17 operations on the flagged worst coupler, while noise-aware puts only 2 of 17 there, with the same 8 on the middle coupler in both cases. Nothing about the gate count or the hardware itself changed.",
  },
  hints: [
    { text: "Count the total CNOT-equivalent operations in each compilation first — the lesson is explicit that both equal 17." },
    { text: "Since the circuit size is identical, the success-probability difference must come from WHERE each operation physically runs, not how many there are." },
    { text: "Recall the device's three couplers have different, individually calibrated error rates (0.5%, 1%, and 3%), and mapping choice determines which coupler absorbs the heaviest load." },
  ],
  solution: {
    steps: [
      { description: "Both compilations have identical gate count: 17 CNOT-equivalent operations, so gate count cannot explain the gap." },
      { description: "The device itself is unchanged between the two compilations — no recalibration, no different native gate set." },
      { description: "The only thing that differs is the logical-to-physical qubit mapping, which changes which physical coupler each operation uses, and the device's couplers have different, non-uniform error rates." },
      { description: "The naive mapping happens to route 7 of 17 operations through the flagged 3%-error coupler; the noise-aware mapping routes only 2 of 17 through it, moving the heavy load onto the well-calibrated 0.5%-error coupler instead." },
    ],
    finalAnswer: "The noise-aware mapping routes fewer operations through the device's known worst coupler, at the same total gate count.",
  },
  explanation: {
    correctIdea:
      "Noise-aware compilation improves success probability by choosing, among mappings with equal gate count, the one that assigns heavily-used operations to a device's better-calibrated components.",
    whyWrong: [
      "It does not reduce the algorithm's gate count — the lesson deliberately holds that fixed at 17 to isolate the mapping effect.",
      "It does not change the device's physical error rates — that would be recalibration, a separate, hardware-level fix for coherent errors, not a compilation choice.",
      "It does not require a different or more powerful gate set — both mappings use the same CNOTs and SWAPs.",
    ],
  },
};
