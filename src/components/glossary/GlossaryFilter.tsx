"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { GlossaryTerm } from "@/lib/content/glossary";

const PILLAR_LABEL: Record<GlossaryTerm["pillar"], string> = {
  "quantum-mechanics": "Quantum Mechanics",
  "quantum-computing": "Quantum Computing",
  "quantum-hardware": "Quantum Hardware",
  "quantum-software": "Quantum Software",
  "quantum-mastery": "Quantum Mastery",
  apex: "Apex",
};

const PILLAR_TONE: Record<GlossaryTerm["pillar"], "brand" | "accent" | "neutral" | "warning" | "danger" | "success"> = {
  "quantum-mechanics": "brand",
  "quantum-computing": "accent",
  "quantum-hardware": "warning",
  "quantum-software": "neutral",
  "quantum-mastery": "danger",
  // Distinct from "quantum-mechanics" above — apex's badge previously
  // reused the same "brand" tone as quantum-mechanics, making the two
  // pillars indistinguishable in the filter list.
  apex: "success",
};

function simulatorHref(simulatorId: NonNullable<GlossaryTerm["simulatorId"]>) {
  return `/simulators#${simulatorId}`;
}

export function GlossaryFilter({
  terms,
  lessonTitles,
}: {
  terms: GlossaryTerm[];
  /** Real lesson slug -> real lesson title, sourced from getAllLessonsMeta() on the server. */
  lessonTitles: Record<string, string>;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return terms;
    return terms.filter(
      (term) => term.title.toLowerCase().includes(needle) || term.definition.toLowerCase().includes(needle)
    );
  }, [terms, query]);

  return (
    <div>
      <div className="sticky top-16 z-10 -mx-4 bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
        <label className="block">
          <span className="sr-only">Filter glossary terms</span>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Filter ${terms.length} terms…`}
            className="w-full rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        <p className="mt-2 text-xs text-muted-foreground">
          {filtered.length === terms.length
            ? `${terms.length} terms`
            : `${filtered.length} of ${terms.length} terms`}
        </p>
      </div>

      {filtered.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {filtered.map((term) => {
            const coveredIn = term.lessonSlugs
              .map((slug) => ({ slug, title: lessonTitles[slug] }))
              .filter((lesson): lesson is { slug: string; title: string } => Boolean(lesson.title));

            return (
              <li key={term.id} id={term.id}>
                <Card>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
                      {term.title}
                    </h2>
                    <Badge tone={PILLAR_TONE[term.pillar]}>{PILLAR_LABEL[term.pillar]}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{term.definition}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {coveredIn.map((lesson) => (
                      <Link
                        key={lesson.slug}
                        href={`/lessons/${lesson.slug}`}
                        className="text-sm text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
                      >
                        Read the lesson: {lesson.title}
                      </Link>
                    ))}
                    {term.simulatorId ? (
                      <Link
                        href={simulatorHref(term.simulatorId)}
                        className="text-sm text-foreground underline decoration-border underline-offset-2 hover:text-brand hover:decoration-brand"
                      >
                        Try the simulator
                      </Link>
                    ) : null}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">No terms match &ldquo;{query}&rdquo;.</p>
      )}
    </div>
  );
}
