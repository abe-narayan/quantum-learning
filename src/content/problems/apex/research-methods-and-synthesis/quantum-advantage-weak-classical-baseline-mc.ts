import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const quantumAdvantageWeakClassicalBaselineMc: MultipleChoiceProblem = {
  meta: {
    slug: "quantum-advantage-weak-classical-baseline-mc",
    title: "A Quantum Advantage Claim Against the Wrong Baseline",
    course: "research-methods-and-synthesis",
    lesson: "apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims",
    difficulty: "master",
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
        text: "It fails the checklist's baseline question: the device was never compared against the best classical algorithm at announcement time",
      },
      {
        id: "b",
        text: "It passes the baseline question, since the newer classical algorithm appeared after the quantum runs were performed on the device",
      },
      {
        id: "c",
        text: "It fails question 4 instead: a fast classical algorithm existing means task Z must fall into a named simulability loophole after all",
      },
      {
        id: "d",
        text: "It fails question 3 instead: the classical-hardness argument for task Z rests on an assumption nobody has managed to prove yet",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The scenario puts the faster classical algorithm in print before the announcement, so it was available to the people making the claim. The checklist asks about the best known approach at the time of the claim, not at the time of the first run.",
      c: "Question 4 asks about structure inside the task, such as a stabilizer circuit or a bounded bond dimension. A better classical algorithm turning up is a fact about the state of the art, which is question 2's territory.",
      d: "Question 3 asks what a hardness argument rests on, and it applies whatever baseline was used. The problem here sits upstream of that: the comparison itself was run against the wrong algorithm.",
    },
    defaultIncorrectFeedback:
      "Work through the checklist in order and find the question that asks whether the classical comparison used the actual best known classical approach, rather than merely some classical approach.",
  },
  hints: [
    { text: "The checklist's second question is not just 'was there a classical comparison'. It asks whether that comparison used the best known classical approach at the time." },
    { text: "A faster, already-published classical algorithm existing at the time of the announcement is the situation question 2 is designed to catch." },
    { text: "This is a question about which classical baseline was used for comparison, not about the task's structural simulability (question 4) or the assumption behind classical hardness (question 3)." },
  ],
  solution: {
    steps: [
      { description: "The checklist's second question asks specifically whether the classical comparison used the best known classical approach at the time, not merely some classical algorithm." },
      { description: "Here, a faster classical algorithm was already published before the announcement, so the comparison used a weaker baseline than the actual state of the art." },
      { description: "This means the advantage claim, as reported, has not established anything relative to the best known classical approach. The next step is to re-run the comparison against the faster algorithm before accepting or rejecting the claim." },
    ],
    finalAnswer: "The claim fails the checklist's baseline question: it was never benchmarked against the best known classical algorithm available at the time.",
  },
  explanation: {
    correctIdea:
      "A quantum advantage claim is only as strong as its classical baseline, and the checklist's second question exists specifically to catch a claim benchmarked against a weaker-than-best-known classical approach.",
    whyCorrect:
      "Naming the violated checklist question (the baseline question) and the remedy that follows from it, comparing against the best known classical algorithm before drawing any conclusion, is the whole move the checklist asks for.",
    whyWrong: [
      { optionId: "b", text: "Moves the goalposts to when the runs happened. The faster algorithm was already published when the claim was made, which is the moment the checklist asks about." },
      { optionId: "c", text: "Jumps to a structural conclusion the scenario does not support. A better classical algorithm says something about the state of the art, not about the task falling into a named simulability loophole." },
      { optionId: "d", text: "Reaches for the right checklist question at the wrong moment. Whatever the hardness argument assumes, this claim was already compared against a baseline that had been superseded." },
    ],
  },
};
