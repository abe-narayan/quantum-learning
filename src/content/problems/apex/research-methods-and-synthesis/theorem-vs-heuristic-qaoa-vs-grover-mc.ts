import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const theoremVsHeuristicQaoaVsGroverMc: MultipleChoiceProblem = {
  meta: {
    slug: "theorem-vs-heuristic-qaoa-vs-grover-mc",
    title: "Why QAOA's Heuristic Status Doesn't Make It Worthless",
    course: "research-methods-and-synthesis",
    lesson: "apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "multiple-choice",
    tags: ["research-methods", "theorem-vs-heuristic", "qaoa", "grovers-algorithm"],
    prerequisites: ["apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "Grover's algorithm's Θ(√N) optimality is a proven theorem (established independently by the adversary method and the polynomial method). QAOA's approximation ratio on large, practically relevant Max-Cut instances is evaluated empirically/numerically, without a matching general proof. A colleague argues: 'Since QAOA's real-world performance isn't proven the way Grover's optimality is, QAOA research is scientifically weaker and its results shouldn't be trusted.' Using this lesson's checklist, which response is most precise?",
    options: [
      {
        id: "a",
        text: "A well-supported heuristic is a normal category, not an unscientific one; what moves QAOA's tier is one missing result, a general-depth worst-case ratio proof",
      },
      {
        id: "b",
        text: "The colleague is right: without a general proof, QAOA's reported performance should be treated as unreliable until a full theorem arrives",
      },
      {
        id: "c",
        text: "The colleague is half right: QAOA does sit a tier below, so its numbers can be reported but should never guide a decision about what to build",
      },
      {
        id: "d",
        text: "QAOA's proven p=1 bound on a restricted graph class already settles the tier for the whole algorithm, so the general-depth claim needs no separate classification",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This treats 'not yet proven' as though it meant 'not worth trusting'. A heuristic with strong numerical support across many instances is a normal and valuable category of result, and QAOA's restricted p=1 case even carries a proven guarantee on a specific graph class, which a wholesale dismissal throws away along with everything else.",
      c: "Placing it a tier below is right; the conclusion drawn from that is not. A tier records what evidence stands behind a claim, not whether the evidence may be acted on. Well-supported heuristics guide engineering decisions across the whole of computing.",
      d: "A proof about one restricted case does not carry the general claim. The p=1 bound is real and narrow, and the empirical result at general depth is a separate claim that has to be tiered on its own evidence.",
    },
    defaultIncorrectFeedback:
      "Recall the lesson's central point about QAOA. An unproven general performance claim, backed by strong numerical evidence, is a Heuristic in good standing, not a failure of rigor. Ask what specific missing result would move it to Theorem status, rather than treating 'unproven' as 'untrustworthy'.",
  },
  hints: [
    { text: "This lesson warns against two opposite mistakes: reporting a heuristic as a theorem, and dismissing a heuristic as worthless because it is not one. Which mistake is the colleague making?" },
    { text: "Recall real classical examples of trusted heuristics with no general worst-case proof, such as simulated annealing and many practical SAT solvers, and ask where QAOA sits relative to them." },
    { text: "The correct answer should name the specific result that would upgrade QAOA's status, without confusing a narrow proven case for the general claim." },
  ],
  solution: {
    steps: [
      { description: "QAOA's general, large-instance Max-Cut performance is Tier 2 (heuristic/empirical): strong numerical support, no matching general proof. That is the same epistemic category as classical heuristics like simulated annealing." },
      { description: "Tier 2 is not a lesser or unscientific category; it is one of the most common and useful categories in all of computer science." },
      { description: "The precise, checklist-driven response names the specific missing result (a general worst-case approximation-ratio proof for practically relevant instance classes) rather than dismissing the existing heuristic evidence as untrustworthy." },
    ],
    finalAnswer: "QAOA sits in the well-populated heuristic tier, and what would move it is a specific missing result: a matching worst-case approximation-ratio proof at general depth.",
  },
  explanation: {
    correctIdea:
      "A claim's tier (theorem versus heuristic) says nothing by itself about whether the claim is trustworthy or worth pursuing. It says what kind of evidence supports it and what specific result would strengthen it further.",
    whyCorrect:
      "Classifying QAOA's real-world performance as Tier 2, citing the general pattern (heuristics are a normal, valuable category, not a failure), and naming the specific missing result that would upgrade the tier is this lesson's checklist Question 4 in action.",
    whyWrong: [
      { optionId: "b", text: "Conflates 'unproven' with 'untrustworthy', discarding a real and well-evidenced result for failing a standard it never claimed to meet." },
      { optionId: "c", text: "Turns a tier into a prohibition. Classifying a claim as heuristic says what backs it, not that engineers should ignore it." },
      { optionId: "d", text: "Lets a narrow proof stand in for a broad one. The p=1, restricted-graph bound is proven; the general-depth performance claim is a different statement with different evidence." },
    ],
  },
};
