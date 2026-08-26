import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const capstoneClassifyRcsClaimMc: MultipleChoiceProblem = {
  meta: {
    slug: "capstone-classify-rcs-claim-mc",
    title: "Classifying a Random Circuit Sampling Claim",
    course: "quantum-complexity-theory",
    lesson: "apex/quantum-complexity-theory/capstone-what-we-know-and-dont",
    difficulty: "advanced",
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
        text: "The experiment provides strong empirical evidence, consistent with a real Tier 2 conjecture, that efficient quantum computation is separated from efficient classical simulation -- for this one specific, carefully engineered sampling task, resting on the plausible but unproven assumption that the polynomial hierarchy does not collapse. It does not constitute an unconditional proof.",
      },
      {
        id: "b",
        text: "The claim is correct as stated: sampling from a random circuit's output distribution faster than any classical computer can is, by definition, an unconditional proof that BQP strictly contains P.",
      },
      {
        id: "c",
        text: "The claim is meaningless publicity and should be dismissed outright, since the classical-hardness margin for specific instances has since been narrowed or contested by improved classical algorithms.",
      },
      {
        id: "d",
        text: "The experiment resolves whether NP is contained in BQP, since random circuit sampling is itself an NP-complete problem.",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Sampling faster than a specific classical algorithm on a specific instance is an empirical, experimental fact, not a mathematical proof. Turning it into an unconditional separation theorem would require proving the polynomial-hierarchy assumption the classical-hardness argument itself rests on, which nobody has done.",
      c: "This overcorrects in the opposite direction. A later classical algorithm narrowing or contesting a specific hardness margin is normal, healthy scientific self-correction -- it doesn't retroactively make the original empirical result meaningless, it's exactly how the field checks extraordinary claims.",
      d: "Random circuit sampling is a sampling task chosen for its believed classical hardness, not an NP-complete decision problem, and the experiment says nothing about NP subseteq BQP at all.",
    },
    defaultIncorrectFeedback:
      "Recall the lesson's worked example: classify the underlying theoretical claim (Tier 1, 2, or 3), name the real evidence and the assumption it rests on, and be precise about what the experiment does and does not establish -- neither dismissing it nor overclaiming it.",
  },
  hints: [
    { text: "Is this claim a mathematical proof (Tier 1), a conjecture with stated evidence (Tier 2), or an open question (Tier 3)?" },
    { text: "What specific, named theoretical assumption does random circuit sampling's classical-hardness argument rest on?" },
    { text: "The correct answer should neither dismiss the experiment as meaningless nor accept it as an unconditional proof." },
  ],
  solution: {
    steps: [
      { description: "Random circuit sampling's classical hardness rests on a real, citable argument: if a classical computer could efficiently sample the same distribution, the polynomial hierarchy would collapse to a finite level -- itself an unproven, if widely disbelieved, assumption." },
      { description: "This places the underlying theoretical claim in Tier 2 (strongly-evidenced conjecture), not Tier 1 (proven theorem): the experiment is empirical evidence consistent with the conjecture, for one specific engineered task." },
      { description: "Subsequent classical algorithms narrowing or contesting specific instances' hardness margins are a normal part of testing a Tier 2 claim, not evidence the whole enterprise is invalid." },
    ],
    finalAnswer: "(a)",
  },
  explanation: {
    correctIdea:
      "A random circuit sampling experiment is genuine, strong empirical evidence for a real but unproven complexity-theoretic conjecture, on one specific task -- not a proof, and not noise.",
    whyCorrect:
      "Option (a) correctly names the conjecture at stake, the real theoretical basis for it (the polynomial hierarchy not collapsing), and correctly declines to call the experiment an unconditional proof, exactly matching this capstone's worked example.",
    whyWrong: [
      "(b) conflates an empirical demonstration with a mathematical proof, ignoring that the classical-hardness argument itself rests on an unproven assumption.",
      "(c) overcorrects: contested or narrowed hardness margins are healthy self-correction, not proof the original result was meaningless.",
      "(d) misidentifies random circuit sampling as an NP-complete decision problem it is not, and misapplies it to an unrelated open question.",
    ],
  },
};
