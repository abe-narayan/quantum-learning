import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const reproducibilityComponentsMissingMc: MultipleChoiceProblem = {
  meta: {
    slug: "reproducibility-components-missing-mc",
    title: "What's Missing From a Quantum-Computing Claim",
    course: "research-methods-and-synthesis",
    lesson: "apex/research-methods-and-synthesis/reproducing-and-designing-experiments",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "multiple-choice",
    tags: ["reproducibility", "calibration", "error-mitigation", "statistics"],
    prerequisites: ["apex/research-methods-and-synthesis/reproducing-and-designing-experiments"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "A paper states: 'We ran our variational circuit on a 20-qubit superconducting device and measured a ground-state energy estimate with 90% overlap with the exact answer.' No further detail is given about the circuit, the hardware's calibration, the post-processing pipeline, or the statistics behind the 90% figure. Which assessment is most accurate?",
    options: [
      {
        id: "a",
        text: "Four independent pieces are missing, and no single addition closes the others: the exact gate sequence, a calibration snapshot for the device on the day it ran, the classical post-processing pipeline, and the shot count with a confidence interval on the 90% figure.",
      },
      {
        id: "b",
        text: "Naming the specific device model closes the gap: a device's gate fidelities and coherence times are fixed once it is fabricated, so the model name pins the performance down.",
      },
      {
        id: "c",
        text: "Only the shot count matters; the exact circuit and post-processing pipeline are implementation details that don't affect whether the result is trustworthy.",
      },
      {
        id: "d",
        text: "Since the paper reports a specific number (90%) rather than a vague description, the claim is already fully reproducible as stated.",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Calibration established that a real device's performance (gate fidelities, decoherence times, readout asymmetry) drifts day to day; the SAME physical device, named correctly, can still perform differently a week later without a calibration snapshot attached. A device model name alone doesn't fix this.",
      c: "Statistical uncertainty is one of four independent gaps, not the only one. The exact circuit and post-processing pipeline each independently change what the reported number even means, regardless of how many shots were used to compute it -- Quantum Error Mitigation's own worked example turned an 80% raw measurement into a 94% corrected one, a swing entirely from post-processing, not statistics.",
      d: "A specific-looking number is not the same as a reproducible claim. '90% overlap' with no circuit, hardware/calibration, post-processing, or shot-count/confidence-interval detail is exactly the kind of impressive-sounding but unverifiable claim this lesson's common-mistakes callout warns against.",
    },
    defaultIncorrectFeedback:
      "Recall this lesson's four independent components of a reproducible claim: exact circuit, exact hardware/simulator with calibration data, exact classical post-processing/error-mitigation pipeline, and honest statistical uncertainty reporting. A claim missing several of these needs all of them supplied, not just one substituted for the others.",
  },
  hints: [
    { text: "Re-read this lesson's 'Four Components' section: are the four components independent of each other, or does fixing one automatically fix the others?" },
    { text: "Consider Quantum Error Mitigation's own worked example: raw 80% became corrected 94% purely from post-processing, with no change to shots or hardware. Does that mean post-processing and statistics are the same gap?" },
    { text: "The correct option should treat all four missing pieces as separately necessary, not pick a single one as sufficient." },
  ],
  solution: {
    steps: [
      { description: "The four components (exact circuit, exact hardware+calibration, exact post-processing pipeline, honest statistical reporting) are independent: each answers a different question about how the result was obtained." },
      { description: "The claim as stated supplies none of them in checkable detail -- 'a 20-qubit superconducting device' names a class of hardware, not a calibrated instance; '90% overlap' has no shot count or confidence interval attached." },
      { description: "Supplying only one (e.g. just the shot count) would still leave the circuit, calibration, and post-processing pipeline completely unspecified, so no single addition suffices." },
    ],
    finalAnswer: "All four components are missing and independent: exact circuit, calibrated hardware snapshot, post-processing pipeline, and shot count with a confidence interval.",
  },
  explanation: {
    correctIdea:
      "Reproducibility is a conjunction of four independent requirements, not a single score to raise -- a claim is only as reproducible as its weakest missing component.",
    whyCorrect:
      "Listing all four components this lesson identifies, and treating them as independent gaps requiring independent fixes, is what the 'Four Components' section asks a reader to do.",
    whyWrong: [
      { optionId: "b", text: "Conflates naming a device class with specifying a calibrated instance of it, ignoring that performance drifts over time." },
      { optionId: "c", text: "Elevates statistics to the only relevant factor. The circuit and the post-processing pipeline each change what the number means, independently of shot count." },
      { optionId: "d", text: "Mistakes a specific-sounding number for a reproducible claim when none of the four components are specified." },
    ],
  },
};
