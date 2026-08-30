import type { ConceptualProblem } from "@/lib/problems/types";

export const whyNisqFavorsVqeQaoa: ConceptualProblem = {
  meta: {
    slug: "why-nisq-favors-vqe-qaoa",
    title: "Why VQE and QAOA Fit the NISQ Era",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/roadmaps-to-fault-tolerance",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["fault-tolerance", "conceptual"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/roadmaps-to-fault-tolerance"],
  },
  question: {
    type: "conceptual",
    prompt: "Connecting to Scaling Challenges' compounding-error problem, explain why VQE and QAOA (Quantum Algorithms II) are specifically well-suited to NISQ-era hardware.",
    placeholder: "VQE and QAOA use shallow circuits, which means...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["shallow", "few gates", "short circuit"],
        missingFeedback:
          "Say what is distinctive about the circuits VQE and QAOA actually run, as circuits.",
      },
      {
        phrases: ["compounding error", "compounding", "stays tolerable", "decays exponentially", "exponential in the depth", "exponentially with depth", "multiplies"],
        missingFeedback:
          "You have named the circuit property. Now connect it to the earlier lesson: say how total fidelity behaves as gates are added, and why that makes the property matter.",
      },
    ],
    incorrectFeedback: "Two things have to connect. Name the structural property of VQE and QAOA circuits that sets them apart from Shor's algorithm, then connect it to the p^N result from Scaling Challenges: say what N counts in that expression and what happens to the success probability as it grows. An answer that names only the property, or only the formula, has not made the link.",
    partialFeedback: "Good. Now finish the link to p^N: say what N counts, and why keeping it small is what leaves any signal at all on hardware with imperfect gates.",
    modelAnswers: [
      "Both use shallow circuits with only a few gates, so the compounding error stays tolerable. A deep circuit multiplies its per-gate fidelity over and over, so the success probability decays exponentially with depth and you need fault tolerance before it is useful.",
      "The compounding error problem is that fidelity multiplies with every gate. VQE and QAOA keep the circuit shallow, so the exponent is small and the total error stays manageable on noisy hardware.",
    ],
  },
  hints: [
    { text: "VQE and QAOA use relatively shallow circuits, with few sequential gates compared to, say, Shor's algorithm's full circuit." },
    { text: "Scaling Challenges showed success probability decays as p^N, so a small N keeps that decay manageable even at realistic, imperfect per-gate fidelity." },
    { text: "So VQE and QAOA can extract useful results without full fault tolerance, unlike deep-circuit algorithms." },
  ],
  solution: {
    steps: [
      { description: "VQE and QAOA use comparatively shallow circuits, with far fewer sequential gates than deep algorithms like a full implementation of Shor's algorithm." },
      { description: "Scaling Challenges showed success probability compounds as p^N, decaying exponentially with circuit depth N. Shallow circuits keep N small enough that even NISQ-era, imperfect per-gate fidelities produce usably high success probability." },
      { description: "This means VQE and QAOA can extract useful results on current, non-fault-tolerant hardware, unlike algorithms requiring circuit depths well beyond what compounding error allows without error correction." },
    ],
    finalAnswer: "VQE and QAOA use shallow circuits (small N), keeping p^N compounding error tolerable even on NISQ-era imperfect hardware, unlike deep-circuit algorithms that need fault tolerance to be practical.",
  },
  explanation: {
    correctIdea: "This connects two courses' content directly, Quantum Algorithms II's specific algorithms and this course's compounding-error mathematics, showing why the NISQ-suitability claim is true rather than asserting it.",
    whyCorrect: "Success falls as p^N, so the fidelity a device needs is fixed by circuit depth. VQE and QAOA keep N in the hundreds rather than the billions, which puts p^N within reach of today's gates, while deep algorithms sit far past that point and need correction first.",
    whyWrong: ["Saying VQE and QAOA are 'simpler algorithms' without connecting to circuit depth specifically and the p^N compounding-error mechanism misses the quantitative reason."],
  },
};
