"use client";

import { Children, useState, type ReactNode } from "react";
import { PresetToggle } from "@/components/visualizations/PresetToggle";

/**
 * A minimal MDX-friendly "pick one view" switcher: a `PresetToggle` pill row
 * (radiogroup semantics, roving tabindex, arrow-key selection, min-h-11
 * targets — all inherited from `PresetToggle`) over exactly one visible
 * panel at a time.
 *
 * `children` supplies the panels, in the same order as `options`; the panel
 * whose index matches the selected option is rendered, the rest are not
 * mounted at all. Built for lesson MDX that previously hand-rolled hidden
 * radio inputs with peer-checked CSS (which had no keyboard/focus-visible
 * affordance and sub-44px targets).
 *
 * ```mdx
 * <ToggleView options={["A", "B"]} ariaLabel="Choose a picture">
 *   <PanelA />
 *   <PanelB />
 * </ToggleView>
 * ```
 */
export function ToggleView({
  options,
  ariaLabel,
  children,
}: {
  options: string[];
  ariaLabel: string;
  children: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const panels = Children.toArray(children).filter(
    (child) => typeof child !== "string" || child.trim() !== ""
  );

  return (
    <div className="not-prose flex flex-col gap-3 rounded-panel border border-border bg-surface-muted/40 p-4">
      <PresetToggle
        options={options.map((label) => ({ label }))}
        index={index}
        onChange={setIndex}
        ariaLabel={ariaLabel}
      />
      <div className="w-full">{panels[index] ?? null}</div>
    </div>
  );
}
