import type { Pillar } from "@/lib/content/types";

export type SearchEntryType = "lesson" | "problem" | "simulator" | "course";

/** A single flat, pre-built entry in the site-wide search index. */
export type SearchEntry = {
  type: SearchEntryType;
  title: string;
  description: string;
  /** A real, working route — never fabricated. */
  href: string;
  pillar?: Pillar;
};
