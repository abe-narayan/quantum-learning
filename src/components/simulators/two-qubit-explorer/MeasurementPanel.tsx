import { Button } from "@/components/ui/Button";

export function MeasurementPanel({
  disabled,
  onMeasureQubit,
  onMeasureBoth,
  onReset,
}: {
  disabled: boolean;
  onMeasureQubit: (qubit: 0 | 1) => void;
  onMeasureBoth: () => void;
  onReset: () => void;
}) {
  return (
    <section aria-labelledby="measurement-heading" className="border-t border-border pt-6">
      <h3 id="measurement-heading" className="text-sm font-semibold text-foreground">
        Measurement
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Measuring collapses the state: randomly, weighted by the probabilities above, and irreversibly.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" disabled={disabled} onClick={() => onMeasureQubit(0)}>
          Measure q0
        </Button>
        <Button size="sm" disabled={disabled} onClick={() => onMeasureQubit(1)}>
          Measure q1
        </Button>
        <Button size="sm" disabled={disabled} onClick={onMeasureBoth}>
          Measure both
        </Button>
        <Button size="sm" variant="secondary" disabled={disabled} onClick={onReset}>
          Reset to |00⟩
        </Button>
      </div>
    </section>
  );
}
