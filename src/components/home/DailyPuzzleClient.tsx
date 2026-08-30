"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Instrument } from "@/components/ui/Panel";
import { TechLabel, TechValue } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

/**
 * The only fields the card ever renders, deliberately not the `Problem`
 * type. `DailyPuzzle` (the server half) builds this list from the full
 * registry so hints, the answer key, and the worked solution (the
 * overwhelming majority of a `Problem`'s bytes) never have to ship to the
 * client just to preview a single one of them. See DailyPuzzle.tsx.
 */
export type DailyPuzzlePreview = {
  slug: string;
  title: string;
  prompt: string;
  difficulty: string;
  estimatedMinutes: number;
};

/**
 * FNV-1a, 32-bit, mod `length`. Deterministic and dependency-free, the two
 * properties this pick needs, and — unlike what it replaces — actually
 * distributed.
 *
 * The previous version summed the key's char codes. That is
 * order-insensitive and, over a set of keys as tightly constrained as
 * `YYYY-MM-DD` for one year, very nearly constant: the year contributes a
 * fixed amount, the two hyphens are fixed, and the four remaining digits
 * only ever move the total across a narrow band. Measured over the 365 keys
 * of 2026, the sum took **19 distinct values**, so the card showed 19 of the
 * 337 eligible problems in a year, each roughly thirty times, and repeated
 * within three days (2026-08-30, 09-02 and 09-11 were all "s-Wave Cross
 * Section as a Fraction of the Low-Energy Limit"). Permutations collide by
 * construction too, which is why dates a few days apart landed on the same
 * slot. The footnote this component renders — "A new pick every calendar
 * day" — was simply false.
 *
 * The clustering had a second, worse effect than repetition. Nineteen fixed
 * slots out of 337 is a fixed *sample*, and the one it happened to draw was
 * dominated by the hardest end of the eligible range: Clebsch-Gordan
 * coefficients, squeezed states, s-wave cross sections. So the front page
 * greeted every first-time visitor with the same handful of the most
 * forbidding problems the filter below allows, permanently. With a real
 * avalanche the same pool yields 241 distinct problems a year, 14 distinct
 * in any 14 days, and a mix in which roughly a third of days are `beginner`.
 * Spreading the hash fixed the intimidation problem without narrowing the
 * corpus, which is why the difficulty filter below is unchanged.
 *
 * Exported for `__tests__/dailyPuzzle.test.ts`, which pins the spread.
 */
export function hashToIndex(key: string, length: number): number {
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash % length;
}

/** `ProblemDifficulty` rungs a homepage visitor can reasonably be handed
 *  cold. This card sits on the front page, where "today's problem" is many
 *  visitors' first contact with the problem corpus, a uniform pick over all
 *  problems used to serve beginners a Master-level proof on the wrong
 *  day. Advanced and Master problems stay one click away at /problems. */
const DAILY_PICK_DIFFICULTIES = new Set(["beginner", "intermediate"]);

/**
 * Deterministic daily pick: the date string hashes to an index into the
 * *filtered* beginner+intermediate subset, not the full list: same date,
 * same problem, for every visitor, but never a Master problem on the
 * homepage. The unfiltered fallback only exists so an (currently
 * impossible) all-advanced corpus still renders a card rather than nothing;
 * the "easier one" link in the render handles that case honestly.
 */
export function pickToday(
  previews: readonly DailyPuzzlePreview[],
  /** The `YYYY-MM-DD` key to pick against. Defaults to today; passed
   *  explicitly by the test, which has to walk a year of dates. */
  dateKey: string = new Date().toISOString().slice(0, 10)
): DailyPuzzlePreview | null {
  if (previews.length === 0) return null;
  const approachable = previews.filter((preview) =>
    DAILY_PICK_DIFFICULTIES.has(preview.difficulty)
  );
  const pool = approachable.length > 0 ? approachable : previews;
  return pool[hashToIndex(dateKey, pool.length)];
}

const noopSubscribe = () => () => {};

/** aria-hidden shimmer bar standing in for one line of text. Sized in `em`
 *  so it inherits the height of whatever text-sized element wraps it,
 *  rather than a guessed pixel value, keeps the skeleton's box the same
 *  size as the real line it's standing in for by construction, not by
 *  coincidence. `motion-safe:` plus globals.css's global reduced-motion
 *  rule (§11) both neuter the pulse under reduced motion. */
function SkeletonLine({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block h-[1em] w-full rounded-(--radius-tight) bg-surface-muted align-middle motion-safe:animate-pulse ${className ?? ""}`}
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
 * the entire problems registry (hints, answers, worked solutions for all
 * every problem) into the browser bundle to pick and preview one of them.
 *
 * `useSyncExternalStore` with a null server snapshot keeps the prerendered
 * HTML and the first client render identical (this page is 100% static;
 * reading `new Date()` during render would bake the build day's problem
 * into the cached HTML forever). The reserved-height skeleton below (used
 * rather than the previous `return null`) is what keeps that necessarily-
 * deferred render from shifting layout once the real pick lands. See
 * docs/UX_REVIEW.md P2-8.
 */
export function DailyPuzzleClient({
  previews,
  headingLevel: Heading = "h3",
}: {
  previews: DailyPuzzlePreview[];
  /** Where this card's title sits in the host page's outline. The card is
   *  dropped into whatever section wants it, so the level cannot be fixed
   *  here: on the homepage it now sits two levels below an act plate, and
   *  hard-coding `h3` there would skip a level. */
  headingLevel?: "h3" | "h4" | "h5";
}) {
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
          <Heading className="font-display text-lg font-semibold text-foreground">{problem.title}</Heading>
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
          {/* Only reachable via pickToday's unfiltered fallback, kept so
              that if the pick can ever be advanced/master again, a beginner
              is offered a way out rather than a wall. */}
          {problem.difficulty === "advanced" || problem.difficulty === "master" ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Today&rsquo;s pick runs deep.{" "}
              <Link href="/problems" className="font-medium text-pillar hover:underline">
                Prefer an easier one?
              </Link>
            </p>
          ) : null}
        </>
      ) : (
        <div role="status">
          <span className="sr-only">Loading today&rsquo;s problem&hellip;</span>
          <Heading className="font-display text-lg font-semibold text-foreground" aria-hidden="true">
            <SkeletonLine className="w-3/4" />
          </Heading>
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
