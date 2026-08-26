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
        text: "Being an empirically-supported heuristic rather than a proven theorem doesn't make a result untrustworthy or unscientific -- heuristic algorithms with strong numerical support are common and valuable throughout computer science (e.g. simulated annealing, many practical SAT solvers), and QAOA's status is exactly this well-established heuristic category. What would change its tier is a specific missing result (a proof of a matching worst-case approximation-ratio bound at general depth for practically relevant instance classes), not a sign the existing work is unsound.",
      },
      {
        id: "b",
        text: "The colleague is right: without a general proof, QAOA's reported performance should be dismissed as unreliable until a full theorem is available.",
      },
      {
        id: "c",
        text: "QAOA is actually already a proven theorem for general large instances; the colleague is simply mistaken that it lacks a proof.",
      },
      {
        id: "d",
        text: "Since Grover's algorithm already has a proven guarantee, QAOA research on Max-Cut is redundant and should be redirected toward search problems instead.",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This commits exactly the error this lesson's second Common Mistakes callout warns against: treating 'not yet proven' as equivalent to 'not worth trusting.' A heuristic with strong numerical support across many instances is a normal, valuable category of result -- QAOA's own restricted p=1 case even carries a genuine proven guarantee on a specific graph class, which a wholesale dismissal ignores entirely.",
      c: "This is factually backwards. This platform's own QAOA lessons are explicit that general large-instance performance is an open, actively studied question, not a settled theorem -- only a narrow p=1, restricted-graph-class bound is actually proven.",
      d: "This misunderstands why QAOA is studied at all: Grover's proven optimality is a black-box search result and says nothing about combinatorial optimization's approximation-ratio landscape. The two are not competing for the same claim, so one being proven gives no reason to abandon research on the other.",
    },
    defaultIncorrectFeedback:
      "Recall the lesson's central point about QAOA: an unproven general performance claim, backed by strong numerical/simulation evidence, is a Heuristic in good standing -- not a failure of rigor. Ask what SPECIFIC missing result would move it to Theorem status, rather than treating 'unproven' as 'untrustworthy.'",
  },
  hints: [
    { text: "This lesson explicitly warns against two opposite mistakes: reporting a heuristic as a theorem, and dismissing a heuristic as worthless because it isn't one. Which mistake is the colleague making?" },
    { text: "Recall real classical examples of trusted heuristics with no general worst-case proof -- simulated annealing, many practical SAT solvers -- and where QAOA sits relative to them." },
    { text: "The correct answer should name the SPECIFIC result that would upgrade QAOA's status, rather than either dismissing it or claiming it's already proven." },
  ],
  solution: {
    steps: [
      { description: "QAOA's general, large-instance Max-Cut performance is Tier 2 (heuristic/empirical): strong numerical support, no matching general proof -- exactly the epistemic category of classical heuristics like simulated annealing." },
      { description: "Tier 2 is not a lesser or unscientific category; it is one of the most common and useful categories in all of computer science." },
      { description: "The precise, checklist-driven response names the specific missing result (a general worst-case approximation-ratio proof for practically relevant instance classes) rather than dismissing the existing heuristic evidence as untrustworthy." },
    ],
    finalAnswer: "(a)",
  },
  explanation: {
    correctIdea:
      "A claim's tier (theorem vs. heuristic) says nothing by itself about whether the claim is trustworthy or worth pursuing -- it says what KIND of evidence supports it and what SPECIFIC result would strengthen it further.",
    whyCorrect:
      "Option (a) correctly classifies QAOA's real-world performance as Tier 2, correctly cites the general pattern (heuristics are a normal, valuable category, not a failure), and correctly names the specific missing result needed to upgrade the tier -- exactly this lesson's checklist Question 4 in action.",
    whyWrong: [
      "(b) conflates 'unproven' with 'untrustworthy,' the exact mirror-image mistake this lesson's Common Mistakes section flags.",
      "(c) misstates what this platform's own QAOA content actually established -- two small worked examples and an explicit statement that general performance is an open, actively studied question, not a proof.",
      "(d) misunderstands that Grover's optimality (black-box search) and QAOA's approximation ratio (combinatorial optimization) are unrelated claims about different problems, so one being proven has no bearing on whether the other is worth studying.",
    ],
  },
};
