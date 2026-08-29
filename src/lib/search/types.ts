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
};
