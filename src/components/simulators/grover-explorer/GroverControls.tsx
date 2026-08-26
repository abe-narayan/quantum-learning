import { Button } from "@/components/ui/Button";
import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { ControlSection } from "../shared/controls";

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
        description={`${numQubits} qubits, N=${dimension} basis states. Changing this resets the search.`}
      >
        <PresetToggle
          options={QUBIT_OPTIONS}
          index={QUBIT_OPTIONS.findIndex((o) => o.n === numQubits)}
          onChange={(i) => onNumQubitsChange(QUBIT_OPTIONS[i].n)}
          ariaLabel="Number of qubits"
          disabled={disabled}
        />
      </ControlSection>

      <ControlSection id="grover-marked" title="Marked item">
        <select
          value={markedIndex}
          disabled={disabled}
          onChange={(e) => onMarkedIndexChange(Number(e.target.value))}
          className="w-full rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
        description={`Iteration ${iteration}. Theoretical optimum for this N and 1 marked item: ${optimalIteration}.`}
      >
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm" disabled={disabled} onClick={onStep}>
            Step (oracle + diffusion)
          </Button>
          <Button variant="ghost" size="sm" disabled={disabled} onClick={onReset}>
            Reset
          </Button>
        </div>
      </ControlSection>
    </div>
  );
}
