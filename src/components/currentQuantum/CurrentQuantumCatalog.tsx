"use client";

import { useMemo, useState } from "react";
import { FilterChips, type FilterOption } from "@/components/curriculum/FilterChips";
import { PILLARS } from "@/lib/content/curriculum";
import { PILLAR_ORDER, pillarVisual } from "@/lib/design/pillars";
import type { Pillar } from "@/lib/content/types";
import type { CurrentQuantumCategory, CurrentQuantumEntry } from "@/lib/content/currentQuantum/types";
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

/**
 * ------------------------------------------------------------
 * Why these two rows are `FilterChips` and not their own control
 * ------------------------------------------------------------
 * This page used to ship the only second implementation of the site's filter
 * row: its own `FILTER_CHIP` class strings inside a `<fieldset>` whose
 * `<legend>` said "Category", wrapping a `<div role="group"
 * aria-label="Filter by category">`. A `<fieldset>` already exposes an
 * implicit `group` role named by its legend, so the nested `role="group"` made
 * a second, differently-named group inside the first and a screen reader
 * announced "Category, group" and then "Filter by category, group" for one
 * control. Both rows on this page did it, and `/problems`, `/lessons` and
 * `/learn` all render the identical control as a bare `<div role="group">`
 * through `FilterChips`.
 *
 * Rather than fix the double naming in place and keep two implementations of
 * one thing, both rows now go through `FilterChips`. That resolves the
 * announcement (one group, one name), and the page picks up three things it
 * did not have: the filled-vs-hollow disc, so the selected chip is a shape and
 * not only a tint; a per-option count, which matters more here than anywhere
 * else on the site because these two filters combine with AND and can be
 * pushed into an empty intersection; and one 44px chip definition instead of a
 * second.
 *
 * What is lost is the small pillar-hued dot the Track row carried, exactly as
 * when `/problems` made the same swap: the count is the better use of that
 * slot, and the dot was decorative color. The category icons are kept, through
 * `FilterOption.icon`.
 */

