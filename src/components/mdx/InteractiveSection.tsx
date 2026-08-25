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
    <div className="not-prose my-8 rounded-2xl border border-accent/30 bg-accent/5 p-6">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0 fill-accent">
          <path d="M2.5 1.5 L10 6 L2.5 10.5 Z" />
        </svg>
        {title}
      </p>
      <p className="mt-2 text-sm text-foreground">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
