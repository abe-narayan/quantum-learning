import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const quantumAdvantageWeakClassicalBaselineMc: MultipleChoiceProblem = {
  meta: {
    slug: "quantum-advantage-weak-classical-baseline-mc",
    title: "A Quantum Advantage Claim Against the Wrong Baseline",
    course: "research-methods-and-synthesis",
    lesson: "apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "multiple-choice",
    tags: ["quantum-advantage", "quantum-supremacy", "claim-evaluation", "classical-simulation"],
    prerequisites: ["apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "A company announces 'quantum advantage' on computational task Z, reporting that their quantum device beats the classical runtime of a particular classical algorithm published several years earlier. A different classical algorithm, published more recently but before the announcement, already solves Z faster than the quantum device does. Using this lesson's checklist, what is the most precise assessment?",
    options: [
      {
        id: "a",
        text: "The claim fails the checklist's baseline question: it was not benchmarked against the best known classical approach available at the time, so the quantum-advantage claim is not yet established against the actual state of the art -- the device should be compared against the faster, already-published classical algorithm before any advantage claim can stand.",
      },
      {
        id: "b",
        text: "The claim is valid regardless, since any comparison against any real classical algorithm counts as establishing quantum advantage.",
      },
      {
        id: "c",
        text: "The claim is meaningless and task Z must fall into one of the classical-simulability loopholes (Gottesman-Knill or bounded bond dimension), since a fast classical algorithm for it exists.",
      },
      {
        id: "d",
        text: "The claim can only be evaluated once someone proves whether the polynomial hierarchy collapses, since that is the only thing that determines whether a quantum advantage claim is valid.",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The checklist's second question is specifically whether the comparison was against the *best known* classical approach, not merely *a* classical approach. A claim that ignores a faster, already-published classical algorithm has not established advantage over the actual state of the art, regardless of how it compares to some older or weaker baseline.",
      c: "A faster classical algorithm existing doesn't automatically mean the task falls into one of the two named structural loopholes -- it could also just mean the field's best known classical algorithm for this specific task has genuinely improved, which is a question about the state of the art (question 2), not necessarily about the task's underlying structure (question 4). The two questions are related but not identical.",
      d: "The polynomial-hierarchy assumption is relevant to question 3 (what does the classical-hardness argument rest on), but it doesn't resolve question 2 at all -- a claim can be comparing against a weak baseline regardless of what complexity-theoretic assumption underlies classical hardness in general.",
    },
    defaultIncorrectFeedback:
      "Work through the checklist in order. Which specific question asks whether the classical comparison used the actual best known classical approach, rather than any classical approach?",
  },
  hints: [
    { text: "The checklist's second question is not just 'was there a classical comparison' -- it's specifically whether that comparison used the best known classical approach at the time." },
    { text: "A faster, already-published classical algorithm existing at the time of the announcement is exactly the situation question 2 is designed to catch." },
    { text: "This is a question about which classical baseline was used for comparison, not about the task's structural simulability (question 4) or the assumption behind classical hardness (question 3)." },
  ],
  solution: {
    steps: [
      { description: "The checklist's second question asks specifically whether the classical comparison used the best known classical approach at the time, not merely some classical algorithm." },
      { description: "Here, a faster classical algorithm was already published before the announcement, so the comparison used a weaker baseline than the actual state of the art." },
      { description: "This means the advantage claim, as reported, has not established anything relative to the real best-known classical approach -- the correct next step is to re-run the comparison against the faster algorithm before accepting or rejecting the claim." },
    ],
    finalAnswer: "(a)",
  },
  explanation: {
    correctIdea:
      "A quantum advantage claim is only as strong as its classical baseline, and the checklist's second question exists specifically to catch a claim benchmarked against a weaker-than-best-known classical approach.",
    whyCorrect:
      "Option (a) correctly identifies which checklist question is violated (the baseline question) and states the correct remedy: compare against the actual best known classical algorithm before drawing any conclusion.",
    whyWrong: [
      "(b) treats 'compared against some classical algorithm' as sufficient, collapsing the important distinction between a weak baseline and the genuine state of the art.",
      "(c) jumps to a structural conclusion (one of the two named loopholes) that isn't warranted by the scenario -- the scenario is about the comparison being outdated, not necessarily about the task's own structure.",
      "(d) conflates question 3's complexity-theoretic assumption with question 2's baseline-quality question; the two are independent parts of the checklist.",
    ],
  },
};
