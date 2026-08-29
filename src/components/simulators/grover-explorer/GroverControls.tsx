import { Button } from "@/components/ui/Button";
import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { ControlSection, SymbolGloss } from "../shared/controls";

const QUBIT_OPTIONS = [2, 3, 4].map((n) => ({ n, label: `N=${2 ** n}` }));

export function GroverControls({
  numQubits,
  onNumQubitsChange,
  markedIndex,
  onMarkedIndexChange,
  iteration,
  optimalIteration,
  onStep,
  onReset,
  disabled,
}: {
  numQubits: number;
  onNumQubitsChange: (n: number) => void;
  markedIndex: number;
  onMarkedIndexChange: (i: number) => void;
  iteration: number;
  optimalIteration: number;
  onStep: () => void;
  onReset: () => void;
  disabled: boolean;
}) {
  const dimension = 2 ** numQubits;

  return (
    <div className="space-y-8">
      <ControlSection
        id="grover-qubits"
        title="Search space size"
        description={`How many items the search is over: ${numQubits} qubits hold N=${dimension} of them. Changing this restarts the search.`}
      >
        <PresetToggle
          options={QUBIT_OPTIONS}
          index={QUBIT_OPTIONS.findIndex((o) => o.n === numQubits)}
          onChange={(i) => onNumQubitsChange(QUBIT_OPTIONS[i].n)}
          ariaLabel="Number of qubits"
          disabled={disabled}
        />
        <SymbolGloss
          items={[
            {
              symbol: "N",
              name: "search space size",
              means: `the number of items you're searching, N = 2 to the power of the qubit count. ${numQubits} qubits index ${dimension} items — one bar each in the chart.`,
            },
          ]}
        />
      </ControlSection>

      <ControlSection
        id="grover-marked"
        title="Marked item"
        description="The one item the black box says yes to — the needle. Pick a different one and the tall bar moves with it."
      >
        <select
          value={markedIndex}
          disabled={disabled}
          aria-label="Marked item — the one item the oracle recognizes"
          onChange={(e) => onMarkedIndexChange(Number(e.target.value))}
          className={
            // text-base below sm keeps the effective font size at 16px on
            // phones — iOS Safari auto-zooms the page on focusing any form
            // control whose font is smaller than that.
            "min-h-11 w-full rounded-(--radius-tight) border border-border bg-surface px-2 py-1.5 font-mono text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-sm"
          }
        >
          {Array.from({ length: dimension }, (_, i) => (
            <option key={i} value={i}>
              |{i.toString(2).padStart(numQubits, "0")}⟩ (index {i})
            </option>
          ))}
        </select>
      </ControlSection>

      <ControlSection
        id="grover-run"
        title="Run"
        description={`Currently at round ${iteration}. The best number of rounds for N=${dimension} with one marked item is ${optimalIteration} — past that, success probability falls again.`}
      >
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm" disabled={disabled} onClick={onStep}>
            Step (oracle + diffusion)
          </Button>
          <Button variant="ghost" size="sm" disabled={disabled} onClick={onReset}>
            Reset to round 0
          </Button>
        </div>
        <SymbolGloss
          items={[
            {
              symbol: "1.",
              name: "oracle",
              means:
                "the black box that recognizes the item you want. It doesn't reveal it — it just flips the sign of that one item's amplitude, leaving every probability unchanged.",
              glossaryId: "oracle",
            },
            {
              symbol: "2.",
              name: "diffusion",
              means:
                "the step that turns that invisible sign flip into a visible height difference, by reflecting every amplitude about their average. Oracle plus diffusion is one round.",
            },
          ]}
        />
      </ControlSection>
    </div>
  );
}
