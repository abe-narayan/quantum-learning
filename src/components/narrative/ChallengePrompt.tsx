import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Typography";
import { FadeRule } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

/**
 * MDX usage:
 * ```mdx
 * <ChallengePrompt prompt="Work out the ground-state energy for an infinite well twice this width.">
 *   You already have every piece you need from this lesson — no new
 *   formula required.
 * </ChallengePrompt>
 * ```
 * `children` is optional extra detail/hints below the prompt itself.
 */

/**
 * The "now you try" beat at a lesson's end. Deliberately the one narrative
 * component with no border and no panel — everything else in this file
 * (and in `src/components/mdx/`) is a boxed surface, so an open, editorial
 * treatment reads as a genuine change of gear: the lesson is handing the
 * reader something to *do*. `FadeRule` marks the transition out of the
 * preceding content; `Eyebrow` ties the "Challenge" label to the ambient
 * lesson pillar like every other section marker on the site.
 */
export function ChallengePrompt({
  prompt,
  children,
  className,
}: {
  prompt: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("not-prose my-10", className)}>
      <FadeRule className="mb-6" />
      <Eyebrow>Challenge</Eyebrow>
      <p className="mt-3 text-balance font-display text-xl font-semibold text-foreground sm:text-2xl">
        {prompt}
      </p>
      {/* `text-base`: `not-prose` does not reset an inherited `font-size`, so
          this hint copy is sized against `.prose`'s 18px body. */}
      {children ? (
        <div className="mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">{children}</div>
      ) : null}
    </div>
  );
}
