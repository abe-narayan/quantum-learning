"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { pillarVisual } from "@/lib/design/pillars";
import type { GlossaryTerm } from "@/lib/content/glossary";

const PILLAR_LABEL: Record<GlossaryTerm["pillar"], string> = {
  "quantum-mechanics": "Quantum Mechanics",
  "quantum-computing": "Quantum Computing",
  "quantum-hardware": "Quantum Hardware",
  "quantum-software": "Quantum Software",
  "quantum-mastery": "Quantum Mastery",
  apex: "Apex",
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function letterOf(title: string): string {
  const first = title.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : "#";
}

function simulatorHref(simulatorId: NonNullable<GlossaryTerm["simulatorId"]>) {
  return `/simulators#${simulatorId}`;
}

function letterAnchorId(letter: string) {
  return `glossary-${letter === "#" ? "misc" : letter}`;
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

  const sorted = useMemo(
    () => [...terms].sort((a, b) => a.title.localeCompare(b.title)),
    [terms]
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return sorted;
    return sorted.filter(
      (term) => term.title.toLowerCase().includes(needle) || term.definition.toLowerCase().includes(needle)
    );
  }, [sorted, query]);

  const groups = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    for (const term of filtered) {
      const letter = letterOf(term.title);
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(term);
    }
    return map;
  }, [filtered]);

  const presentLetters = useMemo(() => new Set(groups.keys()), [groups]);

  return (
    <div className="lg:grid lg:grid-cols-[2.75rem_1fr] lg:items-start lg:gap-10">
      {/* Persistent alphabet index — desktop: a sticky rail of real in-page
          anchors (not buttons), so it's a genuine jump-list a keyboard or
          screen-reader user can Tab/traverse, not a JS-only scroll gimmick.
          Letters with no current matches stay visible (the alphabet itself
          doesn't change) but are visually and functionally inert. */}
      <nav
        aria-label="Jump to letter"
        className="sticky top-24 hidden max-h-[calc(100vh-7rem)] flex-col items-center gap-0.5 overflow-y-auto pb-4 lg:flex"
      >
        {ALPHABET.map((letter) => {
          const present = presentLetters.has(letter);
          return present ? (
            <a
              key={letter}
              href={`#${letterAnchorId(letter)}`}
              className="tech-value flex h-6 w-6 items-center justify-center rounded text-xs text-muted-foreground transition-colors hover:bg-surface-muted hover:text-pillar-text"
            >
              {letter}
            </a>
          ) : (
            <span
              key={letter}
              aria-hidden="true"
              className="tech-value flex h-6 w-6 items-center justify-center text-xs text-subtle-foreground/40"
            >
              {letter}
            </span>
          );
        })}
      </nav>

      <div>
        {/* Opaque `bg-surface`, no backdrop-blur — this sits directly under
            the sticky navbar, which deliberately uses the same opaque
            treatment rather than a blur, since blurring over the persistent
            animated canvas field (src/components/field/QuantumField.tsx)
            would force a recomposite on every scroll frame. See
            Navbar.tsx's own comment for the full rationale. */}
        <div className="sticky top-16 z-10 -mx-4 bg-surface px-4 py-3 sm:mx-0 sm:px-0">
          <label className="block">
            <span className="sr-only">Filter glossary terms</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Filter ${terms.length} terms…`}
              className="w-full rounded-[--radius-tight] border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-subtle-foreground focus-visible:outline-none focus-visible:border-pillar-accent"
            />
          </label>
          <p className="mt-2 tech-label">
            {filtered.length === terms.length ? `${terms.length} terms` : `${filtered.length} of ${terms.length} terms`}
          </p>

          {/* Mobile alphabet strip — same anchors as the desktop rail, in a
              horizontally scrolling row contained by its own overflow-x-auto
              so it can never cause page-level horizontal scroll. */}
          <div className="mt-2 -mx-1 flex gap-0.5 overflow-x-auto px-1 lg:hidden" aria-label="Jump to letter">
            {ALPHABET.map((letter) =>
              presentLetters.has(letter) ? (
                <a
                  key={letter}
                  href={`#${letterAnchorId(letter)}`}
                  className="tech-value flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs text-muted-foreground hover:bg-surface-muted hover:text-pillar-text"
                >
                  {letter}
                </a>
              ) : (
                <span
                  key={letter}
                  aria-hidden="true"
                  className="tech-value flex h-6 w-6 shrink-0 items-center justify-center text-xs text-subtle-foreground/30"
                >
                  {letter}
                </span>
              )
            )}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-2">
            {[...groups.entries()].map(([letter, letterTerms]) => (
              <section key={letter} aria-labelledby={letterAnchorId(letter)}>
                <div id={letterAnchorId(letter)} className="scroll-mt-40 flex items-baseline gap-3 border-b border-border pb-1.5 pt-8 first:pt-4">
                  <h2 className="font-display text-2xl font-semibold text-pillar-text">{letter}</h2>
                  <span className="tech-label">
                    {letterTerms.length} term{letterTerms.length === 1 ? "" : "s"}
                  </span>
                </div>

                <dl className="divide-y divide-border">
                  {letterTerms.map((term) => {
                    const coveredIn = term.lessonSlugs
                      .map((slug) => ({ slug, title: lessonTitles[slug] }))
                      .filter((lesson): lesson is { slug: string; title: string } => Boolean(lesson.title));
                    const visual = pillarVisual(term.pillar);

                    return (
                      <div key={term.id} id={term.id} data-pillar={term.pillar} className="scroll-mt-40 py-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <dt className="font-display text-lg font-semibold tracking-tight text-foreground">
                            {term.title}
                          </dt>
                          <span
                            aria-label={PILLAR_LABEL[term.pillar]}
                            className="shrink-0 rounded-full border border-pillar-edge bg-pillar-wash px-2.5 py-0.5 text-[0.6875rem] font-medium uppercase tracking-wide text-pillar-text"
                          >
                            {visual.short}
                          </span>
                        </div>
                        <dd className="mt-1.5 max-w-[42rem] text-sm leading-relaxed text-muted-foreground">
                          {term.definition}
                        </dd>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                          {coveredIn.map((lesson) => (
                            <Link
                              key={lesson.slug}
                              href={`/lessons/${lesson.slug}`}
                              className="text-sm text-pillar-text underline decoration-pillar-edge underline-offset-2 hover:decoration-pillar-accent"
                            >
                              {lesson.title}
                            </Link>
                          ))}
                          {term.simulatorId ? (
                            <Link
                              href={simulatorHref(term.simulatorId)}
                              className="text-sm text-foreground underline decoration-border underline-offset-2 hover:text-pillar-text hover:decoration-pillar-accent"
                            >
                              Try the simulator
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </dl>
              </section>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">No terms match &ldquo;{query}&rdquo;.</p>
        )}
      </div>
    </div>
  );
}
