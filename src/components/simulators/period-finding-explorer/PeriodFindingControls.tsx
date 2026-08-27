import { Button } from "@/components/ui/Button";
import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { ControlSection, SymbolGloss } from "../shared/controls";

const N_PRESETS = [15, 21, 35];
const X_BITS_OPTIONS = [4, 5, 6, 7];
const N_TOGGLE_OPTIONS = N_PRESETS.map((n) => ({ n, label: String(n) }));
const X_BITS_TOGGLE_OPTIONS = X_BITS_OPTIONS.map((bits) => ({ bits, label: String(bits) }));

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** Every integer a with 1 < a < N and gcd(a, N) = 1 — the valid bases for order-finding mod N. */
export function coprimeBases(N: number): number[] {
  const bases: number[] = [];
  for (let a = 2; a < N; a++) {
    if (gcd(a, N) === 1) bases.push(a);
  }
  return bases;
}

export { N_PRESETS, X_BITS_OPTIONS };

export function PeriodFindingControls({
  N,
  onNChange,
  a,
  onAChange,
  validBases,
  xBits,
  onXBitsChange,
  onReset,
}: {
  N: number;
  onNChange: (n: number) => void;
  a: number;
  onAChange: (a: number) => void;
  validBases: number[];
  xBits: number;
  onXBitsChange: (bits: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-8">
      <ControlSection
        id="pf-n"
        title="N — the number to factor"
        description="Changing N picks a fresh set of valid bases a."
      >
        <PresetToggle
          options={N_TOGGLE_OPTIONS}
          index={N_TOGGLE_OPTIONS.findIndex((o) => o.n === N)}
          onChange={(i) => onNChange(N_TOGGLE_OPTIONS[i].n)}
          ariaLabel="N"
        />
      </ControlSection>

      <ControlSection
        id="pf-a"
        title="a — the number you repeatedly multiply by"
        description="Any a sharing no factor with N will do. Every value listed is checked for that directly, not curated by hand."
      >
        <select
          value={a}
          aria-label="a — the base you repeatedly multiply by, mod N"
          onChange={(e) => onAChange(Number(e.target.value))}
          className="min-h-11 w-full rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {validBases.map((base) => (
            <option key={base} value={base}>
              a = {base}
            </option>
          ))}
        </select>
        <SymbolGloss
          items={[
            {
              symbol: "r",
              name: "the period (order)",
              means:
                "how many times you have to multiply by a before the remainders start repeating. Find r and simple arithmetic hands you N's factors — that's Shor's algorithm in one line.",
            },
            {
              symbol: "gcd",
              name: "greatest common divisor",
              means:
                "the largest number dividing both a and N. gcd(a, N) = 1 means they share no factors, which is the only condition a has to satisfy here.",
            },
          ]}
        />
      </ControlSection>

      <ControlSection
        id="pf-t"
        title="t — how precisely to measure"
        description="Counting qubits. Each one you add doubles the number of possible readouts, which sharpens the peaks — and doubles the work for a real machine."
      >
        <PresetToggle
          options={X_BITS_TOGGLE_OPTIONS}
          index={X_BITS_TOGGLE_OPTIONS.findIndex((o) => o.bits === xBits)}
          onChange={(i) => onXBitsChange(X_BITS_TOGGLE_OPTIONS[i].bits)}
          ariaLabel="Counting qubits"
        />
        <SymbolGloss
          items={[
            {
              symbol: "t",
              name: "counting qubits",
              means: `the size of the register you read out: t = ${xBits} gives 2^${xBits} = ${2 ** xBits} possible answers, one per bar in the chart.`,
              glossaryId: "quantum-phase-estimation-precision",
            },
          ]}
        />
      </ControlSection>

      <Button variant="secondary" size="sm" onClick={onReset}>
        Reset to N=15, a=7
      </Button>
    </div>
  );
}
