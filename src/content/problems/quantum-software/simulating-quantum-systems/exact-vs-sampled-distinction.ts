import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const exactVsSampledDistinction: MultipleChoiceProblem = {
  meta: {
    slug: "exact-vs-sampled-distinction",
    title: "Exact Amplitudes vs. Sampled Estimates",
    course: "simulating-quantum-systems",
    lesson: "quantum-software/simulating-quantum-systems/state-vector-simulation",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["state-vector-simulation"],
    prerequisites: ["quantum-software/simulating-quantum-systems/state-vector-simulation"],
  },
  question: {
    type: "multiple-choice",
    prompt: "One of runCircuit and sampleMeasurements returns exact probabilities, up to floating-point precision; the other returns a statistical estimate. Which is which?",
    options: [
      { id: "a", text: "runCircuit is exact; sampleMeasurements estimates, because a finite number of draws lands near the truth" },
      { id: "b", text: "Both are exact: sampleMeasurements reads its outcome frequencies off the same amplitudes runCircuit computes" },
      { id: "c", text: "Both estimate: runCircuit's repeated matrix multiplications accumulate rounding error that grows with circuit depth" },
      { id: "d", text: "sampleMeasurements is exact; runCircuit estimates, since it truncates amplitudes below a threshold to stay fast" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "It starts from those amplitudes and then draws from them. A finite number of draws lands near the true probabilities, not on them: run it twice and the counts differ.",
      c: "Floating-point rounding is real, and it is orders of magnitude below the shot noise of any realistic sample count. It is also not statistical estimation: run runCircuit twice and you get identical numbers.",
      d: "This reverses the two. runCircuit keeps every amplitude and truncates nothing; sampleMeasurements is the one whose answer moves from run to run.",
    },
    defaultIncorrectFeedback: "Ask which of the two would return different numbers if you called it twice with the same input.",
  },
  hints: [
    { text: "Ask which function would return different numbers on a second call with identical inputs." },
    { text: "runCircuit multiplies matrices through to the final amplitudes and reads probabilities straight off them." },
    { text: "sampleMeasurements draws individual outcomes at random, so its answer carries shot noise that shrinks only as the shot count grows." },
  ],
  solution: {
    steps: [{ description: "runCircuit propagates amplitudes through deterministic linear algebra and reads probabilities off the final state, so repeated calls give identical numbers. sampleMeasurements draws random outcomes from that distribution, so its frequencies carry shot noise and move from call to call." }],
    finalAnswer: "runCircuit is exact; sampleMeasurements returns a statistical estimate subject to shot noise.",
  },
  explanation: {
    correctIdea: "One function computes the distribution, the other draws from it. That is the whole distinction, and repeatability is the quickest way to tell them apart.",
    whyCorrect: "One propagates amplitudes deterministically and reads probabilities off the result, so repeated calls agree exactly. The other draws outcomes at random from that distribution, so its frequencies wobble from call to call by an amount that shrinks only as 1/√shots.",
    whyWrong: [
      { optionId: "b", text: "Notices the shared starting point and misses the draw that follows it." },
      { optionId: "c", text: "Promotes floating-point rounding into statistical error. Rounding is deterministic and far smaller than shot noise." },
      { optionId: "d", text: "Reverses the two roles, and credits runCircuit with a truncation it does not perform." },
    ],
  },
};
