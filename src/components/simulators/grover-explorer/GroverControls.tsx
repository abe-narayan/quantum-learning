import { Button } from "@/components/ui/Button";
import { PresetToggle } from "@/components/visualizations/PresetToggle";

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
      <section aria-labelledby="grover-qubits-heading">
        <h3 id="grover-qubits-heading" className="text-sm font-semibold text-foreground">
          Search space size
        </h3>
        <PresetToggle
          options={QUBIT_OPTIONS}
          index={QUBIT_OPTIONS.findIndex((o) => o.n === numQubits)}
          onChange={(i) => onNumQubitsChange(QUBIT_OPTIONS[i].n)}
          ariaLabel="Number of qubits"
          disabled={disabled}
        />
        <p className="mt-1 text-xs text-muted-foreground">{numQubits} qubits, N={dimension} basis states. Changing this resets the search.</p>
      </section>

      <section aria-labelledby="grover-marked-heading">
        <h3 id="grover-marked-heading" className="text-sm font-semibold text-foreground">
          Marked item
        </h3>
        <select
          value={markedIndex}
          disabled={disabled}
          onChange={(e) => onMarkedIndexChange(Number(e.target.value))}
          className="mt-3 w-full rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {Array.from({ length: dimension }, (_, i) => (
            <option key={i} value={i}>
              |{i.toString(2).padStart(numQubits, "0")}⟩ (index {i})
            </option>
          ))}
        </select>
      </section>

      <section aria-labelledby="grover-run-heading">
        <h3 id="grover-run-heading" className="text-sm font-semibold text-foreground">
          Run
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Iteration {iteration}. Theoretical optimum for this N and 1 marked item: {optimalIteration}.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="primary" size="sm" disabled={disabled} onClick={onStep}>
            Step (oracle + diffusion)
          </Button>
          <Button variant="ghost" size="sm" disabled={disabled} onClick={onReset}>
            Reset
          </Button>
        </div>
      </section>
    </div>
  );
}
