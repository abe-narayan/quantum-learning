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
      ["shallow", "few gates", "short circuit"],
      ["compounding error", "p^N", "stays tolerable"],
    ],
    incorrectFeedback: "Address both the specific property of VQE/QAOA circuits (shallow depth) and how that connects to the compounding-error problem from Scaling Challenges.",
    partialFeedback: "Good — now be explicit about the connection to p^N compounding error staying manageable at low circuit depth.",
  },
  hints: [
    { text: "VQE and QAOA use relatively SHALLOW circuits — few sequential gates compared to, say, Shor's algorithm's full circuit." },
    { text: "Scaling Challenges showed success probability decays as p^N — small N keeps this decay manageable even at realistic (imperfect) per-gate fidelity." },
    { text: "This means VQE/QAOA can extract useful results WITHOUT needing full fault tolerance, unlike deep-circuit algorithms." },
  ],
  solution: {
    steps: [
      { description: "VQE and QAOA use comparatively shallow circuits — far fewer sequential gates than deep algorithms like a full implementation of Shor's algorithm." },
      { description: "Scaling Challenges showed success probability compounds as p^N, decaying exponentially with circuit depth N — shallow circuits keep N small enough that even NISQ-era (imperfect) per-gate fidelities produce usably high success probability." },
      { description: "This means VQE and QAOA can extract useful results on current, non-fault-tolerant hardware, unlike algorithms requiring circuit depths well beyond what compounding error allows without error correction." },
    ],
    finalAnswer: "VQE/QAOA use shallow circuits (small N), keeping p^N compounding error tolerable even on NISQ-era imperfect hardware — unlike deep-circuit algorithms that require fault tolerance to be practical.",
  },
  explanation: {
    correctIdea: "This connects two courses' content directly (Quantum Algorithms II's specific algorithms and this course's compounding-error mathematics), showing WHY the NISQ-suitability claim is true, not just asserting it.",
    whyCorrect: "Matches this lesson's explicit connection to Scaling Challenges.",
    whyWrong: ["Saying VQE/QAOA are 'simpler algorithms' without connecting to circuit DEPTH specifically and the p^N compounding-error mechanism misses the actual quantitative reason."],
  },
};
