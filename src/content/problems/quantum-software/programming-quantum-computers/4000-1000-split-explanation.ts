import type { ConceptualProblem } from "@/lib/problems/types";

export const fourThousandOneThousandSplitExplanation: ConceptualProblem = {
  meta: {
    slug: "4000-1000-split-explanation",
    title: "Is a 4000/1000 Split Shot Noise or Something Else?",
    course: "programming-quantum-computers",
    lesson: "quantum-software/programming-quantum-computers/writing-your-first-circuit",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["shot-noise", "conceptual"],
    prerequisites: ["quantum-software/programming-quantum-computers/writing-your-first-circuit"],
  },
  question: {
    type: "conceptual",
    prompt: "A GHZ-state experiment gives 4000 '000' counts and 1000 '111' counts out of 5000 shots (badly off from the expected ~50/50 split). Using the lesson's expected ±71-count range, explain whether this is plausibly shot noise alone.",
    placeholder: "The expected range from shot noise alone is roughly..., but the observed deviation is...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["71", "expected range", "shot noise alone"],
      ["1500", "far outside", "not consistent", "something else"],
    ],
    incorrectFeedback: "Cite the specific expected range from the lesson, and compare it numerically to the observed deviation in this scenario.",
    partialFeedback: "Good — now be explicit that the observed deviation is far outside the shot-noise-only range, implying an additional cause.",
  },
  hints: [
    { text: "The lesson's worked example found a 95% expected range of roughly ±71 counts around 2500 for a perfect 50/50 split at 5000 shots." },
    { text: "The observed split here is 4000/1000 — a deviation of 1500 from the expected 2500/2500." },
    { text: "1500 is drastically outside the ±71 range shot noise alone would produce." },
  ],
  solution: {
    steps: [
      { description: "The expected range from pure shot noise alone (at 5000 shots, ideal 50/50 probability) is roughly 2500±71, i.e. between about 2429 and 2571." },
      { description: "The observed 4000/1000 split deviates by 1500 counts from the expected 2500 — far outside the ±71 range." },
      { description: "This deviation is NOT plausibly explained by shot noise alone — it indicates either a circuit-logic error (the intended GHZ state wasn't actually prepared correctly) or a genuine hardware/simulation bug, not ordinary statistical fluctuation." },
    ],
    finalAnswer: "The observed deviation (1500) is far outside the expected shot-noise range (±71) — this is not plausibly shot noise alone; it indicates a real error elsewhere (circuit logic or hardware/simulation bug).",
  },
  explanation: {
    correctIdea: "This applies the lesson's own statistical reasoning to distinguish 'expected randomness' from 'a real problem,' a genuinely practical debugging skill.",
    whyCorrect: "Matches the lesson's explicit practice-question framing and expected-range calculation.",
    whyWrong: ["Assuming any deviation from a perfect split could be shot noise, without checking it against the actual expected statistical range, misses the whole point of having computed that range."],
  },
};
