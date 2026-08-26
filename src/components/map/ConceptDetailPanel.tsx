"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getConcept, type ConceptNode, type SimulatorId } from "@/lib/content/concepts";
import { getEntriesForLesson, type CurrentQuantumEntry } from "@/lib/content/currentQuantum/registry";

const PILLAR_LABEL: Record<ConceptNode["pillar"], string> = {
  "quantum-mechanics": "Quantum Mechanics",
  "quantum-computing": "Quantum Computing",
  "quantum-hardware": "Quantum Hardware",
  "quantum-software": "Quantum Software",
  "quantum-mastery": "Quantum Mastery",
  apex: "Apex",
};

const PILLAR_TONE: Record<ConceptNode["pillar"], "brand" | "accent" | "neutral" | "warning" | "danger" | "success"> = {
  "quantum-mechanics": "brand",
  "quantum-computing": "accent",
  "quantum-hardware": "warning",
  "quantum-software": "neutral",
  "quantum-mastery": "danger",
  // Distinct from "quantum-mechanics" above — see the matching note in
  // ConceptMapExplorer.tsx's PILLAR_DOT.
  apex: "success",
};

function simulatorHref(simulatorId: SimulatorId) {
  return `/simulators#${simulatorId}`;
}

/**
 * Mirrors the date formatting in `CurrentQuantumCard.tsx` — entries may
 * record only a year+month ("1994-11") when a more precise date isn't
 * confirmable, so this keeps both that and a full "YYYY-MM-DD" readable.
 */
function formatCurrentQuantumDate(iso: string): string {
  const parts = iso.split("-").map(Number);
  const [year, month, day] = parts;
  const date = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: day ? "numeric" : undefined,
    timeZone: "UTC",
  });
}

export function ConceptDetailPanel({
  node,
  lessonTitles,
  onSelectConcept,
  onClose,
}: {
  node: ConceptNode;
  /** Real lesson slug -> real lesson title, sourced from getAllLessonsMeta() on the server. */
  lessonTitles: Record<string, string>;
  onSelectConcept: (id: string) => void;
  onClose: () => void;
}) {
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
    <div className="flex h-full flex-col overflow-y-auto p-5">
      <div className="flex items-start justify-between gap-3">
        <Badge tone={PILLAR_TONE[node.pillar]}>{PILLAR_LABEL[node.pillar]}</Badge>
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

      <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground">{node.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{node.definition}</p>

      {node.simulatorId ? (
        <Button href={simulatorHref(node.simulatorId)} variant="secondary" size="sm" className="mt-4 self-start">
          Try the simulator
        </Button>
      ) : null}

      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Covered in</h3>
        {coveredIn.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {coveredIn.map((lesson) => (
              <li key={lesson.slug}>
                <Link
                  href={`/lessons/${lesson.slug}`}
                  className="text-sm text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
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
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Connected to real research
          </h3>
          <ul className="mt-2 space-y-2">
            {relatedCurrentQuantumEntries.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href="/current-quantum"
                  className="block rounded-lg border border-border bg-surface-muted/50 p-3 transition-colors hover:border-brand/40 hover:bg-surface-muted"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {formatCurrentQuantumDate(entry.date)}
                    </span>
                    <Badge tone="brand" className="capitalize">
                      {entry.category}
                    </Badge>
                  </span>
                  <span className="mt-1 block text-sm font-medium text-foreground">{entry.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prerequisites</h3>
        {prerequisites.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {prerequisites.map((prereq) => (
              <li key={prereq.id}>
                <button
                  type="button"
                  onClick={() => onSelectConcept(prereq.id)}
                  className="text-sm text-foreground underline decoration-border underline-offset-2 hover:text-brand hover:decoration-brand"
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
    </div>
  );
}
