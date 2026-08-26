"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { getPillar } from "@/lib/content/curriculum";
import { pillarVisual } from "@/lib/design/pillars";
import { getConcept, type ConceptNode, type SimulatorId } from "@/lib/content/concepts";
import { getEntriesForLesson, type CurrentQuantumEntry } from "@/lib/content/currentQuantum/registry";
import { formatEntryDate } from "@/components/currentQuantum/dateUtils";
import type { Difficulty } from "@/lib/content/types";

function simulatorHref(simulatorId: SimulatorId) {
  return `/simulators#${simulatorId}`;
}

export function ConceptDetailPanel({
  node,
  dependents,
  lessonTitles,
  difficulty,
  dependentDifficulty,
  onSelectConcept,
  onClose,
}: {
  node: ConceptNode;
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

  const prerequisites = node.prerequisiteIds
    .map((id) => getConcept(id))
    .filter((concept): concept is ConceptNode => concept !== undefined);

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
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <h2 className="mt-3 font-display text-xl font-semibold tracking-tight text-foreground">{node.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{node.definition}</p>

      {node.simulatorId ? (
        <Button href={simulatorHref(node.simulatorId)} variant="secondary" size="sm" className="mt-4 self-start">
          Try the simulator
        </Button>
      ) : null}

      <div className="mt-6">
        <span className="tech-label">Covered in</span>
        {coveredIn.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {coveredIn.map((lesson) => (
              <li key={lesson.slug}>
                <Link
                  href={`/lessons/${lesson.slug}`}
                  className="text-sm text-pillar-text underline decoration-pillar-edge underline-offset-2 hover:decoration-pillar-accent"
                >
                  {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No linked lesson found.</p>
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

      <div className="mt-6">
        <span className="tech-label">Prerequisites</span>
        {prerequisites.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {prerequisites.map((prereq) => (
              <li key={prereq.id}>
                <button
                  type="button"
                  onClick={() => onSelectConcept(prereq.id)}
                  className="text-sm text-foreground underline decoration-border underline-offset-2 hover:text-pillar-text hover:decoration-pillar-accent"
                >
                  {prereq.title}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No prerequisites — this is a starting point.</p>
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
                    className="group flex w-full items-center justify-between gap-3 rounded-[--radius-tight] border border-border bg-surface-muted/40 px-3 py-2 text-left text-sm text-foreground transition-colors duration-[--dur-fast] hover:border-pillar-edge hover:bg-pillar-wash"
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
