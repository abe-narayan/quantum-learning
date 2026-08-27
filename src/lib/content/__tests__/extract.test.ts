import { describe, expect, it } from "vitest";
import { compareSlugs, extractObjectLiteral, findMatchingBrace } from "../../../../scripts/lib/extract.mjs";

/**
 * `scripts/lib/extract.mjs` backs all three generators (search index, lesson
 * registry, and their shared walk/extract plumbing), and its whole job is a
 * hand-rolled brace/string/comment scanner over source *text* — exactly the
 * kind of code where an edge case (a brace inside a string, an apostrophe
 * inside a comment) produces a wrong-but-evaluable slice that then ships
 * silently in a generated artifact. These fixtures pin the tricky cases the
 * scanner's own comments claim to handle.
 */
describe("findMatchingBrace", () => {
  it("ignores braces inside string literals", () => {
    const source = '{ a: "}}}", b: \'{\', c: `{}` }';
    expect(findMatchingBrace(source, 0)).toBe(source.length - 1);
  });

  it("is not corrupted by an apostrophe inside a // comment", () => {
    // If the apostrophe flipped the scanner into string state, the real
    // closing brace below would be treated as string content and the scan
    // would run past it.
    const source = "{\n  // don't trip the string tracker\n  a: 1,\n}";
    expect(findMatchingBrace(source, 0)).toBe(source.length - 1);
  });

  it("is not corrupted by an apostrophe inside a /* */ comment", () => {
    const source = "{\n  /* isn't a string */\n  a: 1,\n}";
    expect(findMatchingBrace(source, 0)).toBe(source.length - 1);
  });

  it("does not end the scan early on a } inside a comment", () => {
    const lineComment = "{\n  // } not the end\n  a: 1,\n}";
    expect(findMatchingBrace(lineComment, 0)).toBe(lineComment.length - 1);

    const blockComment = "{\n  /* } still not the end */\n  a: { b: 2 /* } */ },\n}";
    expect(findMatchingBrace(blockComment, 0)).toBe(blockComment.length - 1);
  });

  it("skips escaped quotes inside strings instead of ending the string early", () => {
    const source = '{ a: "she said \\"}\\"", b: 2 }';
    expect(findMatchingBrace(source, 0)).toBe(source.length - 1);
  });

  it("throws on unbalanced braces", () => {
    expect(() => findMatchingBrace("{ a: { b: 1 }", 0)).toThrow(/[Uu]nbalanced/);
    // A close brace hidden forever inside an unterminated comment counts as
    // unbalanced too — the scanner must throw, not return a bogus index.
    expect(() => findMatchingBrace("{ a: 1 // }", 0)).toThrow(/[Uu]nbalanced/);
    expect(() => findMatchingBrace("{ a: 1 /* }", 0)).toThrow(/[Uu]nbalanced/);
  });
});

describe("extractObjectLiteral", () => {
  it("evaluates a realistic lessonMeta-shaped literal, comments and tricky strings included", () => {
    const source = `import type { LessonMeta } from "@/lib/content/types";

export const lessonMeta: LessonMeta = {
  title: "Grover's Algorithm { and } Amplitude Amplification",
  description: "Why it isn't magic — see {N} scaling.",
  course: "quantum-algorithms-i",
  module: "grovers-algorithm",
  order: 2,
  // don't let this comment corrupt the scan
  difficulty: "intermediate",
  estimatedMinutes: 25,
  prerequisites: ["quantum-computing/quantum-algorithms-i/oracles"],
  objectives: [
    /* a } in a block comment */
    "State the O(sqrt(N)) query count",
  ],
  related: [{ slug: "a/b/c", note: "isn't this nice" }],
};

export default function Lesson() {
  return null;
}
`;
    const meta = extractObjectLiteral(source, /lessonMeta[^=]*=\s*\{/, "fixture.mdx", "lessonMeta");
    expect(meta).toEqual({
      title: "Grover's Algorithm { and } Amplitude Amplification",
      description: "Why it isn't magic — see {N} scaling.",
      course: "quantum-algorithms-i",
      module: "grovers-algorithm",
      order: 2,
      difficulty: "intermediate",
      estimatedMinutes: 25,
      prerequisites: ["quantum-computing/quantum-algorithms-i/oracles"],
      objectives: ["State the O(sqrt(N)) query count"],
      related: [{ slug: "a/b/c", note: "isn't this nice" }],
    });
  });

  it("extracts exactly the literal — the rest of the module is never evaluated", () => {
    // The surrounding file throws at module scope; a real import() would
    // explode. Extraction must not.
    const source = 'throw new Error("must never run");\nconst meta = { slug: "ok" };\n';
    expect(extractObjectLiteral(source, /meta\s*=\s*\{/, "fixture.ts", "meta")).toEqual({ slug: "ok" });
  });

  it("throws with the file path when the key pattern does not match", () => {
    expect(() => extractObjectLiteral("const x = 1;", /meta:\s*\{/, "some/file.ts", "meta")).toThrow(
      /some\/file\.ts.*could not find meta/
    );
  });

  it("throws when the extracted slice is not evaluable", () => {
    expect(() => extractObjectLiteral("const meta = { a: oops.bar };", /meta\s*=\s*\{/, "f.ts", "meta")).toThrow(
      /f\.ts: failed to evaluate meta/
    );
  });
});

describe("compareSlugs", () => {
  it("is a strict code-unit ordering, not a locale collation", () => {
    expect(compareSlugs("a", "b")).toBe(-1);
    expect(compareSlugs("b", "a")).toBe(1);
    expect(compareSlugs("same", "same")).toBe(0);

    // Code units put every uppercase letter before every lowercase letter
    // ("Z" is 0x5A, "a" is 0x61) — ICU collations do the opposite. This is
    // the exact divergence that made localeCompare-ordered generated files
    // differ between machines.
    expect(compareSlugs("Z", "a")).toBe(-1);
    // "-" (0x2D) sorts before alphanumerics in code units; many locale
    // collations treat it as ignorable punctuation.
    expect(compareSlugs("a-b", "ab")).toBe(-1);
    // Prefix sorts before its extension.
    expect(compareSlugs("qft", "qft-of-zero")).toBe(-1);
  });

  it("sorts a slug list identically to the default JS string sort", () => {
    const slugs = ["b/z", "B/a", "a-b/c", "ab/c", "a/b"];
    // Array.prototype.sort with no comparator is already code-unit ordering;
    // compareSlugs exists to make that explicit (and to never fall back to
    // localeCompare). The two must agree exactly.
    expect([...slugs].sort(compareSlugs)).toEqual([...slugs].sort());
  });
});
