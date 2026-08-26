import type { NumericProblem } from "@/lib/problems/types";

export const stinespringEnvironmentOutcomeProbability: NumericProblem = {
  meta: {
    slug: "stinespring-environment-outcome-probability",
    title: "Probability the Environment Learns a Decay Occurred",
    course: "quantum-shannon-theory",
    lesson: "quantum-mastery/quantum-shannon-theory/stinespring-dilation-and-channel-purification",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["stinespring-dilation", "amplitude-damping", "kraus-operators"],
    prerequisites: ["quantum-mastery/quantum-shannon-theory/stinespring-dilation-and-channel-purification"],
  },
  question: {
    type: "numeric",
    prompt:
      "In the amplitude-damping Stinespring dilation with gamma=0.4, the system starts in rho=|+><+| = [[0.5,0.5],[0.5,0.5]] and the environment starts in |0>. After the joint unitary U acts, what is the probability the environment is found in state |1> (i.e. Tr[K1 rho K1-dagger])?",
    inputHint: "as a decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.2,
    tolerance: 0.001,
    incorrectFeedback:
      "K1 = [[0, sqrt(gamma)], [0, 0]], so K1 rho K1-dagger has a single nonzero entry, gamma * rho_11, in its (0,0) position. Its trace is therefore just gamma * rho_11 = 0.4 * 0.5.",
  },
  hints: [
    { text: "The lesson showed Tr_E of the joint output, restricted to the environment finding outcome i, is exactly Tr[K_i rho K_i-dagger] -- the probability that branch occurred." },
    { text: "For amplitude damping, K1 = [[0, sqrt(gamma)], [0, 0]]." },
    { text: "Compute K1 rho K1-dagger directly: only the (0,0) entry survives, equal to gamma * rho_11." },
  ],
  solution: {
    steps: [
      { description: "K1 rho K1-dagger has Kraus operator $K_1=\\begin{pmatrix}0&\\sqrt\\gamma\\\\0&0\\end{pmatrix}$." },
      { description: "Multiplying out, $K_1\\rho K_1^\\dagger$ has a single nonzero entry: $(K_1\\rho K_1^\\dagger)_{00} = \\gamma\\,\\rho_{11}$." },
      { description: "For $\\rho=|+\\rangle\\langle+|$, $\\rho_{11}=0.5$, so the probability is $\\text{Tr}[K_1\\rho K_1^\\dagger] = 0.4\\times0.5 = 0.2$." },
    ],
    finalAnswer: "Probability the environment reads |1> is 0.2.",
  },
  explanation: {
    correctIdea:
      "The Stinespring dilation makes precise which physical quantity each Kraus term corresponds to: Tr[K_i rho K_i-dagger] is exactly the probability the environment is found in branch i after the joint unitary acts, the same 'environment learns which error occurred' idea this lesson connects to error correction.",
    whyCorrect:
      "This follows directly from tracing the joint output state onto the environment's |1> outcome instead of tracing it away entirely: Tr_S[<1|_E (U(rho tensor |0><0|_E) U-dagger) |1>_E] = K1 rho K1-dagger, whose trace is the marginal probability of that outcome.",
    whyWrong: [
      "Using rho_00 instead of rho_11 swaps which population is at risk of decaying -- K1 only has support on the |1> subspace of the system, since only an excited qubit can decay.",
      "Forgetting to square/use gamma directly (rather than sqrt(gamma)) undercounts the probability, since the Kraus operator carries sqrt(gamma) but the probability is quadratic in it.",
    ],
  },
};
