"use client";

import { useSyncExternalStore } from "react";
import { Instrument } from "@/components/ui/Panel";
import { TechLabel, TechValue } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

/**
 * The only fields the card ever renders — deliberately not the `Problem`
 * type. `DailyPuzzle` (the server half) builds this list from the full
 * registry so hints, the answer key, and the worked solution (the
 * overwhelming majority of a `Problem`'s bytes) never have to ship to the
 * client just to preview one of 547 problems. See DailyPuzzle.tsx.
 */
export type DailyPuzzlePreview = {
  slug: string;
  title: string;
  prompt: string;
  difficulty: string;
  estimatedMinutes: number;
};

/** Sums a string's char codes, mod `length` — a simple, deterministic hash. */
function hashToIndex(key: string, length: number): number {
  let sum = 0;
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
  return sum % length;
}

function pickToday(previews: readonly DailyPuzzlePreview[]): DailyPuzzlePreview | null {
  if (previews.length === 0) return null;
  const dateKey = new Date().toISOString().slice(0, 10);
  return previews[hashToIndex(dateKey, previews.length)];
}

const noopSubscribe = () => () => {};

/** aria-hidden shimmer bar standing in for one line of text. Sized in `em`
 *  so it inherits the height of whatever text-sized element wraps it,
 *  rather than a guessed pixel value — keeps the skeleton's box the same
 *  size as the real line it's standing in for by construction, not by
 *  coincidence. `motion-safe:` plus globals.css's global reduced-motion
 *  rule (§11) both neuter the pulse under reduced motion. */
function SkeletonLine({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block h-[1em] w-full rounded-[var(--radius-tight)] bg-surface-muted align-middle motion-safe:animate-pulse ${className ?? ""}`}
    />
  );
}

/**
 * Client half of "Problem of the Day". `DailyPuzzle` (server) hands down a
 * lean `previews` list; this component does the date-hash pick and render.
 *
 * Split out from `DailyPuzzle` for one reason: keeping the pick (which
 * needs the real, un-baked "today") client-side while keeping the *data*
 * (which doesn't need to be client-side at all) server-side. Previously
 * this one component did both, and because it ran on the client it forced
 * the entire problems registry — hints, answers, worked solutions for all
 * 547 problems — into the browser bundle to pick and preview one of them.
 *
 * `useSyncExternalStore` with a null server snapshot keeps the prerendered
 * HTML and the first client render identical (this page is 100% static;
 * reading `new Date()` during render would bake the build day's problem
 * into the cached HTML forever). The reserved-height skeleton below —
 * rather than the previous `return null` — is what keeps that necessarily-
 * deferred render from shifting layout once the real pick lands. See
 * docs/UX_REVIEW.md P2-8.
 */
export function DailyPuzzleClient({ previews }: { previews: DailyPuzzlePreview[] }) {
  const problem = useSyncExternalStore(noopSubscribe, () => pickToday(previews), () => null);

  return (
    <Instrument
      label="Problem of the day"
      readout={
        problem ? (
          <TechValue className="text-xs">{new Date().toISOString().slice(0, 10)}</TechValue>
        ) : (
          <TechValue className="text-xs opacity-0" aria-hidden="true">
            0000-00-00
          </TechValue>
        )
      }
      footnote="A new pick every calendar day, the same one for every visitor."
    >
      {problem ? (
        <>
          <h3 className="font-display text-lg font-semibold text-foreground">{problem.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{problem.prompt}</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <TechLabel>Difficulty</TechLabel>
              <TechValue className="capitalize">{problem.difficulty}</TechValue>
            </div>
            <div className="flex flex-col gap-1">
              <TechLabel>Time</TechLabel>
              <TechValue>{problem.estimatedMinutes} min</TechValue>
            </div>
          </div>
          <Button href={`/problems/${problem.slug}`} className="mt-5">
            Solve today&rsquo;s problem
          </Button>
        </>
      ) : (
        <div role="status">
          <span className="sr-only">Loading today&rsquo;s problem&hellip;</span>
          <h3 className="font-display text-lg font-semibold text-foreground" aria-hidden="true">
            <SkeletonLine className="w-3/4" />
          </h3>
          <p className="mt-2 text-sm text-muted-foreground" aria-hidden="true">
            <SkeletonLine />
            <br />
            <SkeletonLine className="w-5/6" />
          </p>
          <div className="mt-4 flex items-center gap-4" aria-hidden="true">
            <div className="flex flex-col gap-1">
              <TechLabel>Difficulty</TechLabel>
              <TechValue>
                <SkeletonLine className="w-16" />
              </TechValue>
            </div>
            <div className="flex flex-col gap-1">
              <TechLabel>Time</TechLabel>
              <TechValue>
                <SkeletonLine className="w-12" />
              </TechValue>
            </div>
          </div>
          <Button className="mt-5" disabled tabIndex={-1} aria-hidden="true">
            Solve today&rsquo;s problem
          </Button>
        </div>
      )}
    </Instrument>
  );
}
