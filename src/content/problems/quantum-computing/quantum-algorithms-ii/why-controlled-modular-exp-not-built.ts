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
      {
        phrases: ["mathematically identical", "mathematically equivalent", "mathematically the same", "identical state", "identical result", "identical amplitudes", "same amplitudes either way", "the same state either way", "same state you would get", "exactly the state", "exact state", "exactly what", "no difference", "indistinguishable", "equivalent"],
        missingFeedback:
          "You have said which part of the mechanism survives. Now say what is true of the object the skipped circuit would have produced, set beside the one the engine writes down.",
      },
      {
        phrases: ["interference", "qft step", "qft", "downstream", "what actually matters", "the mechanism", "real mechanism", "still genuine", "fully real"],
        missingFeedback:
          "You have said the two agree. Now say what happens after the state is built, and why that later part is where the physics being demonstrated actually lives.",
      },
    ],
    incorrectFeedback: "You defended the choice on grounds of effort ('it would be too hard to build'), which is a reason to scope it out but not an argument that the demonstration is honest. Compare the two things directly: what the shortcut produces, and what the omitted circuit would have produced, and then ask which stage of the algorithm actually does the physics.",
    partialFeedback: "Now address the other half: which stage of the pipeline carries the physics this lesson is teaching, and whether the shortcut touched it at all.",
    modelAnswers: [
      "The state you end up with is mathematically identical either way. What is skipped is only the gate-by-gate circuit that would build it, which is a separate engineering problem, and the interference in the QFT step afterwards is completely real.",
      "There is no difference between the amplitudes a real controlled-modular-exponentiation circuit would leave behind and the ones the engine writes down directly. Everything downstream, the QFT and the interference that actually matters, is genuine.",
      "Building the state and building the circuit that builds the state are two different tasks. The state is exactly what the circuit would produce, so the QFT step and the real mechanism it exercises are untouched by the shortcut.",
    ],
  },
  hints: [
    { text: "Compare the amplitudes the shortcut produces with those a full controlled-modular-multiplication circuit would produce. Are they the same numbers?" },
    { text: "Now ask which stage of the algorithm the lesson is actually about, and where in the pipeline that stage sits relative to the shortcut." },
    { text: "If a later stage receives precisely the input it would have received anyway, say what that stage's computation demonstrates and what it does not." },
  ],
  solution: {
    steps: [
      { description: "periodFindingState's output amplitudes are mathematically identical to what a real controlled-modular-exponentiation circuit would produce." },
      { description: "Everything downstream, meaning the QFT applied to the counting register, is the real interference mechanism, computed and verified exactly." },
      { description: "The gate-by-gate circuit that would produce this state is a separate, substantial engineering problem (real quantum arithmetic), honestly scoped out rather than faked." },
    ],
    finalAnswer: "The state is mathematically identical either way; only the gate-by-gate construction of it (a separate engineering problem) is skipped, while the actual interference mechanism downstream is fully genuine.",
  },
  explanation: {
    correctIdea: "Scoping out a hard sub-problem while keeping the actually-relevant mechanism fully real and verified is different from faking the whole thing.",
    whyCorrect: "This is exactly the distinction the lesson's scope note draws, and why the QFT extraction is checked to floating-point precision despite the state's shortcut construction.",
    whyWrong: ["Claiming this makes the whole demonstration 'fake' ignores that the interference step, the point of the lesson, is computed exactly rather than approximated or hardcoded."],
  },
};
