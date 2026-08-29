import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  assertPlainData,
  compareSlugs,
  extractObjectLiteral,
  findMatchingBrace,
  walk,
  writeGenerated,
  LESSON_META_KEY_RE,
  PROBLEM_META_KEY_RE,
} from "../lib/extract.mjs";

/**
 * Direct coverage of the extraction layer under `scripts/lib/extract.mjs`.
 *
 * Everything in the generated-artifact pipeline rests on a hand-rolled
 * brace/string/comment scanner over source *text*, and the whole class of bug
 * it can have is the silent one: a wrong-but-evaluable slice that produces a
 * plausible-looking `lessonMeta.generated.ts` with the wrong fields, or a
 * lesson quietly absent from search, behind a completely green build. Until
 * these suites existed the scanner was only covered indirectly, downstream,
 * by drift tests that compare two generated artifacts to each other — which
 * cannot see a hazard that corrupts both the same way.
 *
 * The fixtures below are deliberately the hazards the corpus can plausibly
 * grow into (LaTeX backslashes, braces inside prose, template literals,
 * comments containing apostrophes and braces), not synthetic parser puzzles.
 *
 * See also `scripts/__tests__/crossGenerator.test.ts`, which runs the real
 * patterns against the real 219-lesson / 547-problem corpus.
 */
