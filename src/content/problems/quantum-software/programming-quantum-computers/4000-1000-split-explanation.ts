import type { ConceptualProblem } from "@/lib/problems/types";

export const fourThousandOneThousandSplitExplanation: ConceptualProblem = {
  meta: {
    slug: "4000-1000-split-explanation",
    title: "Is a 4000/1000 Split Shot Noise or Something Else?",
    course: "programming-quantum-computers",
    lesson: "quantum-software/programming-quantum-computers/writing-your-first-circuit",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["shot-noise", "conceptual"],
    prerequisites: ["quantum-software/programming-quantum-computers/writing-your-first-circuit"],
  },
  question: {
    type: "conceptual",
    prompt: "A GHZ-state experiment gives 4000 '000' counts and 1000 '111' counts out of 5000 shots (badly off from the expected ~50/50 split). Using the lesson's expected ±71-count range, explain whether this is plausibly shot noise alone.",
    placeholder: "The expected range from shot noise alone is roughly..., but the observed deviation is...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["71", "expected range", "shot noise alone"],
        missingFeedback:
          "Start with what random sampling alone can produce on this many shots. Quote the size of that expected wobble before you judge the data.",
      },
      {
        phrases: ["1500", "far outside", "not consistent", "something else"],
        missingFeedback:
          "You have the expected wobble. Now measure the actual deviation from the even split, compare the two numbers, and give a verdict.",
      },
    ],
    incorrectFeedback: "This is a numeric comparison, so do it numerically. Take the lesson's worked 95% window for a fair coin at 5000 shots, write down the observed departure from 2500, and put the two side by side. Then state what follows from the size of the gap between them.",
    partialFeedback: "Good. Now finish the comparison out loud: say how the observed departure compares with the window, and what that implies about whether counting statistics alone can account for it.",
    modelAnswers: [
      "No, this cannot be shot noise alone. The expected range from random sampling is about plus or minus 71 counts around 2500, but the observed deviation is 1500, which is far outside it. Something else is wrong, in the circuit or the hardware.",
      "Random sampling on 5000 shots gives roughly 71 counts of spread. A gap of 1500 from the expected split is not consistent with that at all, so there is a real error somewhere.",
    ],
  },
  hints: [
    { text: "The lesson's worked example found a 95% expected range of roughly ±71 counts around 2500 for a perfect 50/50 split at 5000 shots." },
    { text: "The observed split here is 4000/1000. Work out how far that is from the 2500/2500 a fair split would give." },
    { text: "Now compare the two figures you just wrote down, and say whether one plausibly sits inside the other." },
  ],
  solution: {
    steps: [
      { description: "The expected range from pure shot noise alone (at 5000 shots, ideal 50/50 probability) is roughly 2500±71, i.e. between about 2429 and 2571." },
      { description: "The observed 4000/1000 split deviates by 1500 counts from the expected 2500, far outside the ±71 range." },
      { description: "That deviation is not plausibly explained by shot noise alone. It indicates either a circuit-logic error, where the intended GHZ state was not prepared correctly, or a hardware or simulation bug, rather than ordinary statistical fluctuation." },
    ],
    finalAnswer: "The observed deviation of 1500 is far outside the expected shot-noise range of ±71, so this is not plausibly shot noise alone. It indicates a real error elsewhere, in circuit logic or in the hardware or simulation.",
  },
  explanation: {
    correctIdea: "This applies the lesson's own statistical reasoning to distinguish expected randomness from a real problem, a practical debugging skill.",
    whyCorrect: "Shot noise at 5000 draws has a standard deviation near 35 counts, which puts the 95% window at roughly ±71. A departure of 1500 is more than twenty windows out, a distance no unlucky sampling produces, so something upstream of the counting is wrong.",
    whyWrong: ["Assuming any deviation from a perfect split could be shot noise, without checking it against the actual expected statistical range, misses the whole point of having computed that range."],
  },
};
