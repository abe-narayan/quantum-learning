"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { getPillar } from "@/lib/content/curriculum";
import { pillarVisual } from "@/lib/design/pillars";
import { type ConceptNode, type SimulatorId } from "@/lib/content/concepts";
import { getEntriesForLesson, type CurrentQuantumEntry } from "@/lib/content/currentQuantum/registry";
import { formatEntryDate } from "@/components/currentQuantum/dateUtils";
import type { Difficulty } from "@/lib/content/types";

function simulatorHref(simulatorId: SimulatorId) {
  return `/simulators#${simulatorId}`;
}

export function ConceptDetailPanel({
  node,
  path,
  dependents,
  lessonTitles,
  difficulty,
  dependentDifficulty,
  onSelectConcept,
  onClose,
}: {
  node: ConceptNode;
  /**
   * The full prerequisite route to `node` from `getPrerequisitePath`: every
   * concept that has to come first, in an order where nothing precedes its
   * own prerequisites, with `node` itself last. Rendering the whole chain —
   * not just the one or two direct prerequisites — is what turns "you need
   * Entanglement first" into an actual study route someone can follow.
   */
  path: ConceptNode[];
  /** Direct dependents — concepts that list `node` as a prerequisite — so
   *  the panel can point *forward*, not just back. */
  dependents: ConceptNode[];
  /** Real lesson slug -> real lesson title, sourced from getAllLessonsMeta() on the server. */
  lessonTitles: Record<string, string>;
  /** This concept's resolved difficulty, if `ConceptMapExplorer` was given
   *  lesson difficulty data. `undefined` renders no mark rather than a
   *  guess — see that component's prop doc. */
  difficulty?: Difficulty;
  /** concept id -> resolved difficulty, so each "Leads to" row can show
   *  whether the next step is a step up. */
  dependentDifficulty?: Map<string, Difficulty>;
  onSelectConcept: (id: string) => void;
  onClose: () => void;
}) {
  const pillarInfo = getPillar(node.pillar);
  const visual = pillarVisual(node.pillar);

  // The route without `node` itself, plus the set of *direct* prerequisites
  // so the chain can mark which entries come immediately before this one.
  const priorConcepts = path.filter((entry) => entry.id !== node.id);
  const directPrerequisiteIds = new Set(node.prerequisiteIds);

  const coveredIn = node.lessonSlugs
    .map((slug) => ({ slug, title: lessonTitles[slug] }))
    .filter((lesson): lesson is { slug: string; title: string } => Boolean(lesson.title));

  // Reverse-lookup real "Current Quantum" entries that cite one of this
  // concept's lessons, so the panel can surface up to 2 as mini-cards.
  // `node` (and therefore `node.lessonSlugs`) is a referentially stable
  // object per concept (see ConceptMapExplorer.tsx's memoized `graph`), so
  // this only recomputes when the selected concept actually changes.
  const relatedCurrentQuantumEntries: CurrentQuantumEntry[] = useMemo(() => {
    const seen = new Map<string, CurrentQuantumEntry>();
    for (const slug of node.lessonSlugs) {
      for (const entry of getEntriesForLesson(slug)) {
        if (!seen.has(entry.slug)) seen.set(entry.slug, entry);
      }
    }
    return [...seen.values()]
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      .slice(0, 2);
  }, [node]);

  return (
    <div data-pillar={node.pillar} className="flex h-full flex-col overflow-y-auto p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex flex-wrap items-center gap-2.5">
          <span
            aria-label={pillarInfo?.title ?? node.pillar}
            className="inline-flex items-center gap-1.5 rounded-full border border-pillar-edge bg-pillar-wash px-2.5 py-0.5 text-[0.6875rem] font-medium uppercase tracking-wide text-pillar-text"
          >
            {visual.short}
          </span>
          {difficulty ? <DifficultyMark difficulty={difficulty} /> : null}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close concept details"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <h2 className="mt-3 font-display text-xl font-semibold tracking-tight text-foreground">{node.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{node.definition}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {node.simulatorId ? (
          <Button href={simulatorHref(node.simulatorId)} variant="secondary" size="sm" className="self-start">
            Try the simulator
          </Button>
        ) : null}
        {/* Every concept on the map has a matching glossary entry — GLOSSARY_TERMS
            is built directly from CONCEPT_NODES plus additional terms, sharing the
            same `id`, so this link is never a guess or a fabricated route. */}
        <Link
          href={`/glossary#${node.id}`}
          className="inline-flex min-h-11 items-center text-sm text-pillar-text underline decoration-pillar-edge underline-offset-2 hover:decoration-pillar-accent"
        >
          Full glossary entry →
        </Link>
      </div>

      {/* The payoff, and deliberately the first section under the definition:
          a node on a diagram is only worth clicking if it leads somewhere you
          can actually read. Rows are full-width link targets rather than bare
          inline links so they clear the 44px touch minimum. */}
      <div className="mt-6">
        <span className="tech-label">Lessons that teach this</span>
        {coveredIn.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {coveredIn.map((lesson) => (
              <li key={lesson.slug}>
                <Link
                  href={`/lessons/${lesson.slug}`}
                  className="group flex min-h-11 w-full items-center justify-between gap-3 rounded-[--radius-tight] border border-border bg-surface-muted/40 px-3 py-2 text-sm text-foreground transition-colors duration-[--dur-fast] hover:border-pillar-edge hover:bg-pillar-wash"
                >
                  <span className="min-w-0">{lesson.title}</span>
                  <span aria-hidden="true" className="shrink-0 text-pillar-text opacity-60 transition-opacity group-hover:opacity-100">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          // Said plainly rather than left as an ambiguous dead end: this
          // concept is on the map because the structure needs it, and the
          // glossary entry linked above is its written definition until a
          // lesson is authored.
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            No lesson on the site covers this one yet. Its full written definition is in the
            glossary entry linked above.
          </p>
        )}
      </div>

      {relatedCurrentQuantumEntries.length > 0 ? (
        <div className="mt-6">
          <span className="tech-label">Connected to real research</span>
          <ul className="mt-2 space-y-2">
            {relatedCurrentQuantumEntries.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={`/current-quantum#${entry.slug}`}
                  className="block rounded-[--radius-tight] border border-border bg-surface-muted/50 p-3 transition-colors duration-[--dur-fast] hover:border-pillar-edge hover:bg-surface-muted"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="tech-label text-[0.65rem]">{formatEntryDate(entry.date)}</span>
                    <span className="rounded-full bg-pillar-wash px-2 py-0.5 text-[0.65rem] font-medium capitalize text-pillar-text">
                      {entry.category}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm font-medium text-foreground">{entry.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* "What do I need to learn before this?" — the one question a
          dependency graph is uniquely able to answer, so it gets the whole
          chain back to a root, in order, not just the direct parents. */}
      <div className="mt-6">
        <span className="tech-label">Learn these first</span>
        {priorConcepts.length > 0 ? (
          <>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {priorConcepts.length === 1
                ? "One concept comes before this one."
                : `${priorConcepts.length} concepts come before this one, in this order.`}{" "}
              Marked entries lead directly into it.
            </p>
            <ol className="mt-2 space-y-1.5">
              {priorConcepts.map((prereq, index) => (
                <li key={prereq.id}>
                  <button
                    type="button"
                    onClick={() => onSelectConcept(prereq.id)}
                    className="group flex min-h-11 w-full items-center gap-3 rounded-[--radius-tight] border border-border bg-surface-muted/40 px-3 py-2 text-left text-sm text-foreground transition-colors duration-[--dur-fast] hover:border-pillar-edge hover:bg-pillar-wash"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border font-mono text-[0.625rem] tabular-nums text-muted-foreground"
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">{prereq.title}</span>
                    {directPrerequisiteIds.has(prereq.id) ? (
                      <span className="shrink-0 rounded-full border border-pillar-edge bg-pillar-wash px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-pillar-text">
                        Direct
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Nothing comes before this one — it is a starting point on the map, and you can begin
            here with no background.
          </p>
        )}
      </div>

      {/* Points *forward*, not just back — what this concept unlocks, so the
          panel invites the next click instead of ending the thought here. */}
      <div className="mt-6 border-t border-border pt-5">
        <span className="tech-label">Leads to</span>
        {dependents.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {dependents.map((dependent) => {
              const dependentLevel = dependentDifficulty?.get(dependent.id);
              return (
                <li key={dependent.id}>
                  <button
                    type="button"
                    onClick={() => onSelectConcept(dependent.id)}
                    className="group flex min-h-11 w-full items-center justify-between gap-3 rounded-[--radius-tight] border border-border bg-surface-muted/40 px-3 py-2 text-left text-sm text-foreground transition-colors duration-[--dur-fast] hover:border-pillar-edge hover:bg-pillar-wash"
                  >
                    <span className="min-w-0 truncate">{dependent.title}</span>
                    <span className="flex shrink-0 items-center gap-2.5">
                      {dependentLevel ? <DifficultyMark difficulty={dependentLevel} /> : null}
                      <span aria-hidden="true" className="text-pillar-text opacity-0 transition-opacity group-hover:opacity-100">
                        →
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Nothing on the map builds on this yet.</p>
        )}
      </div>
    </div>
  );
}
