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
      "Fault Tolerance Frontiers' Decoding Surface Codes lesson states the surface code's threshold error rate p_th is 'cited in real work as roughly percent-level (commonly in the ballpark of ~1% for circuit-level noise with a strong decoder)', obtained by simulating real surface-code patches, while the underlying exponential-suppression scaling law p_L ~ A(p/p_th)^((d+1)/2) is tied to a genuine phase-transition argument (the Nishimori point of a random-bond Ising model). Using this lesson's four-question checklist, classify the specific numerical claim 'the surface code's threshold is approximately 1%'. Name the tier, explain why the cited phase-transition theory does not by itself make the 1% figure a proven theorem, and name the specific additional result that would be needed to upgrade it.",
    placeholder:
      "Separate two things: the proven shape of the suppression law, and the specific numerical value quoted for p_th. Which one is the theory result, and which one comes from simulation?",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["heuristic", "empirical", "numerical", "simulation-based", "well-supported heuristic"],
        missingFeedback:
          "You have said what the number is not. Now name what kind of result it actually is, given how it was obtained.",
      },
      {
        phrases: ["decoder", "noise model", "depends on the decoder", "decoder- and noise-model-dependent", "specific to a decoder"],
        missingFeedback:
          "A threshold figure is not a constant of nature. Say what the quoted number is measured relative to, because that is why it moves.",
      },
      {
        phrases: ["not a proven theorem", "not proven", "no proof of the exact value", "unproven exact value", "the specific number is not proven"],
        missingFeedback:
          "You have said how the figure was obtained and what it depends on. Now say the classification out loud: is the exact value established in the way a theorem is?",
      },
      {
        phrases: [
          "analytic derivation",
          "analytic",
          "analytical",
          "closed form",
          "closed-form",
          "first principles",
          "first-principles",
          "derive the exact threshold",
          "derive the threshold",
          "derive p_th",
          "prove the exact value",
          "rigorous derivation",
        ],
        missingFeedback:
          "The classification is right. Question 4 of the checklist is still unanswered: name the specific result that would move the number up a tier. More runs of the same kind will not do it, and neither will the already-settled shape of the suppression law. Say what kind of argument would.",
      },
    ],
    incorrectFeedback:
      "Two claims are bundled together here and they do not carry the same weight. The shape of the suppression law rests on real theory (a mapping to the random-bond Ising model's Nishimori point), and that theory fixes the functional form. The number 1% does not come from that theory at all; it comes from running real patches with one particular error model and one particular matching algorithm, and the lesson says outright that it shifts when either of those changes. Grading the whole sentence at a single tier is the error. Say which half is which, and name the specific result that would raise the number's tier, in place of 'more research'.",
    partialFeedback:
      "Separate the two claims bundled in this sentence. One of them is fixed by theory; the other is a measured number that moves when the error model or the matching algorithm changes. Then name the specific result that would raise the second one's tier.",
    modelAnswers: [
      "Tier 2. The 1% is an empirical number from simulating surface code patches, and it depends on the decoder and the noise model you simulated, so it is not a proven theorem even though the suppression law's shape is real theory. To upgrade it you would need an analytic, first-principles derivation of the exact threshold for a fully specified decoder.",
      "It is a well-supported heuristic. The phase-transition argument fixes the functional form, not the specific number; the number is simulation-based and specific to a decoder and noise model, so the specific number is not proven. A closed-form derivation of the exact threshold value would be needed.",
    ],
  },
  hints: [
    {
      text: "The lesson on surface codes calls the p_th vs. p_L relationship a 'well-established empirical/theoretical relationship'. That phrase hints that two different things are bundled together here.",
    },
    {
      text: "Ask separately whether the exponent and shape of the suppression law are proven, and whether the 1% number is proven. Do both questions have the same answer?",
    },
    {
      text: "Recall the lesson's Question 4: whatever tier a claim lands in, name the specific additional result that would move it up, not just 'more research'.",
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
          "That theory proves the functional form of the exponential suppression. It does not, by itself, pin down a numerical value of $p_{th}$ for any particular decoder and noise model.",
      },
      {
        description:
          "The $\\sim 1\\%$ figure comes from simulating and experimenting on real surface-code patches with a specific decoder and noise model. That is numerical, simulation-based evidence, and the source lesson is explicit that $p_{th}$ is 'genuinely decoder- and noise-model-dependent... not a single universal constant'.",
      },
      {
        description:
          "Checklist Question 1 (complete proof of the specific value?) is no; Question 2 (strong numerical/simulation evidence?) is yes. Classification: Tier 2, heuristic/empirical.",
      },
      {
        description:
          "To upgrade the number to a theorem would require an analytic, first-principles derivation of the exact threshold value for a fully and explicitly specified decoder and noise model. That is a much harder target than the already-proven shape of the suppression law.",
      },
    ],
    finalAnswer:
      "Tier 2, heuristic/empirical: the ~1% figure is a real, well-supported numerical/simulation-based estimate for a specific decoder and noise model, resting on (but not equal to) the proven theoretical shape of the exponential suppression law. It would need an analytic, first-principles derivation of the exact threshold value for a fully specified decoder and noise model to become a proven theorem.",
  },
  explanation: {
    correctIdea:
      "A real theoretical result about a claim's functional form does not automatically make every number associated with that claim a proven theorem. The two have to be checked separately.",
    whyCorrect:
      "This is the checklist's Question 1 versus Question 2 distinction applied carefully. The Nishimori-point argument is genuine, citable theory (satisfying part of Question 3's 'real theoretical basis' criterion for the scaling law's shape), while the ~1% number is squarely a Question-2 numerical result, decoder- and noise-model-dependent by the source lesson's own statement.",
    whyWrong: [
      "Treating the cited Nishimori-point/phase-transition theory as proof of the 1% value conflates 'the shape of a law is proven' with 'every number appearing in that law is proven'. A general theorem about the functional form says nothing about the constant for a specific decoder and noise model.",
      "Calling this a Conjecture rather than a Heuristic mismatches the checklist. There is strong, direct numerical evidence here, so Question 2 is satisfied, and that is a different and stronger kind of support than the 'plausible, motivated argument with some evidence' that defines a Conjecture.",
    ],
  },
};
