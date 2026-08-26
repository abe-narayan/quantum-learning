import type { NumericProblem } from "@/lib/problems/types";

export const holevoChiBb84AtP: NumericProblem = {
  meta: {
    slug: "holevo-chi-bb84-at-p",
    title: "The Holevo Quantity for a Non-Orthogonal Ensemble Through Noise",
    course: "quantum-shannon-theory",
    lesson: "quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["holevo-quantity", "classical-capacity", "depolarizing-channel"],
    prerequisites: ["quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise"],
  },
  question: {
    type: "numeric",
    prompt:
      "The capstone's BB84 ensemble {1/2, |0><0|; 1/2, |+><+|} is sent through the depolarizing channel N_p(rho) = (1-p)rho + p*I/2 at p=0.2. Sending each pure state through the channel gives two identical individual output entropies S(N_0.2(|0><0|)) = S(N_0.2(|+><+|)) = 0.46900 bits (by the symmetry of the two Bloch vectors), and the average output state has entropy S(avg) = 0.75494 bits. Compute the Holevo quantity chi(0.2) = S(avg) - average individual entropy.",
    inputHint: "in bits, 4 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.28594,
    tolerance: 0.001,
    incorrectFeedback:
      "chi(p) = S(average state) - (1/2)*S(rho_0(p)) - (1/2)*S(rho_+(p)) = 0.75494 - 0.5*(0.46900) - 0.5*(0.46900) = 0.75494 - 0.46900.",
  },
  hints: [
    { text: "The Holevo quantity is chi = S(sum_i p_i rho_i) - sum_i p_i S(rho_i), the entropy of the average state minus the (probability-weighted) average of the individual entropies." },
    { text: "Here both individual output entropies are equal (0.46900 bits each), so their weighted average is just 0.46900 bits." },
    { text: "chi(0.2) = 0.75494 - 0.46900." },
  ],
  solution: {
    steps: [
      { description: "By definition, $\\chi = S(\\rho_{\\text{avg}}) - \\tfrac12 S(\\rho_0(p)) - \\tfrac12 S(\\rho_+(p))$." },
      { description: "Both individual terms are equal here (0.46900 bits each), so the weighted average of the individual entropies is also $0.46900$." },
      { description: "$\\chi(0.2) = 0.75494 - 0.46900 = 0.28594$ bits." },
    ],
    finalAnswer: "chi(0.2) ≈ 0.2859 bits.",
  },
  explanation: {
    correctIdea:
      "The Holevo quantity always subtracts the noise's own contribution to the individual output states' mixedness from the total spread of the ensemble's average state -- what's left over is the genuinely label-distinguishing information a measurement could in principle extract.",
    whyCorrect:
      "This exactly matches the capstone's own computed curve: chi falls from about 0.601 bits at p=0 (noiseless, but still capped below 1 bit since |0> and |+> are non-orthogonal) down through 0.286 bits at p=0.2, continuing to fall toward exactly 0 at p=1, since more depolarizing noise both raises each individual output's entropy and pulls the average state's entropy toward (but never below) that same value.",
    whyWrong: [
      "Using 1 - 0.46900 = 0.531 confuses this ensemble's chi with the true single-letter classical capacity C(p), which is achieved by an orthogonal ensemble instead (a different, larger number at the same p, per the lesson's King's-theorem note).",
      "Using S(avg) alone (0.75494) as the answer ignores that part of the average state's entropy is just each individual output's own noise-induced mixedness, not label-distinguishing signal.",
    ],
  },
};
