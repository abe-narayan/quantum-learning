import { cn } from "@/lib/utils";
import type { StateVector } from "@/lib/quantum/state";

/**
 * A bar chart of every basis state's amplitude sign and probability,
 * the direct visualization of Grover's amplitude amplification: watch
 * the marked bar grow (and unmarked bars shrink) with each iteration.
 * Amplitudes here are always real (H, phase flips, and diffusion never
 * introduce an imaginary part starting from a real uniform superposition),
 * so the sign is shown directly rather than needing a full complex plot.
 */
export function AmplitudeBars({ state, markedIndices }: { state: StateVector; markedIndices: number[] }) {
  const amplitudes = state.amplitudes.map((a) => a.re);
  const maxAbs = Math.max(0.05, ...amplitudes.map((a) => Math.abs(a)));
  const probabilities = state.probabilities();

  return (
    <div className="space-y-2">
      {/* `tabIndex={0}` + `role="group"`. Every bar column is
          `min-w-[2.25rem]` (36px), and this chart draws one column per basis
          state: 2ⁿ of them, so a 4-qubit search is 16 columns = 576px against
          a stage that is ~256px wide on a 320px phone. It genuinely scrolls,
          and an `overflow-x-auto` div is focusable by default in no browser
          except Firefox: a keyboard-only reader watching amplitude
          amplification could see |00…0⟩ and its neighbours and had no way to
          reach the marked state, which is the one bar the whole simulator is
          about. Nothing inside is focusable, so this is not a redundant stop;
          it is the only one.
          The name restates what the caption below already says in visible
          text, so a reader landing here knows what the bars encode without
          having to leave and come back. */}
      <div
        role="group"
        aria-label="Amplitude bars, one per basis state, scrollable horizontally. Bar height is amplitude magnitude; the percentage above each bar is that state's measurement probability. A minus sign before a state's label means its amplitude is negative."
        tabIndex={0}
        className="flex items-end gap-1 overflow-x-auto rounded-panel border border-border bg-surface-muted/40 p-4"
        style={{ height: 220 }}
      >
        {amplitudes.map((amp, index) => {
          const isMarked = markedIndices.includes(index);
          const barHeight = (Math.abs(amp) / maxAbs) * 90;
          // Sign, carried by a glyph and not only by a fill colour.
          //
          // Negative amplitudes are not an edge case here: running the real
          // engine, a 3-qubit search with one marked item has seven of its
          // eight amplitudes negative from round 2 onward, and by round 4 all
          // eight are. The chart already drew them differently (grey rather
          // than pillar-tinted) but nothing on screen said so, which made it
          // both a WCAG 1.4.1 colour-only encoding and, worse, a silent one:
          // the sign flip is the single mechanism the instrument exists to
          // show, and the controls' own gloss promises the oracle "flips the
          // sign of that one item's amplitude, leaving every probability
          // unchanged." A reader could not check that claim against the chart.
          const isNegative = amp < -1e-12;
          return (
            <div key={index} className="flex min-w-[2.25rem] flex-1 flex-col items-center justify-end gap-1">
              <span className="font-mono text-micro text-muted-foreground">
                {Math.round(probabilities[index] * 100)}%
              </span>
              <div className="relative flex h-[140px] w-full items-end justify-center">
                <div
                  className={cn(
                    "w-6 rounded-t-sm transition-[height] duration-500 ease-out motion-reduce:transition-none",
                    isMarked ? "bg-accent" : amp < 0 ? "bg-muted-foreground/60" : "bg-pillar/70"
                  )}
                  style={{ height: `${barHeight}%` }}
                />
              </div>
              <span className={cn("font-mono text-micro leading-tight", isMarked ? "font-semibold text-accent" : "text-muted-foreground")}>
                {isNegative ? "−" : ""}|{state.basisLabel(index)}⟩
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Bar height is amplitude magnitude; the percentage above each bar is that state&rsquo;s measurement
        probability. The marked state is highlighted. A minus sign before a label (and the greyed bar that
        goes with it) means that amplitude has gone negative: same probability, opposite sign. That sign is
        invisible to a measurement, and turning it into a height difference is exactly what the diffusion
        step does.
      </p>
    </div>
  );
}
