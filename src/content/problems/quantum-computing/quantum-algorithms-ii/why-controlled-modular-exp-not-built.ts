import type { ConceptualProblem } from "@/lib/problems/types";

export const whyControlledModularExpNotBuilt: ConceptualProblem = {
  meta: {
    slug: "why-controlled-modular-exp-not-built",
    title: "Why This Platform Builds the Period-Finding State Directly",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["shors-algorithm", "scope"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain the distinction the lesson draws between 'the state a real circuit produces' and 'the circuit that produces it,' and why building only the former is still an honest, useful engine choice.",
    placeholder: "Think about what's actually being verified downstream of state construction...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["same output", "exact state", "identical result", "mathematically equivalent"],
      ["interference", "qft step", "downstream", "what actually matters"],
    ],
    incorrectFeedback: "Consider: is the QFT-based extraction step (the actual interference mechanism) any less real just because the state feeding into it was built directly?",
    partialFeedback: "Good — be explicit that the interference/QFT step, the actual mechanism of interest, is fully genuine either way.",
  },
  hints: [
    { text: "periodFindingState produces the exact same amplitudes a real controlled-modular-multiplication circuit would." },
    { text: "The QFT step applied afterward is the actual interference mechanism this course is teaching." },
    { text: "Building the state directly sidesteps a large, separate engineering problem without affecting the physics being demonstrated downstream." },
  ],
  solution: {
    steps: [
      { description: "periodFindingState's output amplitudes are mathematically identical to what a real controlled-modular-exponentiation circuit would produce." },
      { description: "Everything downstream — the QFT applied to the counting register — is the genuine interference mechanism, computed and verified exactly." },
      { description: "The gate-by-gate circuit that would produce this state is a separate, substantial engineering problem (real quantum arithmetic), honestly scoped out rather than faked." },
    ],
    finalAnswer: "The state is mathematically identical either way; only the gate-by-gate construction of it (a separate engineering problem) is skipped, while the actual interference mechanism downstream is fully genuine.",
  },
  explanation: {
    correctIdea: "Scoping out a hard sub-problem while keeping the actually-relevant mechanism fully real and verified is different from faking the whole thing.",
    whyCorrect: "This is exactly the distinction the lesson's scope note draws, and why the QFT extraction is checked to floating-point precision despite the state's shortcut construction.",
    whyWrong: ["Claiming this makes the whole demonstration 'fake' ignores that the interference step — the actual point of the lesson — is computed exactly, not approximated or hardcoded."],
  },
};
