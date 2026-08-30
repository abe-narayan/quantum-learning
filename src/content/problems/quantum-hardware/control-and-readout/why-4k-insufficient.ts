import type { ConceptualProblem } from "@/lib/problems/types";

export const why4kInsufficient: ConceptualProblem = {
  meta: {
    slug: "why-4k-insufficient",
    title: "Why 4K Alone Isn't Cold Enough",
    course: "control-and-readout",
    lesson: "quantum-hardware/control-and-readout/cryogenic-systems",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["cryogenics"],
    prerequisites: ["quantum-hardware/control-and-readout/cryogenic-systems"],
  },
  question: {
    type: "conceptual",
    prompt: "Using the lesson's computed table, explain why 4K, despite being extremely cold by everyday standards, is still insufficient for reliable qubit operation.",
    placeholder: "At 4K, the thermal occupation n̄ is approximately..., which means...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["16", "greater than 1", "greater than one", "above 1", "above one", "exceeds 1", "well over 1", "much larger than 1", "mean photon number"],
        missingFeedback:
          "Read the number off the table for 4K, and say how it compares with the threshold value of one.",
      },
      {
        phrases: ["thermally populated", "randomized", "not reliably ground state"],
        missingFeedback:
          "You have the number. Now say what it means physically for the qubit: what state is it actually sitting in when that quantity is that size?",
      },
    ],
    incorrectFeedback: "Give the actual figure from the lesson's table for a 5 GHz qubit at 4 K, then say what it means physically. A figure of that size is the average count of thermal quanta sitting in the mode before anything has been done to it, so the question to answer is what the qubit is doing when the circuit starts.",
    partialFeedback: "Good. Now finish the physical reading: say what a count that far above unity does to the qubit's starting condition, before a single gate has run.",
    modelAnswers: [
      "At 4K the table gives n-bar of about 16, which is much larger than 1. That means the qubit mode is thermally populated rather than sitting reliably in its ground state, so the state gets randomized before you can compute with it.",
      "The mean photon number at 4K comes out well over 1, around 16. Once it exceeds 1 the mode is significantly thermally populated and the qubit is not reliably ground state.",
    ],
  },
  hints: [
    { text: "Look up the lesson's table row for a 5 GHz qubit at 4 K and read off the occupation figure." },
    { text: "An occupation figure well over unity means many thermal quanta share the mode on average." },
    { text: "Ask what that does to the qubit before the circuit begins: is it sitting reliably anywhere, or is it being kicked around?" },
  ],
  solution: {
    steps: [
      { description: "At 4K, n̄≈16.2 for a 5 GHz qubit, well above 1." },
      { description: "n̄≫1 means the mode is significantly thermally populated: on average many thermal photons occupy it, rather than the qubit reliably sitting in its ground state." },
      { description: "Computation would therefore start from an effectively randomized, thermally mixed state rather than a well-defined |0⟩. That is unusable for reliable quantum computation, despite 4K being 'very cold' in everyday terms." },
    ],
    finalAnswer: "n̄≈16 at 4K means the qubit mode is significantly thermally populated, not reliably in its ground state. 4K is cold, but still far too warm by this particular physical standard.",
  },
  explanation: {
    correctIdea: "This forces the reader to use the specific numerical threshold, n̄ crossing 1, rather than a vague 'colder is better' intuition.",
    whyCorrect: "n̄ counts how many thermal quanta share the qubit's mode on average. A value near 16 means the qubit is being kicked between its levels constantly before the circuit even starts, so 'cold' has to be judged against ħω/k_B rather than against room temperature.",
    whyWrong: ["Saying '4K just isn't quite cold enough' without citing the specific n̄≈16 value or its implication for ground-state reliability misses the lesson's quantitative point."],
  },
};
