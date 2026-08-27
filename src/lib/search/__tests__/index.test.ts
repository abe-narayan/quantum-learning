import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { Course, LessonMetaWithSlug } from "@/lib/content/types";
import type { ProblemMeta } from "@/lib/problems/types";
import { GLOSSARY_TERMS, type GlossaryTerm } from "@/lib/content/glossary";
import { START_LEARNING_HREF } from "@/lib/nav";
import { buildSearchIndex } from "../index";
import type { SearchEntry } from "../types";

const COURSES: Course[] = [
  {
    slug: "qubits-and-quantum-states",
    pillar: "quantum-computing",
    title: "Qubits and Quantum States",
    description: "The first course.",
    difficulty: "foundational",
    estimatedHours: 6,
    prerequisites: [],
    modules: [{ slug: "intro", title: "Intro" }],
  },
];

const LESSONS: LessonMetaWithSlug[] = [
  {
    slug: "quantum-computing/qubits-and-quantum-states/what-is-a-qubit",
    title: "What Is a Qubit?",
    description: "The first lesson.",
    course: "qubits-and-quantum-states",
    module: "intro",
    order: 1,
    difficulty: "foundational",
    estimatedMinutes: 20,
    prerequisites: [],
    objectives: ["Know what a qubit is."],
  },
];

const PROBLEMS = [
  {
    slug: "qubit-basics-1",
    title: "Qubit Basics",
    course: "qubits-and-quantum-states",
    difficulty: "beginner",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["qubit", "superposition"],
  },
] as unknown as ProblemMeta[];

// A real entry rather than a hand-written literal: `GlossaryTerm` gains
// fields as the glossary grows (`level`, `relatedIds`, …), and a fixture that
// restates its shape would break on every one of those without saying
// anything true about search. Only `id`/`title`/`definition`/`pillar` are
// read here, and those are stable.
const TERMS: GlossaryTerm[] = [GLOSSARY_TERMS[0]];

describe("buildSearchIndex", () => {
  const index = buildSearchIndex(LESSONS, PROBLEMS, COURSES, TERMS);

  function find(type: SearchEntry["type"]) {
    const entry = index.find((candidate) => candidate.type === type);
    if (!entry) throw new Error(`no ${type} entry produced`);
    return entry;
  }

  it("gives every entry a non-empty title, description and href", () => {
    expect(index.length).toBeGreaterThan(0);
    for (const entry of index) {
      expect(entry.title.trim()).not.toBe("");
      expect(entry.description.trim()).not.toBe("");
      expect(entry.href.startsWith("/")).toBe(true);
    }
  });

  it("labels a lesson with the course it lives in, so two same-named lessons are distinguishable", () => {
    const lesson = find("lesson");
    expect(lesson.course).toBe("Qubits and Quantum States");
    expect(lesson.pillar).toBe("quantum-computing");
    expect(lesson.href).toBe(`/lessons/${LESSONS[0].slug}`);
  });

  it("labels a problem with its course too", () => {
    const problem = find("problem");
    expect(problem.course).toBe("Qubits and Quantum States");
    expect(problem.href).toBe("/problems/qubit-basics-1");
  });

  it("points a course entry at its own page, never at the pillar landing page", () => {
    const course = find("course");
    expect(course.href).toBe("/courses/qubits-and-quantum-states");
  });

  it("leaves `course` unset for entries that don't belong to one", () => {
    expect(find("simulator").course).toBeUndefined();
    expect(find("course").course).toBeUndefined();
  });
});

describe("glossary terms in the index", () => {
  it("points a term at its `/glossary#<id>` anchor, carrying the full definition", () => {
    const index = buildSearchIndex(LESSONS, PROBLEMS, COURSES, TERMS);
    const term = index.find((entry) => entry.type === "term");
    expect(term).toEqual({
      type: "term",
      title: TERMS[0].title,
      description: TERMS[0].definition,
      href: `/glossary#${TERMS[0].id}`,
      pillar: TERMS[0].pillar,
    });
  });
});

describe("the generated search index", () => {
  // Read rather than rebuilt: this is the file the browser actually fetches.
  async function readGeneratedIndex(): Promise<SearchEntry[]> {
    const raw = await readFile(path.join(process.cwd(), "public/search-index.json"), "utf8");
    return JSON.parse(raw) as SearchEntry[];
  }

  it("contains a real entry for the navbar's 'Start learning' target", async () => {
    // The site's most-clicked button hardcodes one lesson route
    // (START_LEARNING_HREF in src/lib/nav.ts). If that lesson is ever moved
    // or renamed, this fails instead of the button shipping a 404.
    const entries = await readGeneratedIndex();
    const match = entries.find((entry) => entry.href === START_LEARNING_HREF);
    expect(match, `no lesson at ${START_LEARNING_HREF}`).toBeDefined();
    expect(match?.type).toBe("lesson");
  });

  it("carries every glossary term, so a bare one-word query can be answered", async () => {
    // The whole point of the glossary being in search: a newcomer's most
    // common query is a word, not a lesson title. If the checked-in index
    // ever regenerates without them, this fails loudly.
    const entries = await readGeneratedIndex();
    const termEntries = entries.filter((entry) => entry.type === "term");
    expect(termEntries.length).toBeGreaterThan(100);

    // Asserted as a subset rather than an exact match with GLOSSARY_TERMS:
    // the glossary grows independently of when this artifact was last
    // regenerated (`predev`/`prebuild`/`pretest` do it), and a *newer*
    // glossary than the checked-in index is a stale artifact, not a bug in
    // the index. A term href that points at no real entry is a bug, and is
    // what this checks.
    const realIds = new Set(GLOSSARY_TERMS.map((term) => term.id));
    for (const entry of termEntries) {
      const id = entry.href.replace("/glossary#", "");
      expect(realIds.has(id), `search index points at unknown glossary id "${id}"`).toBe(true);
    }
  });

  it("has no duplicate hrefs within a kind", async () => {
    const entries = await readGeneratedIndex();
    const seen = new Set<string>();
    for (const entry of entries) {
      const key = `${entry.type}::${entry.href}`;
      expect(seen.has(key), `duplicate ${key}`).toBe(false);
      seen.add(key);
    }
  });
});
