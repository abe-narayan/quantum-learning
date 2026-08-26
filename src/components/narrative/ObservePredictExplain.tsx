import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * MDX usage:
 * ```mdx
 * <ObservePredictExplain
 *   observe={<LazyDoubleSlitSimulator />}
 *   predict={
 *     <PredictBeforeReveal
 *       question="What happens to the pattern if you close one slit?"
 *       options={[{ label: "Fringes disappear", value: "gone" }, { label: "Fringes stay", value: "stay" }]}
 *       correctValue="gone"
 *       explanation="With one slit open there's nothing left to interfere with — the fringes vanish."
 *     />
 *   }
 *   explain={<p>Interference needs two paths. Close one, and there's only one amplitude left to square.</p>}
 * />
 * ```
 * Each slot's content is ordinary MDX/JSX — a simulator, another narrative
 * component, plain prose — so the three beats compose with the rest of the
 * vocabulary rather than requiring their own mini-syntax.
 *
 * **When to reach for this vs. just sequencing components:** a lesson can
 * always place an `InteractiveSection`, then a `PredictBeforeReveal`, then a
 * paragraph, one after another with no wrapper — and for a lesson where that
 * sequence is one beat among several (interleaved with `Callout`s, further
 * derivation, etc.), that's the right call; don't wrap everything in this
 * component reflexively. Reach for `ObservePredictExplain` specifically when
 * a lesson wants those three beats to read as *one unit* — visually grouped,
 * numbered 01/02/03, so a reader can see at a glance "this whole block is
 * one observe→predict→explain arc" rather than three separately-styled
 * components that happen to be adjacent. The double-slit interference
 * pattern, Stern–Gerlach outcomes, or Bell-test correlations — anywhere a
 * lesson shows a real result, asks the reader to commit to a guess about a
 * specific follow-up change, then explains the mechanism — are the
 * canonical fit.
 *
 * **What this is not:** a preset/multi-way switcher between several worked
 * examples (e.g. "Product state / Bell state / Worked example" toggled by
 * radio buttons) is a different pattern — this component's three slots are
 * sequential narrative beats, not alternative states of the same figure.
 * Don't force that shape in here; it needs its own toggle primitive.
 */

const STEPS = [
  { key: "observe", label: "Observe", index: "01" },
  { key: "predict", label: "Predict", index: "02" },
  { key: "explain", label: "Explain", index: "03" },
] as const;

/**
 * A three-beat sequence wrapper for the OBSERVE → PREDICT → EXPLAIN pattern:
 * show something happening, ask the reader to commit to a prediction, then
 * explain the mechanism. Three named slots rather than positional/ordered
 * children — a content author can't get the order wrong, and each slot is
 * unambiguous about what belongs in it.
 */
export function ObservePredictExplain({
  observe,
  predict,
  explain,
  className,
}: {
  observe: ReactNode;
  predict: ReactNode;
  explain: ReactNode;
  className?: string;
}) {
  const content: Record<(typeof STEPS)[number]["key"], ReactNode> = { observe, predict, explain };

  return (
    <div className={cn("not-prose my-10 space-y-6", className)}>
      {STEPS.map((step) => (
        <div key={step.key} className="border-l-2 border-border pl-5 sm:pl-6">
          <p className="flex items-baseline gap-2">
            <span className="font-tech text-xs text-subtle-foreground">{step.index}</span>
            <span className="tech-label text-pillar">{step.label}</span>
          </p>
          <div className="mt-2 text-sm leading-relaxed text-foreground">{content[step.key]}</div>
        </div>
      ))}
    </div>
  );
}
