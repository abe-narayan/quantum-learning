import { thermalPhotonOccupation } from "@/lib/quantum/thermalPhysics";
import type { NumericProblem } from "@/lib/problems/types";

const value = thermalPhotonOccupation(5e9, 0.05);

export const occupationAt50Mk: NumericProblem = {
  meta: {
    slug: "occupation-at-50mk",
    title: "Thermal Occupation for a 5 GHz Qubit at 50 mK",
    course: "control-and-readout",
    lesson: "quantum-hardware/control-and-readout/cryogenic-systems",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["cryogenics"],
    prerequisites: ["quantum-hardware/control-and-readout/cryogenic-systems"],
  },
  question: {
    type: "numeric",
    prompt: "Using n̄=1/(exp(ħω/k_BT)-1), what is the thermal photon occupation for a 5 GHz qubit at T=50 mK?",
    inputHint: "as a decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback: "This lies between the lesson's 15 mK (~10⁻⁷) and 100 mK (~0.10) values. Expect something in that range, nearer the 100 mK value since 50 mK is the warmer of the two.",
  },
  hints: [
    { text: "Use the same formula and constants as the lesson's table." },
    { text: "ħω/k_BT will be a moderately large number, giving a small but not negligible n̄." },
    { text: "Compare your answer to the lesson's 15 mK (~1.1×10⁻⁷) and 100 mK (~0.10) values. 50 mK should sit between them, though not linearly." },
  ],
  solution: {
    steps: [{ description: "Direct substitution into the Bose-Einstein formula with f=5 GHz, T=0.05K gives n̄≈0.0083." }],
    finalAnswer: "≈0.0083",
  },
  explanation: {
    correctIdea: "This shows 50 mK is comfortably in the 'safe' regime (n̄≪1), consistent with why many real dilution refrigerators target base temperatures well below 100mK.",
    whyCorrect: "At 5 GHz and 50 mK the exponent ħω/k_BT is about 4.8, so e^4.8 − 1 ≈ 120 and the occupation lands near 1/120. Well below one thermal quantum means the qubit really does sit in its ground state between operations. thermalPhotonOccupation(5e9, 0.05) returns the same figure.",
    whyWrong: ["An answer larger than the 100mK value (0.10) would be inconsistent with n̄ decreasing as temperature decreases."],
  },
};
