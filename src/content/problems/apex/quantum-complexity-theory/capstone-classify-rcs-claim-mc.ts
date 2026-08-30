import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const capstoneClassifyRcsClaimMc: MultipleChoiceProblem = {
  meta: {
    slug: "capstone-classify-rcs-claim-mc",
    title: "Classifying a Random Circuit Sampling Claim",
    course: "quantum-complexity-theory",
    lesson: "apex/quantum-complexity-theory/capstone-what-we-know-and-dont",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "multiple-choice",
    tags: ["complexity-theory", "quantum-supremacy", "random-circuit-sampling", "claim-evaluation"],
    prerequisites: ["apex/quantum-complexity-theory/capstone-what-we-know-and-dont"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "A press release states: 'Our random circuit sampling experiment proves that quantum computers are unconditionally more powerful than classical computers.' Using this capstone's three-tier framework, which is the most precise assessment?",
    options: [
      {
        id: "a",
        text: "Strong evidence for a Tier 2 conjecture about one engineered sampling task, conditional on the polynomial hierarchy not collapsing",
      },
      {
        id: "b",
        text: "A Tier 1 result for this one task: the sampling separation is proven, though it does not extend to problems anyone wanted solved",
      },
      {
        id: "c",
        text: "A Tier 2 conjecture about quantum computing in general, since a separation on one engineered task evidences separation broadly",
      },
      {
        id: "d",
        text: "A Tier 3 open question, since improved classical simulations have contested the runtime margin the experiment originally claimed",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The scope caveat is right and the tier is not. The classical-hardness argument for this sampling task is conditional on the polynomial hierarchy failing to collapse, so nothing in it is unconditionally proven.",
      c: "The tier is right and the scope is not. The hardness argument is built around this particular circuit family, chosen for that property; nothing in it carries over to a task anyone wanted the answer to.",
      d: "A contested runtime margin is ordinary self-correction, and it lowers confidence in one number rather than emptying the evidence. Tier 3 is for questions with no strong evidence either way, which is not this one.",
    },
    defaultIncorrectFeedback:
      "Two things have to come out right at once: which tier the underlying claim belongs in, and how wide the claim is. Getting one and missing the other is not the most precise assessment.",
  },
  hints: [
    { text: "Is this claim a mathematical proof (Tier 1), a conjecture with stated evidence (Tier 2), or an open question (Tier 3)?" },
    { text: "What specific, named theoretical assumption does random circuit sampling's classical-hardness argument rest on?" },
    { text: "Two things have to be right at once here: the tier the claim belongs in, and how wide the claim is. An answer that lands one and misses the other is not the best assessment." },
  ],
  solution: {
    steps: [
      { description: "Random circuit sampling's classical hardness rests on a real, citable argument: if a classical computer could efficiently sample the same distribution, the polynomial hierarchy would collapse to a finite level. That non-collapse is itself an unproven, if widely believed, assumption." },
      { description: "This places the underlying theoretical claim in Tier 2 (strongly-evidenced conjecture), not Tier 1 (proven theorem): the experiment is empirical evidence consistent with the conjecture, for one specific engineered task." },
      { description: "Subsequent classical algorithms narrowing or contesting specific instances' hardness margins are a normal part of testing a Tier 2 claim, not evidence the whole enterprise is invalid." },
    ],
    finalAnswer: "Strong empirical evidence for a Tier 2 conjecture on one engineered task, resting on the polynomial hierarchy not collapsing, and not an unconditional proof.",
  },
  explanation: {
    correctIdea:
      "A random circuit sampling experiment is strong empirical evidence for a real but unproven complexity-theoretic conjecture, on one specific task. It is neither a proof nor noise.",
    whyCorrect:
      "The Tier 2 reading names the conjecture at stake, names the real theoretical basis for it (the polynomial hierarchy not collapsing), and declines to call the experiment an unconditional proof: this capstone's worked example, step for step.",
    whyWrong: [
      { optionId: "b", text: "Reads a conditional separation as an unconditional one. The hardness argument itself assumes the polynomial hierarchy does not collapse, which nobody has established." },
      { optionId: "c", text: "Generalises past the evidence. The circuit family was engineered for hardness, and the argument does not travel to tasks that were not." },
      { optionId: "d", text: "Confuses a contested margin with an absence of evidence. Improved classical simulation narrows a number; it does not return the question to open." },
    ],
  },
};
