import { cn } from "@/lib/utils";

const N_PRESETS = [15, 21, 35];
const X_BITS_OPTIONS = [4, 5, 6, 7];

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
        <div role="radiogroup" aria-label="N" className="mt-3 flex overflow-hidden rounded-full border border-border">
          {N_PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={N === n}
              onClick={() => onNChange(n)}
              className={cn(
                "flex-1 px-3 py-1.5 text-sm font-medium transition-colors",
                N === n ? "bg-brand text-brand-foreground" : "bg-surface text-muted-foreground hover:bg-surface-muted"
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Changing N picks a fresh set of valid bases a.</p>
      </section>

      <section aria-labelledby="pf-a-heading">
        <h3 id="pf-a-heading" className="text-sm font-semibold text-foreground">
          a (coprime to N)
        </h3>
        <select
          value={a}
          onChange={(e) => onAChange(Number(e.target.value))}
          className="mt-3 w-full rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-sm text-foreground"
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
        <div role="radiogroup" aria-label="Counting qubits" className="mt-3 flex overflow-hidden rounded-full border border-border">
          {X_BITS_OPTIONS.map((bits) => (
            <button
              key={bits}
              type="button"
              role="radio"
              aria-checked={xBits === bits}
              onClick={() => onXBitsChange(bits)}
              className={cn(
                "flex-1 px-3 py-1.5 text-sm font-medium transition-colors",
                xBits === bits ? "bg-brand text-brand-foreground" : "bg-surface text-muted-foreground hover:bg-surface-muted"
              )}
            >
              {bits}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          2^t outcomes in the counting register. More qubits sharpen the peaks but slow the computation down.
        </p>
      </section>
    </div>
  );
}
