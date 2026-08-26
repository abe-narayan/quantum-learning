import type { ConceptualProblem } from "@/lib/problems/types";

export const theoremVsHeuristicClassifySurfaceCodeThreshold: ConceptualProblem = {
  meta: {
    slug: "theorem-vs-heuristic-classify-surface-code-threshold",
    title: "Classifying the Surface Code's ~1% Threshold",
    course: "research-methods-and-synthesis",
    lesson: "apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic",
    difficulty: "master",
    estimatedMinutes: 8,
    problemType: "conceptual",
    tags: ["research-methods", "theorem-vs-heuristic", "surface-codes", "error-correction"],
    prerequisites: ["apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Fault Tolerance Frontiers' Decoding Surface Codes lesson states the surface code's threshold error rate p_th is 'cited in real work as roughly percent-level (commonly in the ballpark of ~1% for circuit-level noise with a strong decoder)', obtained by simulating real surface-code patches, while the underlying exponential-suppression scaling law p_L ~ A(p/p_th)^((d+1)/2) is tied to a genuine phase-transition argument (the Nishimori point of a random-bond Ising model). Using this lesson's four-question checklist, classify the specific numerical claim 'the surface code's threshold is approximately 1%.' Name the tier, explain why the cited phase-transition theory does NOT by itself make the specific 1% figure a proven theorem, and state what SPECIFIC additional result would be needed to upgrade it.",
    placeholder:
      "Separate two things: the proven shape of the suppression law, and the specific numerical value quoted for p_th. Which one is the theory result, and which one comes from simulation?",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["heuristic", "empirical", "numerical", "simulation-based", "well-supported heuristic"],
      ["decoder", "noise model", "depends on the decoder", "decoder- and noise-model-dependent", "specific to a decoder"],
      ["not a proven theorem", "not proven", "no proof of the exact value", "unproven exact value", "the specific number is not proven"],
      ["analytic derivation", "derive the exact threshold", "prove the exact value", "closed-form proof of p_th", "first principles derivation of the number"],
    ],
    incorrectFeedback:
      "Separate the two claims. The scaling law's SHAPE, p_L ~ A(p/p_th)^((d+1)/2), rests on real theory (a mapping to the random-bond Ising model's Nishimori point) -- but that theory proves the functional FORM of the suppression, not a specific numerical value of p_th for any given decoder and noise model. The ~1% figure itself comes from simulating real surface-code patches with a specific decoder and noise model, and the lesson is explicit that p_th is 'genuinely decoder- and noise-model-dependent... not a single universal constant.' That makes the specific 1% claim Tier 2 (heuristic/empirical), resting on but not equal to a proven theoretical scaling law. Upgrading it would need an analytic, first-principles derivation of the exact threshold value for a fully specified decoder and noise model, not just the already-proven shape of the suppression curve.",
    partialFeedback:
      "You're on the right track -- make sure you explicitly separate 'the scaling law's shape is proven theory' from 'the specific 1% number is a simulation-based estimate,' and name the specific analytic result that would be needed to promote the number itself to a theorem.",
  },
  hints: [
    {
      text: "The lesson on surface codes calls the p_th vs. p_L relationship a 'well-established empirical/theoretical relationship' -- that phrase is a hint that two different things are bundled together here.",
    },
    {
      text: "Ask separately: is the EXPONENT/shape of the suppression law proven? Is the specific 1% NUMBER proven? Do both questions have the same answer?",
    },
    {
      text: "Recall the lesson's Question 4: whatever tier a claim lands in, name the SPECIFIC additional result that would move it up -- not just 'more research.'",
    },
  ],
  solution: {
    steps: [
      {
        description:
          "The scaling law's shape, $p_L \\sim A(p/p_{th})^{(d+1)/2}$, is tied to a genuine, citable theoretical argument: mapping the decoding problem onto a random-bond Ising model, with $p_{th}$ corresponding to a phase transition at the Nishimori point (Dennis, Kitaev, Landahl & Preskill 2002).",
      },
      {
        description:
          "That theory proves the functional FORM of the exponential suppression -- it does not, by itself, pin down a specific numerical value of $p_{th}$ for any particular decoder and noise model.",
      },
      {
        description:
          "The specific $\\sim 1\\%$ figure comes from simulating and experimenting on real surface-code patches with a specific decoder and noise model -- numerical/simulation-based evidence, and the source lesson is explicit that $p_{th}$ is 'genuinely decoder- and noise-model-dependent... not a single universal constant.'",
      },
      {
        description:
          "Checklist Question 1 (complete proof of the specific value?) is no; Question 2 (strong numerical/simulation evidence?) is yes. Classification: Tier 2, heuristic/empirical.",
      },
      {
        description:
          "To upgrade the specific number to a theorem would require an analytic, first-principles derivation of the exact threshold value for a fully and explicitly specified decoder and noise model -- a much harder target than the already-proven shape of the suppression law.",
      },
    ],
    finalAnswer:
      "Tier 2, heuristic/empirical: the ~1% figure is a real, well-supported numerical/simulation-based estimate for a specific decoder and noise model, resting on (but not equal to) the proven theoretical shape of the exponential suppression law. It would need an analytic, first-principles derivation of the exact threshold value for a fully specified decoder and noise model to become a proven theorem.",
  },
  explanation: {
    correctIdea:
      "A real theoretical result about a claim's FUNCTIONAL FORM does not automatically make every specific NUMBER associated with that claim a proven theorem -- the two need to be checked separately.",
    whyCorrect:
      "This is exactly the checklist's Question 1 vs. Question 2 distinction applied carefully: the Nishimori-point argument is genuine, citable theory (satisfying part of Question 3's 'real theoretical basis' criterion for the scaling law's shape), while the specific ~1% number is squarely a Question-2 numerical/simulation result, decoder- and noise-model-dependent by the source lesson's own explicit statement.",
    whyWrong: [
      "Treating the cited Nishimori-point/phase-transition theory as proof of the specific 1% value conflates 'the shape of a law is proven' with 'every number appearing in that law is proven' -- a fully general theorem about the functional form says nothing about the specific constant for a specific decoder and noise model.",
      "Calling this a Conjecture rather than a Heuristic mismatches the checklist: there IS strong, direct numerical/simulation evidence here (Question 2 is satisfied), which is a stronger and different kind of support than the 'plausible, motivated argument with some evidence' that defines a Conjecture.",
    ],
  },
};
