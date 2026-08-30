import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const classifyCoherentErrors: MultipleChoiceProblem = {
  meta: {
    slug: "classify-coherent-errors",
    title: "Classifying a Drifting Calibration Error",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["noise-sources"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/sources-of-noise"],
  },
  question: {
    type: "multiple-choice",
    prompt: "A device's gate fidelity degrades slowly over several hours, then returns to its original value immediately after recalibration, with no hardware changes. Is this a coherent or incoherent error?",
    options: [
      { id: "a", text: "Coherent: recalibration alone restoring fidelity is the signature of a systematic drift in a control parameter" },
      { id: "b", text: "Incoherent: fidelity falling off over hours is the hallmark of energy and phase leaking to the environment" },
      { id: "c", text: "Incoherent, because the drift was slow; a coherent error shows up as a fixed offset from the first shot onward" },
      { id: "d", text: "Coherent, but only because no hardware was swapped; retuning the readout too would make it incoherent" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Information lost to an environment is not returned by retuning a classical control parameter. Recalibration working is what rules decoherence out here.",
      c: "Timescale does not decide the classification. A coherent error can drift slowly as a bias field wanders; what marks it coherent is that a control parameter can absorb it.",
      d: "Recalibration is the test, not a caveat on it. Retuning readout thresholds is still a classical control adjustment, so it would point at a coherent error too.",
    },
    defaultIncorrectFeedback: "The diagnostic is whether recalibration alone, with no hardware change, restores full fidelity. That is the signature of a coherent, systematic error.",
  },
  hints: [
    { text: "Sort the two categories by what it takes to undo them, not by how fast they appear." },
    { text: "Incoherent errors are information lost to an environment, and no amount of retuning a control parameter brings it back." },
    { text: "Here fidelity returned after a pure software recalibration. Ask what that rules out." },
  ],
  solution: {
    steps: [{ description: "Recalibration alone, with no hardware change, restored full fidelity. That is the signature of a coherent, systematic parameter drift rather than incoherent environmental decoherence." }],
    finalAnswer: "Coherent: a systematic control-parameter drift, which is why a recalibration undoes it.",
  },
  explanation: {
    correctIdea: "The coherent/incoherent split is about whether the error is a deterministic offset a control parameter can absorb, not about how quickly it appears.",
    whyCorrect: "Restoring fidelity by recalibration alone means the lost fidelity was sitting in a mis-set classical parameter, not in correlations leaked to an environment.",
    whyWrong: [
      { optionId: "b", text: "Reads slow fidelity loss as decoherence by default. Drift produces the same symptom and responds to recalibration, which decoherence does not." },
      { optionId: "c", text: "Uses timescale as the test. A coherent error is free to drift slowly; the deciding question is whether retuning fixes it." },
      { optionId: "d", text: "Makes the classification depend on which parameter was retuned. Any classical control adjustment points the same way." },
    ],
  },
};
