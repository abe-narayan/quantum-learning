import type { ConceptualProblem } from "@/lib/problems/types";

export const capstoneLandscapeTimelinePredictionEvaluation: ConceptualProblem = {
  meta: {
    slug: "capstone-landscape-timeline-prediction-evaluation",
    title: "Evaluating a Confident Quantum Computing Timeline Claim",
    course: "research-methods-and-synthesis",
    lesson: "apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today",
    difficulty: "advanced",
    estimatedMinutes: 10,
    problemType: "conceptual",
    tags: ["state-of-the-field", "timelines", "claim-evaluation", "synthesis", "calibration"],
    prerequisites: [
      "apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    ],
  },
  question: {
    type: "conceptual",
    prompt:
      "An op-ed states: 'Experts broadly agree that quantum computers capable of breaking RSA-2048 encryption will exist within the next five years.' Explain why this capstone's calibrated-uncertainty stance treats a confident timeline claim like this one with essentially the same skepticism it applies to an unverified quantum-advantage claim, and state specifically what you would need to know about the basis for this prediction before treating it as anything more than one disputed projection among many.",
    placeholder:
      "Is 'five years' a proven theorem, a conjecture with named evidence, or something else entirely -- what kind of claim IS a timeline prediction? What would the prediction have to be resting on (a resource estimate? an extrapolated trend? a company roadmap?) for it to carry real weight?",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["track record", "historically", "repeatedly wrong", "poor track record", "overconfident predictions", "consistently wrong"],
      ["roadmap", "engineering target", "not a theorem", "not proven", "aspirational goal", "internal target", "not evidence"],
      ["resource estimate", "assumptions", "error rate assumptions", "qubit count needed", "what basis", "extrapolation", "magic state", "code distance"],
    ],
    incorrectFeedback:
      "A timeline prediction is not a proven theorem, and it is not even a strongly-evidenced conjecture in the sense this platform's three-tier framework uses that term -- it is a forecast about future engineering execution, resting on assumptions (achievable error rates, qubit-count scaling, decoder throughput, funding, and unforeseen obstacles) that are themselves uncertain and often extrapolated well beyond anything actually demonstrated. This field's own history of confident timeline predictions -- in both the optimistic and pessimistic direction -- has a genuinely poor track record, which is exactly why this capstone declines to offer one of its own. Before treating a claim like this as more than one disputed projection, you would need to know: what resource estimate (if any) it is based on, including whether that estimate accounts for magic-state distillation, routing overhead, and code distance the way Fault Tolerance Frontiers' own capstone did; whether it is describing a company's internal roadmap TARGET (an engineering goal, not a proven or even empirically-confirmed result) versus an independent projection; and what specifically has already been demonstrated versus merely assumed to scale on schedule.",
    partialFeedback:
      "You're getting at part of it -- be explicit that a timeline claim is a different KIND of statement than a theorem or a conjecture (it's a forecast about future engineering execution), and name at least one concrete thing you'd want to check (the resource-estimate assumptions behind it, or whether it's a roadmap target being presented as a settled prediction).",
  },
  hints: [
    { text: "Is 'five years' a mathematical theorem, an empirically-evidenced conjecture, or a genuinely different kind of claim altogether?" },
    { text: "Recall Fault Tolerance Frontiers' own resource-estimation capstone: what specific, checkable assumptions did a physical-qubit estimate depend on?" },
    { text: "A company's roadmap target and an independent, evidence-based forecast are not the same kind of statement -- which one is this claim, and how would you tell?" },
  ],
  solution: {
    steps: [
      { description: "A timeline prediction is not the same kind of statement as a proven theorem or even a strongly-evidenced conjecture; it is a forecast about future engineering execution, which depends on many uncertain, compounding factors (achievable physical error rates at scale, qubit-count scaling, decoder throughput, funding, and unforeseen technical obstacles)." },
      { description: "This field's history of confident timeline predictions, in both directions, has a genuinely poor track record -- which is precisely why this capstone declines to offer a specific one and instead treats the honest uncertainty itself as the thing to understand." },
      { description: "A rigorous resource estimate (like Fault Tolerance Frontiers' own capstone) can tell you how many physical qubits, at what code distance and error rate, a given algorithm needs -- but translating that into a calendar date additionally requires assuming a rate of hardware improvement that has not itself been proven or even given the same kind of evidence as, say, Shor's algorithm's classical intractability assumption." },
      { description: "Before accepting a timeline claim, check: what resource estimate (if any) underlies it, and does that estimate honestly account for magic-state distillation, routing/connectivity overhead, and code distance; whether the claim is actually a company's internal roadmap target (an engineering goal) being reported as if it were an independent, evidence-based forecast; and what has actually been demonstrated versus merely assumed to continue scaling on schedule." },
    ],
    finalAnswer:
      "A timeline prediction is a forecast about future engineering execution, not a theorem or an evidenced conjecture, and this field's track record of such predictions is genuinely poor in both directions. Before treating one as more than a disputed projection, check what resource estimate it rests on (and whether that estimate honestly accounts for magic-state distillation, routing overhead, and code distance), whether it's really a roadmap target being presented as a forecast, and what has actually been demonstrated versus merely assumed to scale on schedule.",
  },
  explanation: {
    correctIdea:
      "A confident timeline claim deserves the same 'what is this actually resting on' scrutiny as any other quantum-computing claim, precisely because it is not a proven or even strongly-evidenced statement in this platform's own sense of those terms -- it is a forecast, and forecasts in this field have a documented history of being wrong.",
    whyCorrect:
      "This generalizes the exact skepticism this capstone applies to hardware and advantage claims to a timeline claim: identify what kind of statement it is, name what it would need to rest on to carry weight, and decline to treat confident phrasing as a substitute for that evidence.",
    whyWrong: [
      "Accepting 'experts broadly agree' at face value treats consensus framing as if it were proof or strong evidence, without checking what the consensus (if real) is actually based on.",
      "Dismissing all timeline discussion as worthless overcorrects -- a resource estimate with honestly stated assumptions is genuinely useful information; what's unwarranted is converting it into a confident calendar date without stating the extrapolation that step requires.",
    ],
  },
};
