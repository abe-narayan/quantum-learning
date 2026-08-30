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
        text: "Four independent pieces are missing and none closes the rest: the gate sequence, calibration data, post-processing, and the shot count",
      },
      {
        id: "b",
        text: "Naming the device model closes the gap: gate fidelities and coherence times are fixed at fabrication, so the model name pins performance down",
      },
      {
        id: "c",
        text: "Two pieces are missing, the circuit and the shot count; calibration and post-processing are conventions a reader can safely assume",
      },
      {
        id: "d",
        text: "Three pieces are missing, but the statistics are not among them: an overlap quoted to two significant figures implies its shot count",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Calibration established that a real device's performance (gate fidelities, decoherence times, readout asymmetry) drifts day to day. The same physical device, named correctly, can still perform differently a week later without a calibration snapshot attached. A device model name alone does not fix this.",
      c: "Treats the two hardest gaps as house style. Calibration drifts day to day on the same physical device, and Quantum Error Mitigation's own worked example turned an 80% raw measurement into a 94% corrected one, a swing that came entirely from an unstated post-processing choice.",
      d: "A number's precision on the page says nothing about how many shots produced it. Without the shot count and an interval, 90% could rest on one run or on a million, and a reader has no way to tell which.",
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
      { description: "The claim as stated supplies none of them in checkable detail. 'A 20-qubit superconducting device' names a class of hardware, not a calibrated instance, and '90% overlap' has no shot count or confidence interval attached." },
      { description: "Supplying only one (e.g. just the shot count) would still leave the circuit, calibration, and post-processing pipeline completely unspecified, so no single addition suffices." },
    ],
    finalAnswer: "All four components are missing and independent: exact circuit, calibrated hardware snapshot, post-processing pipeline, and shot count with a confidence interval.",
  },
  explanation: {
    correctIdea:
      "Reproducibility is a conjunction of four independent requirements, not a single score to raise. A claim is only as reproducible as its weakest missing component.",
    whyCorrect:
      "Listing all four components this lesson identifies, and treating them as independent gaps requiring independent fixes, is what the 'Four Components' section asks a reader to do.",
    whyWrong: [
      { optionId: "b", text: "Conflates naming a device class with specifying a calibrated instance of it, ignoring that performance drifts over time." },
      { optionId: "c", text: "Assumes calibration and post-processing are standardised enough to go unstated. Both vary run to run and both move the reported number." },
      { optionId: "d", text: "Reads precision as evidence. Quoting a figure to two significant places is a typographical choice, not a statement about the sample behind it." },
    ],
  },
};
