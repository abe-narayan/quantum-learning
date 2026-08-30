import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const amplitudeEstimationQpeFreeScalingMc: MultipleChoiceProblem = {
  meta: {
    slug: "amplitude-estimation-qpe-free-scaling-mc",
    title: "What QPE-Free Amplitude Estimation Actually Achieves",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/amplitude-estimation-without-phase-estimation",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["amplitude-estimation", "qpe-free", "nisq", "maximum-likelihood"],
    prerequisites: ["apex/algorithmic-frontiers/amplitude-estimation-without-phase-estimation"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "Which statement correctly characterizes what 'amplitude estimation without phase estimation' (maximum-likelihood / iterative amplitude estimation) achieves relative to the original QPE-based algorithm?",
    options: [
      {
        id: "a",
        text: "It keeps the same O(1/ε) query scaling using a classically scheduled series of measured Grover runs and maximum-likelihood post-processing, so it needs no QFT and no wide ancilla",
      },
      {
        id: "b",
        text: "It reaches the same O(1/ε) scaling by running the Grover iterate in superposition over all iteration counts, exactly like QPE, just replacing the final QFT with classical post-processing",
      },
      {
        id: "c",
        text: "It trades away the quantum scaling: it matches classical Monte Carlo's O(1/ε²) sample scaling with a much simpler circuit, a fair engineering trade for near-term hardware",
      },
      {
        id: "d",
        text: "It requires exactly the same coherent circuit depth as QPE-based amplitude estimation; the only difference is which classical software processes the measurement results afterward",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This is backwards. The entire point of the QPE-free approach is that it never queries the Grover iterate in superposition: each round runs a fixed, classically chosen iteration count m_k and is measured immediately, just like an ordinary Grover run.",
      c: "This understates the result. The scaling is still O(1/ε), the same Heisenberg-limited exponent as the QPE-based algorithm, not the classical O(1/ε²). Reading QPE-free amplitude estimation as a consolation prize that gives up quantum scaling is the misconception the lesson warns against.",
      d: "This overstates the cost. A shallower circuit is the whole structural point: each round needs only state prep plus m_k (uncontrolled) Grover iterates before an immediate measurement, never the full coherent controlled-Q-superposition-plus-QFT circuit QPE requires.",
    },
    defaultIncorrectFeedback:
      "Recall the lesson's distinction. What changes between the two algorithms is circuit structure (ancilla width, coherence requirements) and a constant-factor query overhead, not the asymptotic O(1/ε) scaling itself.",
  },
  hints: [
    { text: "Both algorithms are measured against the same classical baseline: Monte Carlo's O(1/ε²) sample scaling." },
    { text: "The QPE-free version's defining feature is what it removes: the controlled-iterate superposition and the QFT, not the asymptotic exponent." },
    { text: "Suzuki et al. (2020) and Grinko et al. (2021) report a modest constant-factor query overhead relative to the QPE-based optimum, not a worse scaling law." },
  ],
  solution: {
    steps: [
      { description: "Classical Monte Carlo needs O(1/ε²) samples; QPE-based amplitude estimation needs O(1/ε) Grover-iterate queries by running QPE on the iterate." },
      { description: "QPE-free (maximum-likelihood / iterative) amplitude estimation reuses the same Grover iterate and closed-form probability, but queries a classical, increasing schedule of iteration counts, each measured directly." },
      { description: "Combined via classical maximum likelihood, this still achieves O(1/ε) total queries, the same scaling as QPE-based amplitude estimation, while needing no QFT and no wide coherent ancilla register, at a modest constant-factor query overhead." },
    ],
    finalAnswer: "The same O(1/ε) query scaling as QPE-based amplitude estimation, with no QFT and no wide coherent ancilla, at a modest constant-factor query overhead.",
  },
  explanation: {
    correctIdea:
      "QPE-free amplitude estimation is not a consolation prize: it keeps the asymptotic query scaling and buys a much shallower circuit structure.",
    whyCorrect:
      "This is the distinction the lesson draws. QPE-free does not mean worse scaling; it means the same O(1/ε) scaling with a shallower circuit.",
    whyWrong: [
      { optionId: "b", text: "Misdescribes the mechanism. The QPE-free schedule never queries the Grover iterate in superposition over iteration counts; each round fixes m_k classically and measures immediately." },
      { optionId: "c", text: "Understates the scaling. The query count stays O(1/ε), the same Heisenberg-limited exponent as QPE-based amplitude estimation, not classical Monte Carlo's O(1/ε²)." },
      { optionId: "d", text: "Overstates the remaining circuit cost. Removing the controlled-iterate superposition and the QFT is what shortens the coherent depth; the classical post-processing is a consequence, not the only change." },
    ],
  },
};
