"use client";

import { useMemo, useState } from "react";
import { PILLARS } from "@/lib/content/curriculum";
import type { Pillar } from "@/lib/content/types";
import type { CurrentQuantumCategory, CurrentQuantumEntry } from "@/lib/content/currentQuantum/types";
import { cn } from "@/lib/utils";
import { CurrentQuantumCard } from "./CurrentQuantumCard";
import { CATEGORY_META } from "./categoryIcons";
import { entryPillar } from "./entryPillar";
import { daysBetween, entryYear, spineGapPx } from "./dateUtils";

type CategoryFilter = "all" | CurrentQuantumCategory;
type PillarFilter = "all" | Pillar;

const CATEGORY_OPTIONS: CategoryFilter[] = [
  "all",
  "hardware milestone",
  "algorithms",
  "error correction",
  "quantum networking",
  "sensing",
  "historical experiment",
  "cryptography",
];

// `min-h-11` rather than a transparent `::after` touch-floor: these chips wrap
// onto several rows with only `gap-2` (8px) between them, so inflating the hit
// area past the painted box by ~9px a side would make vertically adjacent
// chips steal each other's taps. Growing the chip itself is the version that
// is honest about where the target is.
//
// The `focus-visible:ring-*` chain is not decoration either: this rule used to
// end at `focus-visible:outline-none` with nothing replacing the outline, so a
// keyboard user tabbing through fifteen filters had no visible focus at all.
const FILTER_CHIP =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-colors duration-(--dur-fast) ease-instrument focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const FILTER_CHIP_ACTIVE = "border-pillar-edge bg-pillar-wash text-pillar-text";
const FILTER_CHIP_IDLE =
  "border-border bg-surface text-muted-foreground hover:border-border-strong hover:bg-surface-muted hover:text-foreground";

/**
 * The primary structure for `/current-quantum`: a real chronological spine
 * (newest first, matching the page's own "reverse-chronological" copy)
 * rather than a card grid, so the field's accelerating pace is something the
 * reader scrolls through rather than something a paragraph has to assert.
 * Vertical spacing between entries is derived from the real gap in days
 * between their dates (see `spineGapPx`) — clustered recent entries read as
 * dense, the multi-decade stretch to Bell (1964) and Feynman (1981) reads as
 * empty spine.
 *
 * Two independent, AND-combined filters sit above it: category (the *kind*
 * of result — icon plus text, never color alone) and curriculum area (which
 * pillar the linked lesson belongs to — the two-directional link this whole
 * page exists for). Both are plain `<button aria-pressed>` chips, reachable
 * and operable by keyboard with no custom key handling needed.
 */
export function CurrentQuantumCatalog({
  entries,
  lessonTitles,
}: {
  entries: CurrentQuantumEntry[];
  /** Real lesson slug -> real lesson title, sourced from getAllLessonsMeta() on the server. */
  lessonTitles: Record<string, string>;
}) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [pillar, setPillar] = useState<PillarFilter>("all");

  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      if (category !== "all" && entry.category !== category) return false;
      if (pillar !== "all" && entryPillar(entry) !== pillar) return false;
      return true;
    });
  }, [entries, category, pillar]);

  const mostRecentSlug = entries[0]?.slug;

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-x-10">
        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="tech-label p-0">Category</legend>
          <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {CATEGORY_OPTIONS.map((option) => {
              const isActive = category === option;
              const meta = option === "all" ? null : CATEGORY_META[option];
              const Icon = meta?.Icon;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setCategory(option)}
                  className={cn(FILTER_CHIP, isActive ? FILTER_CHIP_ACTIVE : FILTER_CHIP_IDLE)}
                >
                  {Icon ? <Icon aria-hidden="true" data-decorative="" className="h-3.5 w-3.5" /> : null}
                  {option === "all" ? "All" : meta!.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="tech-label p-0">Track</legend>
          <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-label="Filter by track">
            <button
              type="button"
              aria-pressed={pillar === "all"}
              onClick={() => setPillar("all")}
              className={cn(FILTER_CHIP, pillar === "all" ? FILTER_CHIP_ACTIVE : FILTER_CHIP_IDLE)}
            >
              All
            </button>
            {PILLARS.map((p) => (
              <button
                key={p.slug}
                type="button"
                data-pillar={p.slug}
                aria-pressed={pillar === p.slug}
                onClick={() => setPillar(p.slug)}
                className={cn(FILTER_CHIP, pillar === p.slug ? FILTER_CHIP_ACTIVE : FILTER_CHIP_IDLE)}
              >
                <span aria-hidden="true" data-decorative="" className="h-2 w-2 shrink-0 rounded-full bg-pillar-strong" />
                {p.title.replace(/^Quantum /, "")}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-9 flex items-baseline justify-between gap-4 border-b border-border pb-3">
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">Timeline</h2>
        <p className="tech-label text-subtle-foreground">
          {filtered.length} development{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      {filtered.length > 0 ? (
        <ol className="relative mt-8 border-l border-border pl-7 sm:pl-9">
          {filtered.map((entry, index) => {
            const previous = filtered[index - 1];
            const gap = previous ? spineGapPx(daysBetween(previous.date, entry.date)) : 0;
            const year = entryYear(entry.date);
            const showYearMarker = !previous || entryYear(previous.date) !== year;
            const entryPillarSlug = entryPillar(entry);

            return (
              <li key={entry.slug} style={index > 0 ? { marginTop: `${gap}px` } : undefined}>
                {showYearMarker ? (
                  <div aria-hidden="true" data-decorative="" className="mb-3 -ml-7 flex items-center gap-2 sm:-ml-9">
                    <span className="tech-value text-xs text-subtle-foreground">{year}</span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                ) : null}
                <div className="relative">
                  <span
                    aria-hidden="true"
                    data-decorative=""
                    data-pillar={entryPillarSlug}
                    className="absolute -left-7 top-3 h-2.5 w-2.5 rounded-full bg-pillar-strong ring-4 ring-background sm:-left-9"
                  />
                  <CurrentQuantumCard
                    id={entry.slug}
                    entry={entry}
                    lessonTitle={lessonTitles[entry.relatedLessonSlug]}
                    featured={entry.slug === mostRecentSlug}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="mt-10 text-sm text-muted-foreground">No developments match these filters yet.</p>
      )}
    </div>
  );
}