describe("findMatchingBrace: string and comment state", () => {
  it("ignores braces inside all three quote styles", () => {
    const source = '{ a: "}}}", b: \'{\', c: `{}` }';
    expect(findMatchingBrace(source, 0)).toBe(source.length - 1);
  });

  it("skips escaped quotes rather than ending the string early", () => {
    const source = '{ a: "she said \\"}\\"", b: 2 }';
    expect(findMatchingBrace(source, 0)).toBe(source.length - 1);
  });

  it("survives LaTeX-dense strings: backslashes, braces, and a trailing escape", () => {
    // Lesson metadata routinely quotes math inline. Every one of these
    // sequences is a `\` immediately followed by something the scanner cares
    // about — a quote, a brace, another backslash — which is exactly where an
    // off-by-one in the escape skip shows up.
    const source = String.raw`{ note: "\\langle \\psi | \\hat{H} | \\psi \\rangle = \\frac{1}{2}", tail: "ends with a backslash: \\" }`;
    expect(findMatchingBrace(source, 0)).toBe(source.length - 1);
    expect(extractObjectLiteral(`const m = ${source};`, /m\s*=\s*\{/, "f.ts", "m")).toEqual({
      note: String.raw`\langle \psi | \hat{H} | \psi \rangle = \frac{1}{2}`,
      tail: "ends with a backslash: \\",
    });
  });

  it("is not corrupted by apostrophes or braces inside comments", () => {
    const line = "{\n  // don't stop at this }\n  a: 1,\n}";
    expect(findMatchingBrace(line, 0)).toBe(line.length - 1);

    const block = "{\n  /* isn't a string, and } isn't the end */\n  a: { b: 2 /* } */ },\n}";
    expect(findMatchingBrace(block, 0)).toBe(block.length - 1);
  });

  it("does not treat a // inside a string as a comment", () => {
    // Every `creditUrl` in the corpus is an https:// URL. If the comment
    // check ran before the string check, the scan would swallow the rest of
    // the line — including a closing brace on it.
    const source = '{ creditUrl: "https://upload.wikimedia.org/a.png" }';
    expect(findMatchingBrace(source, 0)).toBe(source.length - 1);
  });

  it("handles CRLF sources identically to LF sources", () => {
    // 122 of the 219 lesson files are CRLF. A `//` comment's terminator is
    // found with indexOf("\n"), which lands one past the `\r`; if that were
    // ever changed to a line-ending-sensitive scan, CRLF files would extract
    // differently from LF files with no visible symptom.
    const lf = "{\n  // trailing comment }\n  a: 1,\n}";
    const crlf = lf.replace(/\n/g, "\r\n");
    expect(findMatchingBrace(crlf, 0)).toBe(crlf.length - 1);
    expect(extractObjectLiteral(`const m = ${crlf};`, /m\s*=\s*\{/, "f", "m")).toEqual(
      extractObjectLiteral(`const m = ${lf};`, /m\s*=\s*\{/, "f", "m")
    );
  });

  it("counts braces inside template-literal ${} interpolations as code", () => {
    // A template interpolation is code, not string content. A scanner that
    // treats the whole template as opaque miscounts the moment an
    // interpolation contains a brace — and the miscount is silent, because
    // the slice still evaluates.
    const source = "{ a: `x ${ { b: 1 } } y`, c: 2 }";
    expect(findMatchingBrace(source, 0)).toBe(source.length - 1);
  });

  it("handles quotes and nested templates inside an interpolation", () => {
    const source = "{ a: `${ ['}', \"{\"].join(`-${1}-`) }`, b: 3 }";
    expect(findMatchingBrace(source, 0)).toBe(source.length - 1);
  });

  it("keeps unicode intact and unconfused", () => {
    // Descriptions carry em dashes, ket notation, Greek, and (in the
    // glossary-adjacent text) astral-plane characters. None are brace or
    // quote characters, but a code-unit scanner must not desynchronize on a
    // surrogate pair either.
    const source = '{ t: "α|0⟩ + β|1⟩ — 𝕀 ⊗ 𝕏 {sic}", u: "✓" }';
    expect(findMatchingBrace(source, 0)).toBe(source.length - 1);
    expect(extractObjectLiteral(`const m = ${source};`, /m\s*=\s*\{/, "f", "m")).toEqual({
      t: "α|0⟩ + β|1⟩ — 𝕀 ⊗ 𝕏 {sic}",
      u: "✓",
    });
  });
});

describe("findMatchingBrace: loud failure", () => {
  it("refuses to scan when the given index is not an opening brace", () => {
    // The dangerous version of this bug: with depth starting at 0 and no
    // guard, a scan begun mid-expression latches onto the NEXT `{` in the
    // file and returns that unrelated block's closing brace — a wrong slice
    // that evaluates fine. A key pattern that stops short of its `{` (say,
    // after someone adds an optional type annotation to it) must fail here,
    // not produce another object's data.
    expect(() => findMatchingBrace("meta = { a: 1 }", 0)).toThrow(/expected "\{" at index 0/);
    expect(() => findMatchingBrace("{ a: 1 }", 99)).toThrow(/expected "\{"/);
  });

  it("throws on unbalanced braces instead of returning a best guess", () => {
    expect(() => findMatchingBrace("{ a: { b: 1 }", 0)).toThrow(/[Uu]nbalanced/);
    // A closing brace hidden forever inside an unterminated comment is
    // unbalanced too.
    expect(() => findMatchingBrace("{ a: 1 // }", 0)).toThrow(/[Uu]nbalanced/);
    expect(() => findMatchingBrace("{ a: 1 /* }", 0)).toThrow(/[Uu]nbalanced/);
    // An unterminated string swallows the rest of the file.
    expect(() => findMatchingBrace('{ a: "oops }', 0)).toThrow(/[Uu]nbalanced/);
    // An unclosed interpolation must not be rescued by the template's own
    // closing backtick.
    expect(() => findMatchingBrace("{ a: `x ${ y `, b: 1 }", 0)).toThrow(/[Uu]nbalanced/);
  });
});

describe("extractObjectLiteral", () => {
  const LESSON_FIXTURE = `import type { LessonMeta } from "@/lib/content/types";

export const lessonMeta = {
  title: "Grover's Algorithm { and } Amplitude Amplification",
  description: "Why it isn't magic — the \\\\sqrt{N} scaling, in prose.",
  course: "quantum-algorithms-i",
  module: "grovers-algorithm",
  order: 2,
  // don't let this comment corrupt the scan }
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
  throw new Error("must never run during extraction");
}
`;

  it("extracts a realistic lessonMeta with every hazard at once", () => {
    const meta = extractObjectLiteral(LESSON_FIXTURE, LESSON_META_KEY_RE, "fixture.mdx", "lessonMeta");
    expect(meta).toEqual({
      title: "Grover's Algorithm { and } Amplitude Amplification",
      description: "Why it isn't magic — the \\sqrt{N} scaling, in prose.",
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

  it("never evaluates the surrounding module", () => {
    // The fixture's default export throws at call time and the file imports a
    // `@/...` alias plain Node cannot resolve; a real import() would explode
    // on both counts. Extraction must touch neither.
    expect(() =>
      extractObjectLiteral(LESSON_FIXTURE, LESSON_META_KEY_RE, "fixture.mdx", "lessonMeta")
    ).not.toThrow();
    const source = 'throw new Error("must never run");\nconst meta = { slug: "ok" };\n';
    expect(extractObjectLiteral(source, /meta\s*=\s*\{/, "fixture.ts", "meta")).toEqual({ slug: "ok" });
  });

  it("is deterministic: the same source extracts byte-identically every time", () => {
    // Guards the shared, module-level pattern objects specifically. A regex
    // that carried state between calls (see the global/sticky rejection
    // below) would pass on the first file of a walk and quietly diverge on
    // every one after it — which no single-file test would catch.
    const first = JSON.stringify(
      extractObjectLiteral(LESSON_FIXTURE, LESSON_META_KEY_RE, "fixture.mdx", "lessonMeta")
    );
    for (let i = 0; i < 5; i++) {
      expect(
        JSON.stringify(extractObjectLiteral(LESSON_FIXTURE, LESSON_META_KEY_RE, "fixture.mdx", "lessonMeta"))
      ).toBe(first);
    }
  });

  it("rejects global and sticky key patterns outright", () => {
    // `exec` on /g advances lastIndex and resumes from it next call. Reusing
    // one such pattern across a 547-file walk starts matching mid-file and
    // silently selects a different block (or none) for every file after the
    // first — the exact failure a shared pattern constant would otherwise
    // invite.
    expect(() => extractObjectLiteral("const meta = { a: 1 };", /meta\s*=\s*\{/g, "f.ts", "meta")).toThrow(
      /must not be global or sticky/
    );
    expect(() => extractObjectLiteral("const meta = { a: 1 };", /meta\s*=\s*\{/y, "f.ts", "meta")).toThrow(
      /must not be global or sticky/
    );
    expect(LESSON_META_KEY_RE.global || LESSON_META_KEY_RE.sticky).toBe(false);
    expect(PROBLEM_META_KEY_RE.global || PROBLEM_META_KEY_RE.sticky).toBe(false);
  });

  it("throws — never returns a partial object — on malformed input", () => {
    // Each of these is a file a generator must refuse to skip. A partial or
    // empty return here becomes a lesson missing from search, catalogs, and
    // generateStaticParams behind a green build.
    expect(() => extractObjectLiteral("const x = 1;", PROBLEM_META_KEY_RE, "some/file.ts", "meta")).toThrow(
      /some\/file\.ts.*could not find meta/
    );
    expect(() =>
      extractObjectLiteral("  meta: {\n    slug: \"a\",\n", PROBLEM_META_KEY_RE, "trunc.ts", "meta")
    ).toThrow(/trunc\.ts: could not delimit meta/);
    expect(() =>
      extractObjectLiteral("const meta = { a: oops.bar };", /meta\s*=\s*\{/, "f.ts", "meta")
    ).toThrow(/f\.ts: failed to evaluate meta/);
    // A template interpolation referencing a module-scope binding evaluates
    // in a bare scope and must fail loudly rather than yielding "undefined"
    // stitched into a title.
    expect(() =>
      extractObjectLiteral("const meta = { title: `Part ${COURSE}` };", /meta\s*=\s*\{/, "f.ts", "meta")
    ).toThrow(/f\.ts: failed to evaluate meta/);
  });
});

describe("assertPlainData", () => {
  it("accepts the shapes real metadata uses", () => {
    expect(() =>
      assertPlainData(
        { s: "x", n: 1, b: true, nul: null, undef: undefined, arr: [1, "2", { k: [] }] },
        "meta"
      )
    ).not.toThrow();
  });

  it("rejects what JSON.stringify would silently drop or mangle", () => {
    // This is the guard's whole reason for existing: JSON.stringify writes a
    // function as nothing at all and NaN as null, so a mis-extracted block
    // would ship as a generated file with fields quietly missing.
    expect(() => assertPlainData({ fn: () => 1 }, "meta")).toThrow(/meta\.fn has type "function"/);
    expect(() => assertPlainData({ n: NaN }, "meta")).toThrow(/meta\.n is NaN/);
    expect(() => assertPlainData({ n: Infinity }, "meta")).toThrow(/meta\.n is Infinity/);
    expect(() => assertPlainData({ re: /x/ }, "meta")).toThrow(/meta\.re is a RegExp instance/);
    expect(() => assertPlainData({ d: new Date(0) }, "meta")).toThrow(/meta\.d is a Date instance/);
    expect(() => assertPlainData({ tags: [new Set()] }, "meta")).toThrow(/meta\.tags\[0\] is a Set instance/);
  });

  it("is wired into extractObjectLiteral, with the file path attached", () => {
    expect(() =>
      extractObjectLiteral("const meta = { pattern: /a{2}/ };", /meta\s*=\s*\{/, "bad.ts", "meta")
    ).toThrow(/bad\.ts: meta\.pattern is a RegExp instance/);
  });
});

describe("compareSlugs", () => {
  it("is a strict code-unit ordering, not a locale collation", () => {
    // ICU collations put "a" before "Z" and treat "-" as ignorable; code
    // units do neither. That divergence is what made localeCompare-ordered
    // generated files differ between machines.
    expect(compareSlugs("Z", "a")).toBe(-1);
    expect(compareSlugs("a-b", "ab")).toBe(-1);
    expect(compareSlugs("same", "same")).toBe(0);
    const slugs = ["b/z", "B/a", "a-b/c", "ab/c", "a/b"];
    expect([...slugs].sort(compareSlugs)).toEqual([...slugs].sort());
  });
});

describe("walk", () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "ql-walk-"));
    await writeFile(path.join(dir, "b.mdx"), "");
    await writeFile(path.join(dir, "a.mdx"), "");
    await writeFile(path.join(dir, "a-z.mdx"), "");
    await writeFile(path.join(dir, "ignored.ts"), "");
    await mkdir(path.join(dir, "nested"));
    await writeFile(path.join(dir, "nested", "c.mdx"), "");
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("returns posix slugs, extension-stripped, filtered, and already sorted", async () => {
    // readdir order is filesystem-dependent (NTFS B-tree, ext4 hash), so an
    // unsorted walk would make every generated artifact's element order
    // machine-dependent even though the content is identical.
    const slugs = await walk(dir, ".mdx");
    expect(slugs).toEqual(["a", "a-z", "b", "nested/c"]);
    expect(slugs).toEqual([...slugs].sort(compareSlugs));
  });
});

describe("writeGenerated", () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "ql-write-"));
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("normalizes CRLF to LF so output does not depend on how the repo was checked out", async () => {
    // Every generated file is a template literal (from the .mjs source, whose
    // line endings a core.autocrlf=true checkout rewrites) concatenated with
    // JSON.stringify output (always LF). Without this, such a checkout emits
    // a mixed-ending file against pure-LF committed blobs — a ~200KB
    // whole-file diff carrying no content change.
    const out = path.join(dir, "crlf.ts");
    await writeGenerated(out, "header\r\nline\r\n{\n  \"a\": 1\n}\n");
    const written = await readFile(out, "utf8");
    expect(written).toBe('header\nline\n{\n  "a": 1\n}\n');
    expect(written).not.toContain("\r");
  });

  it("leaves a lone \\r inside data untouched", async () => {
    const out = path.join(dir, "lone-cr.ts");
    await writeGenerated(out, "a\rb\r\nc");
    expect(await readFile(out, "utf8")).toBe("a\rb\nc");
  });

  it("is deterministic and leaves no staging file behind", async () => {
    const out = path.join(dir, "twice.json");
    await writeGenerated(out, '{"a":1}');
    const first = await readFile(out);
    await writeGenerated(out, '{"a":1}');
    expect(await readFile(out)).toEqual(first);

    expect((await readdir(dir)).filter((name) => name.endsWith(".tmp"))).toEqual([]);
  });

  it("reports the destination and the likely cause when the write cannot land", async () => {
    // A generator that swallowed this would leave a stale artifact in place
    // and still print success. The message must name the file and point at
    // the usual Windows culprit (a process holding a handle).
    const out = path.join(dir, "nonexistent-subdir", "x.json");
    await expect(writeGenerated(out, "{}")).rejects.toThrow(/Failed to write .*x\.json/);
  });
});
