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
      <div className="flex items-end gap-1 overflow-x-auto rounded-xl border border-border bg-surface-muted/40 p-4" style={{ height: 220 }}>
        {amplitudes.map((amp, index) => {
          const isMarked = markedIndices.includes(index);
          const barHeight = (Math.abs(amp) / maxAbs) * 90;
          return (
            <div key={index} className="flex min-w-[2.25rem] flex-1 flex-col items-center justify-end gap-1">
              <span className="font-mono text-[10px] text-muted-foreground">
                {Math.round(probabilities[index] * 100)}%
              </span>
              <div className="relative flex h-[140px] w-full items-end justify-center">
                <div
                  className={cn(
                    "w-6 rounded-t-sm transition-[height] duration-500 ease-out motion-reduce:transition-none",
                    isMarked ? "bg-accent" : amp < 0 ? "bg-muted-foreground/60" : "bg-brand/70"
                  )}
                  style={{ height: `${barHeight}%` }}
                />
              </div>
              <span className={cn("font-mono text-[10px]", isMarked ? "font-semibold text-accent" : "text-muted-foreground")}>
                |{state.basisLabel(index)}⟩
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Bar height is amplitude magnitude; the label above each bar is that state&rsquo;s measurement probability.
        The marked state is highlighted.
      </p>
    </div>
  );
}
