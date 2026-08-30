import type { StateVector } from "@/lib/quantum/state";
import { twoQubitJointProbabilities } from "@/lib/quantum/twoQubit";

function Cell({ value }: { value: number }) {
  const percent = Math.round(value * 100);
  return (
    <td className="px-3 py-2 text-center">
      <span
        className="inline-block rounded-(--radius-tight) px-2 py-0.5 font-mono text-xs text-foreground"
        style={{
          // `--pillar-dim`, not `--pillar-accent`, and one text colour rather
          // than a brightness-flipped pair.
          //
          // The cell fill is the probability, so its alpha sweeps the whole
          // 0–100% range. `--pillar-accent` is a *light* ramp step (L 0.78),
          // so on the dark theme a high-probability cell landed mid-luminance,
          // where neither near-white nor near-black text reaches 4.5:1 at this
          // 12px size. Measured in a browser across the full ramp: the old
          // `percent > 45` flip put dark text on 3.00:1 at 46%, 3.32 at 50%,
          // 4.22 at 60%: every cell from 46% to about 63% failed AA, and no
          // choice of threshold fixes it, because the two curves cross at
          // ~4.2:1. The dead zone was in the fill colour, not the switch point.
          //
          // `--pillar-dim` (L 0.45 dark / 0.72 light) keeps the swatch on the
          // far side of the text colour for the entire ramp, so a single text
          // colour works everywhere: worst case 5.67:1, measured across all
          // six pillars in both themes at every 5% step. The heat map keeps
          // its full intensity range; it just runs dark-to-tinted on a dark
          // ground instead of crossing through the middle.
          backgroundColor: `color-mix(in srgb, var(--pillar-dim) ${percent}%, transparent)`,
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
        The joint probability of each (q0, q1) outcome. Read a row to see how q1&rsquo;s outcome depends on
        q0&rsquo;s.
      </p>
      {/* `overflow-x-auto`, not `overflow-hidden`. The `overflow` is here to
          clip the table's square corners to the rounded border, and either
          value does that, but `hidden` also decides what happens when the
          table does not fit, and its answer is to destroy the overflowing
          column with no scrollbar, no ellipsis and no symptom of any kind.
          Every other table wrapper in these simulators (`StatePanel`,
          `StateInspector`, `mdx-components.tsx`'s `Table`) scrolls instead;
          this was the one that clipped.

          At default text size it does fit: min-content is about 79px for the
          "q0 \ q1" header plus ~69px for each probability column (px-3 cell
          padding, a px-2 chip, and a 4-character `100%` in font-mono text-xs),
          roughly 217px against the ~254px content box a 320px phone leaves
          after the page's 16px gutters and this panel's padding. That margin
          is 37px, and it is gone the moment a reader uses browser text zoom,
          which WCAG 1.4.4 requires to work to 200%. Under `hidden` that reader
          loses the q1=1 column outright and has no way to know a column is
          missing; under `auto` they can scroll to it.

          `tabIndex={0}` + `role="group"` because an `overflow-x-auto` div is
          focusable by default in no browser except Firefox, so scrolling it
          would otherwise be mouse-and-trackpad only (WCAG 2.1.1), the same
          remedy, and the same `group`-not-`region` reasoning, as the sibling
          `StatePanel` table one file over. */}
      <div
        tabIndex={0}
        role="group"
        aria-label="Joint probability of each two-qubit measurement outcome"
        className="mt-3 overflow-x-auto rounded-panel border border-border"
      >
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
