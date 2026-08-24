import type { ReactNode } from "react";

/**
 * Wraps a simulator embed inside lesson prose with a title and a concrete
 * "what to actually do" prompt, so a lesson never just says "here is a
 * simulator" — the interaction is framed before the student reaches it.
 * Visually distinguished from `Callout` (accent-tinted, not a note/warning/
 * mistake semantic) so a scanning eye can immediately tell "this part is
 * something to click," not just read.
 */
export function InteractiveSection({
  title = "Try it yourself",
  description,
  children,
}: {
  title?: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="not-prose my-8 rounded-xl border border-accent/30 bg-accent/5 p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">{title}</p>
      <p className="mt-2 text-sm text-foreground">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
