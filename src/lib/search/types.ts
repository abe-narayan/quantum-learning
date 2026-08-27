import type { Pillar } from "@/lib/content/types";

export type SearchEntryType = "term" | "lesson" | "problem" | "simulator" | "course" | "track";

/** A single flat entry in the site-wide search index.
 *
 *  Most entries are pre-built at build time into `public/search-index.json`
 *  (see `buildSearchIndex` in ./index.ts). `type: "term"` entries are the one
 *  exception — they're derived in the browser from the glossary module, lazily,
 *  the first time search is opened (see ./glossaryEntries.ts for why). */
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
};
