import { PresetToggle } from "@/components/visualizations/PresetToggle";

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
}: {
  N: number;
  onNChange: (n: number) => void;
  a: number;
  onAChange: (a: number) => void;
  validBases: number[];
  xBits: number;
  onXBitsChange: (bits: number) => void;
}) {
  return (
    <div className="space-y-8">
      <section aria-labelledby="pf-n-heading">
        <h3 id="pf-n-heading" className="text-sm font-semibold text-foreground">
          N (number to factor)
        </h3>
        <PresetToggle
          options={N_TOGGLE_OPTIONS}
          index={N_TOGGLE_OPTIONS.findIndex((o) => o.n === N)}
          onChange={(i) => onNChange(N_TOGGLE_OPTIONS[i].n)}
          ariaLabel="N"
        />
        <p className="mt-1 text-xs text-muted-foreground">Changing N picks a fresh set of valid bases a.</p>
      </section>

      <section aria-labelledby="pf-a-heading">
        <h3 id="pf-a-heading" className="text-sm font-semibold text-foreground">
          a (coprime to N)
        </h3>
        <select
          value={a}
          onChange={(e) => onAChange(Number(e.target.value))}
          className="mt-3 w-full rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {validBases.map((base) => (
            <option key={base} value={base}>
              a = {base}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted-foreground">
          Every listed value satisfies gcd(a, N) = 1, computed directly, not curated by hand.
        </p>
      </section>

      <section aria-labelledby="pf-t-heading">
        <h3 id="pf-t-heading" className="text-sm font-semibold text-foreground">
          Counting qubits t
        </h3>
        <PresetToggle
          options={X_BITS_TOGGLE_OPTIONS}
          index={X_BITS_TOGGLE_OPTIONS.findIndex((o) => o.bits === xBits)}
          onChange={(i) => onXBitsChange(X_BITS_TOGGLE_OPTIONS[i].bits)}
          ariaLabel="Counting qubits"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          2^t outcomes in the counting register. More qubits sharpen the peaks but slow the computation down.
        </p>
      </section>
    </div>
  );
}