/**
 * The primary structure for `/current-quantum`: a real chronological spine
 * (newest first, matching the page's own "reverse-chronological" copy)
 * rather than a card grid, so the field's accelerating pace is something the
 * reader scrolls through rather than something a paragraph has to assert.
 * Vertical spacing between entries is derived from the real gap in days
 * between their dates (see `spineGapPx`), clustered recent entries read as
 * dense, the multi-decade stretch to Bell (1964) and Feynman (1981) reads as
 * empty spine.
 *
 * Two independent, AND-combined filters sit above it: category (the *kind*
 * of result, icon plus text, never color alone) and curriculum area (which
 * pillar the linked lesson belongs to, the two-directional link this whole
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

  // Each row's counts are computed against the *other* filter, the same rule
  // `LessonIndex` and `ProblemsCatalog` use: "Sensing 0" has to mean "0 given
  // what else you have picked", which is the only reading that helps someone
  // about to walk into the empty intersection these AND-combined filters can
  // produce.
  const categoryOptions: FilterOption<CategoryFilter>[] = useMemo(() => {
    const base = entries.filter((entry) => pillar === "all" || entryPillar(entry) === pillar);
    return CATEGORY_OPTIONS.map((option) => {
      const meta = option === "all" ? null : CATEGORY_META[option];
      const Icon = meta?.Icon;
      return {
        id: option,
        label: meta ? meta.label : "All",
        count: option === "all" ? base.length : base.filter((entry) => entry.category === option).length,
        icon: Icon ? <Icon aria-hidden="true" data-decorative="" className="h-3.5 w-3.5 shrink-0" /> : undefined,
      };
    });
  }, [entries, pillar]);

  const pillarOptions: FilterOption<PillarFilter>[] = useMemo(() => {
    const base = entries.filter((entry) => category === "all" || entry.category === category);
    return [
      { id: "all" as PillarFilter, label: "All", count: base.length },
      // Only tracks that have an entry *in the whole corpus*. Two of the six
      // (Mechanics and Apex) have none, and both rendered as a chip reading
      // "0 developments" in the page's first screen at 1440 — a control whose
      // only possible outcome is the empty state, offered before the reader
      // has done anything wrong. The test is against `entries`, deliberately,
      // not against `base`: computing it from the filtered set would make
      // chips appear and vanish as the *other* row is used, which is a worse
      // failure than a dead chip. The per-chip `count` below still reads from
      // `base`, so the numbers keep answering "how many if I pick this, given
      // what else you have picked".
      ...PILLAR_ORDER.filter((slug) =>
        entries.some((entry) => entryPillar(entry) === slug),
      ).map((slug) => ({
        id: slug as PillarFilter,
        // The short pillar name, from the site's one source for it. This row
        // was already the short form by hand (`p.title.replace(/^Quantum /,
        // "")`), which is the vocabulary /problems and /lessons have now
        // adopted — reading it from `pillarVisual` means the three rows cannot
        // drift apart again.
        label: pillarVisual(slug).short,
        count: base.filter((entry) => entryPillar(entry) === slug).length,
      })),
    ];
  }, [entries, category]);

  const mostRecentSlug = entries[0]?.slug;
  const isFiltered = category !== "all" || pillar !== "all";

  // The two active choices in the reader's own words, or `null` where a
  // filter is off, so the empty state below can name exactly what it has to
  // name and nothing else.
  const categoryLabel = category === "all" ? null : CATEGORY_META[category].label;
  const trackLabel =
    pillar === "all" ? null : (PILLARS.find((entry) => entry.slug === pillar)?.title ?? pillar);

  function clearFilters() {
    setCategory("all");
    setPillar("all");
  }

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-x-10">
        <FilterChips
          label="Category"
          countNoun="developments"
          options={categoryOptions}
          selected={category}
          onChange={setCategory}
        />
        <FilterChips
          label="Track"
          countNoun="developments"
          options={pillarOptions}
          selected={pillar}
          onChange={setPillar}
        />
      </div>

      <div className="mt-9 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-border pb-3">
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">Timeline</h2>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          {/* `role="status"` + `aria-live`: fifteen filter chips repaint this
              list silently otherwise, so a screen-reader user pressed a chip
              and got no confirmation that anything had happened, let alone how
              much was left. Mounted from first paint (the reliability
              condition a live region needs), so only the semantics were
              missing. */}
          <p role="status" aria-live="polite" className="tech-label text-subtle-foreground">
            {isFiltered
              ? `${filtered.length} of ${entries.length} developments`
              : `${filtered.length} development${filtered.length === 1 ? "" : "s"}`}
          </p>
          {isFiltered ? (
            // The visible label drops the noun because it sits inches from
            // "N of M developments" and repeating it would be noise. Out of
            // that context it is just "Show all 24", so the accessible name
            // puts the noun back. The visible words stay the leading run of
            // the name, which is what WCAG 2.5.3 (Label in Name) requires and
            // what lets a voice-control user say "show all 24" and be heard.
            <button
              type="button"
              onClick={clearFilters}
              aria-label={`Show all ${entries.length} developments`}
              className="min-h-11 text-xs font-medium text-pillar-text underline decoration-pillar-edge underline-offset-4 transition-colors duration-(--dur-fast) hover:decoration-pillar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Show all {entries.length}
            </button>
          ) : null}
        </div>
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
        // A dead end with no way out is what this used to be: one grey line
        // saying nothing matched, on a page whose two filters combine with AND
        // and can easily be pushed into an empty intersection. The reader is
        // told which choices produced it and given the one button that
        // undoes them.
        //
        // Only the choices that are actually *on* are named. The earlier
        // version printed both halves unconditionally and filled an inactive
        // one with a placeholder, which produced "No developments are both in
        // any category and in Quantum Computing" for a single-filter miss, and
        // "...both in any category and in any track" on the one path that
        // reaches here with nothing filtered at all (an empty `entries`), a
        // sentence that blames two filters the reader never touched. Each
        // branch below is a sentence someone would write.
        //
        // The named choices are `font-medium` as well as tinted: they are the
        // words the reader has to recognise as their own input, and colour
        // alone is not a channel this site relies on.
        <div className="mt-10 max-w-prose">
          <p className="text-sm text-foreground">
            {categoryLabel && trackLabel ? (
              <>
                Nothing on the timeline is both{" "}
                <span className="font-medium text-pillar-text">{categoryLabel}</span> and connected
                to a <span className="font-medium text-pillar-text">{trackLabel}</span> lesson.
              </>
            ) : categoryLabel ? (
              <>
                Nothing on the timeline is filed under{" "}
                <span className="font-medium text-pillar-text">{categoryLabel}</span>.
              </>
            ) : trackLabel ? (
              <>
                Nothing on the timeline connects to a{" "}
                <span className="font-medium text-pillar-text">{trackLabel}</span> lesson.
              </>
            ) : (
              <>There is nothing on the timeline yet.</>
            )}
          </p>
          {isFiltered ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-(--radius-tight) border border-pillar-edge bg-pillar-wash px-4 text-sm font-medium text-pillar-text transition-colors duration-(--dur-fast) ease-instrument hover:border-pillar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Show all {entries.length} developments
              <span aria-hidden="true">→</span>
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
