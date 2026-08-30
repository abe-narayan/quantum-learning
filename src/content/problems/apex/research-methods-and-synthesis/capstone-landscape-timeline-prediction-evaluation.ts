import type { ConceptualProblem } from "@/lib/problems/types";

export const capstoneLandscapeTimelinePredictionEvaluation: ConceptualProblem = {
  meta: {
    slug: "capstone-landscape-timeline-prediction-evaluation",
    title: "Evaluating a Confident Quantum Computing Timeline Claim",
    course: "research-methods-and-synthesis",
    lesson: "apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today",
    difficulty: "master",
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
      "Is 'five years' a proven theorem, a conjecture with named evidence, or something else entirely? What kind of claim is a timeline prediction? What would it have to be resting on (a resource estimate? an extrapolated trend? a company roadmap?) to carry real weight?",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: [
          "track record",
          "historically",
          "history of",
          "past predictions",
          "previous predictions",
          "repeatedly wrong",
          "been wrong",
          "wrong before",
          "poor track record",
          "overconfident predictions",
          "consistently wrong",
        ],
        missingFeedback:
          "You have said what kind of claim a timeline is and what you would check. One piece is still missing: this field's own record of confident timeline predictions, in both the optimistic and the pessimistic direction, is poor, which is the empirical reason to discount the confident phrasing rather than only the logical one.",
      },
      {
        phrases: ["roadmap", "engineering target", "not a theorem", "not proven", "aspirational goal", "internal target", "not evidence"],
        missingFeedback:
          "You have called the field's forecasting record into question. Now classify the claim itself: what kind of statement is a date, and what is it if it began life as one company's internal plan?",
      },
      {
        phrases: ["resource estimate", "assumptions", "error rate assumptions", "qubit count needed", "what basis", "extrapolation", "magic state", "code distance"],
        missingFeedback:
          "You have classified the claim. Now say what you would actually ask for before crediting it, in terms of the numbers such a forecast has to be built on.",
      },
    ],
    incorrectFeedback:
      "A date is a different kind of statement from a theorem or from an evidenced conjecture, and the three-tier framework has no slot for it: it is a forecast about future engineering execution. The error is to grade such a claim by the confidence of its phrasing instead of by what sits underneath it. Two questions get skipped. What calculation, if any, did the number come out of, and does that calculation account for the overheads this course spent two lessons on? And who is making the claim, since an internal delivery goal and an independent forecast are different objects even when they carry the same date. A third thing to weigh is how confidently-dated claims in this field have fared before, in both directions.",
    partialFeedback:
      "Part of it is there. Three separate moves are needed: say what kind of claim a date actually is, name one concrete thing you would ask to see before treating it as more than one person's projection, and say what this field's own record of confident dates should do to your prior.",
    modelAnswers: [
      "A five-year date is not a theorem and not even an evidenced conjecture; it is a forecast about engineering execution, and this field's track record on such forecasts is bad in both directions. Before I credited it I would want the resource estimate it rests on, including magic state distillation and code distance assumptions, and I would want to know whether it is really a company roadmap target being reported as a prediction.",
      "Historically these predictions have been wrong repeatedly. The claim is not proven, and an internal roadmap is an engineering target, not evidence. I would ask what basis it has: which resource estimate, what error rate assumptions, and what qubit count needed for RSA-2048.",
    ],
  },
  hints: [
    { text: "Is 'five years' a mathematical theorem, an empirically-evidenced conjecture, or a genuinely different kind of claim altogether?" },
    { text: "Recall Fault Tolerance Frontiers' own resource-estimation capstone: what specific, checkable assumptions did a physical-qubit estimate depend on?" },
    { text: "A company's roadmap target and an independent, evidence-based forecast are not the same kind of statement. Which one is this claim, and how would you tell?" },
  ],
  solution: {
    steps: [
      { description: "A timeline prediction is not the same kind of statement as a proven theorem or even a strongly-evidenced conjecture; it is a forecast about future engineering execution, which depends on many uncertain, compounding factors (achievable physical error rates at scale, qubit-count scaling, decoder throughput, funding, and unforeseen technical obstacles)." },
      { description: "This field's history of confident timeline predictions, in both directions, has a poor track record. That is why this capstone declines to offer a specific one and instead treats the honest uncertainty itself as the thing to understand." },
      { description: "A rigorous resource estimate (like Fault Tolerance Frontiers' own capstone) can tell you how many physical qubits, at what code distance and error rate, a given algorithm needs. Translating that into a calendar date additionally requires assuming a rate of hardware improvement that has not itself been proven, or even given the same kind of evidence as, say, Shor's algorithm's classical intractability assumption." },
      { description: "Before accepting a timeline claim, check: what resource estimate (if any) underlies it, and does that estimate honestly account for magic-state distillation, routing/connectivity overhead, and code distance; whether the claim is actually a company's internal roadmap target (an engineering goal) being reported as if it were an independent, evidence-based forecast; and what has actually been demonstrated versus merely assumed to continue scaling on schedule." },
    ],
    finalAnswer:
      "A timeline prediction is a forecast about future engineering execution, not a theorem or an evidenced conjecture, and this field's track record of such predictions is genuinely poor in both directions. Before treating one as more than a disputed projection, check what resource estimate it rests on (and whether that estimate honestly accounts for magic-state distillation, routing overhead, and code distance), whether it's really a roadmap target being presented as a forecast, and what has actually been demonstrated versus merely assumed to scale on schedule.",
  },
  explanation: {
    correctIdea:
      "A confident timeline claim deserves the same 'what is this resting on' scrutiny as any other quantum-computing claim, because it is not a proven or even strongly-evidenced statement in the sense those terms carry here. It is a forecast, and forecasts in this field have a documented history of being wrong.",
    whyCorrect:
      "This extends to a timeline claim the same skepticism this capstone applies to hardware and advantage claims: identify what kind of statement it is, name what it would need to rest on to carry weight, and decline to treat confident phrasing as a substitute for that evidence.",
    whyWrong: [
      "Accepting 'experts broadly agree' at face value treats consensus framing as if it were proof or strong evidence, without checking what the consensus (if real) is based on.",
      "Dismissing all timeline discussion as worthless overcorrects. A resource estimate with honestly stated assumptions is useful information; what is unwarranted is converting it into a confident calendar date without stating the extrapolation that step requires.",
    ],
  },
};
