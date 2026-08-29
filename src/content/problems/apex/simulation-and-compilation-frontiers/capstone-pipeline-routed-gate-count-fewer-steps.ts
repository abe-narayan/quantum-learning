import type { NumericProblem } from "@/lib/problems/types";

const rawTwoQubitGatesPerStep = 50;
const rawTGatesPerStep = 30;
const trotterSteps = 15;
const swapOverheadMultiplier = 2.5;

const totalTwoQubitGates = rawTwoQubitGatesPerStep * trotterSteps;
const totalTGates = rawTGatesPerStep * trotterSteps;
const routedTwoQubitGates = totalTwoQubitGates * swapOverheadMultiplier;
const value = routedTwoQubitGates + totalTGates;

export const capstonePipelineRoutedGateCountFewerSteps: NumericProblem = {
  meta: {
    slug: "capstone-pipeline-routed-gate-count-fewer-steps",
    title: "Routed Gate Count With Fewer Trotter Steps",
    course: "simulation-and-compilation-frontiers",
    lesson: "apex/simulation-and-compilation-frontiers/capstone-from-algorithm-to-qubit-count",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["trotterization", "t-count", "routing-overhead", "compilation-pipeline"],
    prerequisites: ["apex/simulation-and-compilation-frontiers/capstone-from-algorithm-to-qubit-count"],
  },
  question: {
    type: "numeric",
    prompt:
      "The capstone's toy circuit used 50 two-qubit gates and 30 T gates per Trotter step, run for 20 steps, then applied a 2.5x SWAP-overhead multiplier to the two-qubit gate count only (T gates are single-qubit and unaffected by routing). Suppose the same per-step counts were run for only 15 Trotter steps instead of 20. What would the routed total gate count (routed two-qubit gates plus T-count) be?",
    inputHint: "an integer gate count",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.5,
    incorrectFeedback:
      "First scale both gate types by 15 steps (not 20): two-qubit gates = 50x15 = 750, T gates = 30x15 = 450. Then apply the 2.5x routing multiplier to the two-qubit count only: 750x2.5 = 1875. Add the untouched T-count: 1875 + 450.",
    nearMisses: [
      {
        value: (rawTwoQubitGatesPerStep * 20 * swapOverheadMultiplier) + rawTGatesPerStep * 20,
        feedback: "That is the capstone's own 20-step total. This question shortens the circuit to 15 Trotter steps, so both per-step counts scale by 15.",
      },
      {
        value: (totalTwoQubitGates + totalTGates) * swapOverheadMultiplier,
        feedback:
          "You applied the routing multiplier to the whole circuit. T gates are single-qubit: they never need a SWAP to reach a neighbour, so routing leaves the T-count alone.",
      },
      {
        value: totalTwoQubitGates + totalTGates,
        feedback: "That is the raw gate count before Stage 3. The two-qubit gates still have to absorb the 2.5x SWAP overhead.",
      },
      {
        value: routedTwoQubitGates,
        feedback: "That is the routed two-qubit count alone. The question asks for the total, so the T-count still has to be added.",
      },
    ],
  },
  hints: [
    { text: "Stage 2 of the capstone scales each per-step count by the number of Trotter steps: two-qubit gates = 50 x steps, T gates = 30 x steps." },
    { text: "Stage 3 applies the 2.5x SWAP-overhead multiplier to the two-qubit gate count only -- never to the T-count, since T gates are single-qubit and need no routing." },
    { text: "Add the two stages' outputs: the routed two-qubit count and the untouched T-count. Sanity check the result against the capstone's own 20-step total of 3100, which this shortened circuit should come in below." },
  ],
  solution: {
    steps: [
      { description: "Scale each per-step count by 15 Trotter steps: two-qubit gates = 50x15 = 750; T gates = 30x15 = 450 (this is the lesson's Stage 2, a plain multiplication)." },
      { description: "Apply the Stage 3 routing multiplier (2.5x) to the two-qubit gate count only: 750x2.5 = 1875 routed two-qubit gates. The T-count is untouched by routing, since T gates act on a single qubit and never need a SWAP to reach a neighbor." },
      { description: "Routed total gate count = 1875 + 450 = 2325, the quantity that would feed into Stage 4's error-budget calculation as N_T + N_2 for this shortened circuit." },
    ],
    finalAnswer: "2325 gates (1875 routed two-qubit gates + 450 T gates)",
  },
  explanation: {
    correctIdea:
      "Trotter-step scaling (Stage 2) and routing overhead (Stage 3) are two separate multiplications applied to two different quantities -- step count scales both gate types, but the SWAP-overhead multiplier applies only to the two-qubit gate count.",
    whyCorrect:
      "This mirrors exactly how the capstone computed its own 20-step numbers (1000 raw two-qubit gates -> 2500 routed, 600 T gates untouched, 3100 total), just re-run at 15 steps instead of 20.",
    whyWrong: [
      "Applying the 2.5x multiplier to the T-count, or to the raw total gate count, would incorrectly inflate a quantity that routing overhead never touches.",
      "Forgetting to rescale the per-step counts by 15 (instead of reusing the lesson's own 20-step totals) would answer a different question than the one asked.",
    ],
  },
};
