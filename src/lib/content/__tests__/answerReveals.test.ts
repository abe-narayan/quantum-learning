import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { LESSON_METAS } from "../lessonMeta.generated";

/**
 * Structural checks on `<details className="answer-reveal">`, the block that
 * holds every worked answer to a practice question.
 *
 * Why this needs its own test. The corpus went from 140 lessons with worked
 * answers to nearly all of them in a single sprint, adding hundreds of these
 * blocks by hand. They are hand-written MDX containing display math, and the
 * three ways to get them wrong are all silent:
 *
 *  1. **A missing `<summary>`.** The block still renders, but the browser
 *     substitutes its own default label ("Details"), so the reader sees a
 *     disclosure widget that does not say it contains the answer. No error.
 *  2. **Wrong indentation.** These blocks live inside a numbered list item, so
 *     their content has to be indented to stay part of that item. Under-indent
 *     it and MDX closes the list, silently moving the answer out of its
 *     question and renumbering everything after it.
 *  3. **An empty or stub body.** A reveal that opens onto two words is worse
 *     than no reveal, because it teaches readers that opening one is not worth
 *     the tap. This is the specific failure mode of writing hundreds of them
 *     under time pressure.
 *
 * `lessonRender.test.ts` catches a block that fails to compile. None of the
 * above fails to compile.
 *
 * It does assert full coverage, but only in the one form that cannot be
 * satisfied by padding: **a lesson that asks practice questions must answer
 * them.** Not "N answers per lesson", not a word count, not a ratio to hit.
 *
 * That rule was not assertable until 2026-08-30. The corpus stood at 140 of
 * 218 lessons, and the gap was not random: it fell at the *end* of five
 * courses in Quantum Mechanics and across almost all of Mastery and Apex, so a
 * reader got worked answers for two thirds of a pillar and then nothing
 * exactly where the material got hardest and they were most alone. On a site
 * with no instructor, no office hours and no answer key anywhere else, an
 * unanswered practice question is a dead end. All 218 now carry answers.
 *
 * Pinning it here is what stops that regressing quietly. It does mean a new
 * lesson with a Practice Questions section must answer them, which is the
 * intended rule: if the answers are not ready, the questions are not ready.
 */

const LESSONS_ROOT = path.join(process.cwd(), "src/content/lessons");

function collectMdx(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...collectMdx(full));
    else if (entry.name.endsWith(".mdx")) found.push(full);
  }
  return found;
}

const files = collectMdx(LESSONS_ROOT).map((file) => ({
  slug: path.relative(LESSONS_ROOT, file).replace(/\\/g, "/").replace(/\.mdx$/, ""),
  source: readFileSync(file, "utf8"),
}));

/** Every `<details … answer-reveal …>` block, with its body and indentation. */
function revealBlocks(source: string) {
  const blocks: { indent: number; body: string; line: number }[] = [];
  const open = /^(\s*)<details\b[^>]*answer-reveal[^>]*>/gm;
  let match: RegExpExecArray | null;
  while ((match = open.exec(source)) !== null) {
    const close = source.indexOf("</details>", match.index);
    if (close === -1) continue;
    blocks.push({
      indent: match[1].replace(/\t/g, "  ").length,
      body: source.slice(match.index + match[0].length, close),
      line: source.slice(0, match.index).split("\n").length,
    });
  }
  return blocks;
}

describe("worked-answer reveals", () => {
  it("scans the whole lesson corpus, so nothing below is vacuous", () => {
    expect(files.length).toBe(LESSON_METAS.length);
    const total = files.reduce((n, f) => n + revealBlocks(f.source).length, 0);
    expect(total, "no answer reveals found at all; the matcher has rotted").toBeGreaterThan(300);
  });

  it("opens and closes every details element exactly once", () => {
    const unbalanced = files
      .filter((f) => {
        const opens = (f.source.match(/<details\b/g) ?? []).length;
        const closes = (f.source.match(/<\/details>/g) ?? []).length;
        const summaries = (f.source.match(/<summary>/g) ?? []).length;
        return opens !== closes || summaries !== opens;
      })
      .map((f) => f.slug);

    expect(
      unbalanced,
      "these lessons have a details element that is unclosed, or a count of " +
        "<summary> that does not match the count of <details>"
    ).toEqual([]);
  });

  it("gives every reveal a summary, so the widget says what it hides", () => {
    const nameless: string[] = [];
    for (const file of files) {
      for (const block of revealBlocks(file.source)) {
        if (!/<summary>\s*\S/.test(block.body)) {
          nameless.push(`${file.slug}:${block.line}`);
        }
      }
    }
    expect(
      nameless,
      "a reveal with no <summary> renders as a widget labelled 'Details', " +
        "which does not tell the reader it holds the answer"
    ).toEqual([]);
  });

  it("indents every reveal so it stays inside its own question", () => {
    // These blocks sit inside a numbered list item. At zero indentation MDX
    // ends the list, which silently moves the answer out from under its
    // question and renumbers every question after it.
    const flush: string[] = [];
    for (const file of files) {
      for (const block of revealBlocks(file.source)) {
        if (block.indent === 0) flush.push(`${file.slug}:${block.line}`);
      }
    }
    expect(
      flush,
      "these reveals start at column 0, so they fall outside the list item " +
        "holding their question. Indent them to match the question text."
    ).toEqual([]);
  });

  it("never opens onto a stub", () => {
    const stubs: string[] = [];
    for (const file of files) {
      for (const block of revealBlocks(file.source)) {
        const prose = block.body
          .replace(/<summary>[\s\S]*?<\/summary>/g, "")
          .replace(/\s+/g, " ")
          .trim();
        if (prose.length < 80) {
          stubs.push(`${file.slug}:${block.line} (${prose.length} chars: ${JSON.stringify(prose.slice(0, 60))})`);
        }
      }
    }
    expect(
      stubs,
      "a reveal this short is not a worked answer. Either write the answer or " +
        "remove the reveal; a disclosure that opens onto nothing teaches the " +
        "reader not to open the next one."
    ).toEqual([]);
  });

  it("answers every lesson that asks practice questions", () => {
    const heading = /^#{2,}\s*Practice Questions?\s*$/m;

    const asking = files.filter((file) => heading.test(file.source));
    expect(
      asking.length,
      "no lesson has a Practice Questions section; the heading matcher has rotted"
    ).toBeGreaterThan(200);

    const unanswered = asking
      .filter((file) => {
        const after = file.source.slice(file.source.search(heading));
        return !after.includes("answer-reveal");
      })
      .map((file) => file.slug);

    expect(
      unanswered,
      "these lessons ask practice questions and answer none of them. There is " +
        "no instructor and no answer key anywhere else on this site, so a " +
        "reader who gets stuck here has nowhere to go. Write the answers, or " +
        "remove the questions until they are ready."
    ).toEqual([]);
  });

  it("keeps display math on its own line inside a reveal", () => {
    // MDX hazard 2, and reveals are where it now most often appears: a `$$`
    // sharing a line with formula content inside a JSX element breaks
    // closing-tag detection.
    const inline: string[] = [];
    for (const file of files) {
      for (const block of revealBlocks(file.source)) {
        for (const [index, line] of block.body.split("\n").entries()) {
          const trimmed = line.trim();
          if (trimmed.startsWith("$$") && trimmed !== "$$" && !trimmed.endsWith("$$")) {
            inline.push(`${file.slug}:${block.line + index} ${JSON.stringify(trimmed.slice(0, 60))}`);
          }
        }
      }
    }
    expect(inline, "a `$$` sharing its line with formula content inside a JSX element breaks closing-tag detection").toEqual([]);
  });
});
