import type { StateVector } from "@/lib/quantum/state";
import { twoQubitJointProbabilities } from "@/lib/quantum/twoQubit";

function Cell({ value }: { value: number }) {
  const percent = Math.round(value * 100);
  return (
    <td className="px-3 py-2 text-center">
      <span
        className="inline-block rounded-md px-2 py-0.5 font-mono text-xs"
        style={{
          backgroundColor: `color-mix(in srgb, var(--pillar-accent) ${percent}%, transparent)`,
          color: percent > 45 ? "var(--brand-foreground)" : "var(--foreground)",
        }}
      >
        {percent}%
      </span>
    </td>
  );
}

export function CorrelationView({ state }: { state: StateVector }) {
  const { p00, p01, p10, p11 } = twoQubitJointProbabilities(state);

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">Correlation</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        The joint probability of each (q0, q1) outcome — read a row to see how q1&rsquo;s outcome depends on
        q0&rsquo;s.
      </p>
      <div className="mt-3 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="px-3 py-2 text-left font-medium">
                q0 \ q1
              </th>
              <th scope="col" className="px-3 py-2 text-center font-medium">
                0
              </th>
              <th scope="col" className="px-3 py-2 text-center font-medium">
                1
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <th scope="row" className="px-3 py-2 text-left font-mono font-medium text-foreground">
                0
              </th>
              <Cell value={p00} />
              <Cell value={p01} />
            </tr>
            <tr>
              <th scope="row" className="px-3 py-2 text-left font-mono font-medium text-foreground">
                1
              </th>
              <Cell value={p10} />
              <Cell value={p11} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
