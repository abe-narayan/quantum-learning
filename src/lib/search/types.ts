import type { Pillar } from "@/lib/content/types";

export type SearchEntryType = "term" | "lesson" | "problem" | "simulator" | "course" | "track";

/** A single flat entry in the site-wide search index.
 *
 *  Every entry, `type: "term"` included, is pre-built at build time into
 *  `public/search-index.json` (see `buildSearchIndex` in ./index.ts) and
 *  fetched from there lazily the first time search is opened. This comment
 *  used to name a `./glossaryEntries.ts` that derived the glossary rows in the
 *  browser instead; that file is gone, and deliberately — it was the one
 *  chain by which `lib/content/glossary.ts` reached a client bundle, which is
 *  why `src/lib/design/__tests__/clientBoundary.test.ts` now lists that module
 *  as server-only outright. */
export type SearchEntry = {
  type: SearchEntryType;
  title: string;
  description: string;
  /** A real, working route — never fabricated. */
  href: string;
  pillar?: Pillar;
  /**
   * Human-readable name of the course this entry belongs to, when it belongs
   * to one (lessons and problems do; simulators, glossary terms and the course
   * entries themselves don't). Shown in the result row so a reader can tell
   * two similarly-titled lessons apart *before* clicking — "Bell States" in
   * "Entanglement" is a different page from "Bell States" in "Quantum
   * Cryptography". Optional so an older generated `search-index.json` (built
   * before this field existed) still parses.
   */
  course?: string;
  /**
   * A bounded, space-separated set of the terms this entry's *body* teaches —
   * section headings, bolded terms, `<Term>` links, learning objectives, the
   * hyphenated compounds physics writes, and a word apiece for notation a
   * beginner cannot spell. Lessons only; see `lib/search/lessonKeywords.ts`
   * for how it is extracted, why it is a term set rather than the body, and
   * why problems deliberately have none.
   *
   * Matched in a band strictly below description (`SCORE_KEYWORD_ONLY` in
   * ./match.ts), so it can only ever add answers underneath the ones the
   * index already had. Optional, like `course`, so an index generated before
   * the field existed still parses and simply matches nothing extra.
   */
  keywords?: string;
  /**
   * How many times the lesson corpus links to this glossary entry, via
   * `<Term id="...">`. Terms only, ranking only, never rendered.
   *
   * It settles ties, and the tie is real. A reader who types a bare surname
   * wants the mainline idea: `Dirac` should lead with Dirac Notation, not the
   * Dirac delta; `Grover` with Grover's Algorithm, not the Grover diffusion
   * operator. Both members of each pair score identically, because the query
   * is a whole word at the front of both titles, so before this field the
   * last tie-break decided them and that tie-break is alphabetical: `Delta`
   * beat `Notation`, and `Diffusion` beat the apostrophe in `Grover's`. The
   * alphabet is not relevance, and the ten glossary entries added this sprint
   * exposed it by landing on the wrong side of it twice.
   *
   * Two other signals were tried first and are recorded here so nobody
   * reaches for them again. Difficulty does not discriminate: both Dirac
   * entries are `foundational`, both Grover entries `intermediate`. Degree in
   * `TERM_RELATIONS` discriminates backwards, because a newly authored entry
   * arrives with a generous relation list while an old central one accreted
   * few (Dirac Delta 5 against Dirac Notation 3). Both measure how the
   * glossary was *written*. Link count measures what the curriculum actually
   * leans on, which is the thing a reader's bare query is asking after.
   *
   * Zero is the common case and is not a defect: a term no lesson links to
   * simply falls through to the alphabetical tie-break exactly as before.
   * Optional, so an index generated before the field existed still parses.
   */
  linkCount?: number;
};
