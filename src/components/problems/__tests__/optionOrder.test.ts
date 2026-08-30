import { describe, expect, it } from "vitest";
import { PROBLEMS } from "@/lib/problems/registry.generated";
import type { MultipleChoiceProblem } from "@/lib/problems/types";
import { displayLetters, seededShuffle } from "../optionOrder";

const options = [
  { id: "a", text: "first" },
  { id: "b", text: "second" },
  { id: "c", text: "third" },
  { id: "d", text: "fourth" },
];

/** A varied bank of realistic slugs, for the unit-level properties only. */
const slugs = Array.from({ length: 200 }, (_, i) => `problem-slug-${i}-${(i * 37) % 101}`);

describe("seededShuffle", () => {
  it("is deterministic for the same seed key (hydration safety)", () => {
    for (const slug of slugs.slice(0, 25)) {
      const first = seededShuffle(options, slug);
      const second = seededShuffle(options, slug);
      expect(first.map((o) => o.id)).toEqual(second.map((o) => o.id));
    }
  });

  it("keeps every option intact, same ids, same objects, nothing added or dropped", () => {
    const shuffled = seededShuffle(options, "any-problem-slug");
    expect(shuffled).toHaveLength(options.length);
    expect(new Set(shuffled.map((o) => o.id))).toEqual(new Set(options.map((o) => o.id)));
    for (const option of shuffled) {
      // Same object references: the shuffle reorders, never clones or edits.
      expect(options).toContain(option);
    }
  });

  it("does not mutate the input array", () => {
    const input = [...options];
    seededShuffle(input, "mutation-check");
    expect(input).toEqual(options);
  });

  it("produces different orders across slugs (statistically)", () => {
    const orders = new Set(
      slugs.map((slug) => seededShuffle(options, slug).map((o) => o.id).join("")),
    );
    // 4 options have 24 permutations; 200 slugs should hit a large share of
    // them. A weak seeding (or a constant order) collapses this to 1.
    expect(orders.size).toBeGreaterThan(10);
  });

  it("handles empty and single-item lists", () => {
    expect(seededShuffle([], "slug")).toEqual([]);
    expect(seededShuffle([options[0]], "slug")).toEqual([options[0]]);
  });
});

/**
 * ============================================================
 * The corpus invariant: authoring bias must not reach the reader
 * ============================================================
 *
 * WHAT IS ACTUALLY AT STAKE
 * -------------------------
 * The authored multiple-choice corpus puts the correct answer at index 0 in
 * 110 of 125 problems (88%), at index 1 in 8, at index 2 in 7, and at index 3
 * in **none**. A reader who noticed either half of that would score far above
 * chance without knowing any physics, and the site's practice problems would
 * stop measuring anything.
 *
 * `seededShuffle` is the only thing standing between the authored order and
 * the screen. Nothing else in the codebase can absorb this: the authored bias
 * is allowed (it is how a problem file reads most naturally, correct answer
 * written first), and re-authoring 125 files to hand-randomize them would put
 * the invariant back in human hands where it started.
 *
 * WHY THE PREVIOUS VERSION OF THIS FILE DID NOT GUARD IT
 * -----------------------------------------------------
 * It measured `problem-slug-${i}-${(i * 37) % 101}`. Two hundred synthetic
 * strings, none of which is a slug this site serves, against an `options`
 * fixture of four hand-written stubs. It then asserted:
 *
 *     expect(stillFirst / slugs.length).toBeLessThan(0.5)
 *
 * which is green at 49% leakage, and green for any corpus at all, because it
 * never read one. Delete the shuffle, reseed it, or break it for the slug
 * shapes this site actually uses, and the suite stays green while an 88%
 * giveaway ships. `describe("guard sensitivity")` at the bottom of this file
 * pins that: it constructs a shuffle that leaks 28% of the time, shows the old
 * assertion accepting it, and requires the new audit to reject it.
 *
 * THE BOUNDS, AND WHERE THEY COME FROM
 * ------------------------------------
 * Every bound below is a one-sided 4-sigma band on a binomial proportion, or
 * the chi-square equivalent, and is computed from the corpus size at run time
 * rather than typed in. That matters because the corpus grows (556 problems
 * today, up twice in one day recently): a hardcoded count would need editing
 * on every content change, and a hardcoded *percentage* would silently get
 * looser in sigma terms as N grew. Computed bands do the opposite. They
 * tighten automatically, so the guard gets stronger as the corpus gets bigger
 * and never needs a maintainer to re-derive it.
 *
 *   - 4 sigma one-sided is p ~ 3e-5 per assertion. Across the handful of
 *     assertions here that is a false-failure rate around 1e-4 per corpus
 *     state, which will not flake in this project's lifetime.
 *   - The chi-square omnibus uses df = 3 at alpha = 1e-4, critical value
 *     21.11. Chi-square is already normalized by N, so this single number
 *     stays correct at any corpus size, which is exactly the property a bound
 *     on a growing corpus needs.
 *
 * WHAT WOULD LEGITIMATELY MOVE THEM
 * ---------------------------------
 *   - Changing `fnv1a`, `mulberry32` or the Fisher-Yates loop re-randomizes
 *     every displayed position. The measured values below will change; the
 *     bounds should not. If a new shuffle cannot clear a 4-sigma band, it is
 *     not a uniform shuffle, and that is the finding, not a reason to widen.
 *   - Adding many problems with an option count other than four splits the
 *     corpus into more groups; `POSITION_GROUP_FLOOR` decides which groups are
 *     big enough to test, and the coverage assertion below fails if the
 *     untested remainder ever becomes a meaningful share.
 *   - Genuinely re-authoring the corpus so the correct answer is not
 *     index-heavy would shrink the authored-first group and make the
 *     conditional test uninformative. It would also make the shuffle less
 *     load-bearing, which
 *     is a change worth noticing, so the test would want revisiting rather
 *     than relaxing.
 *
 * MEASURED TODAY (556 problems, 125 multiple-choice, 124 with four options):
 *   authored index of the correct answer   [110, 8, 7, 0]  = 88% / 6% / 6% / 0%
 *   displayed index, four-option problems  [ 31, 26, 33, 34] = 25.0 / 21.0 / 26.6 / 27.4%
 *   chi-square of that, df 3                1.23   (critical 21.11)
 *   authored-first, still displayed first   23 / 109 = 21.1%   (bound 41.6%)
 *   best knowledge-free strategy            28.0%  against a 25.1% baseline
 */

const MC_PROBLEMS = PROBLEMS.filter(
  (problem): problem is MultipleChoiceProblem => problem.answer.type === "multiple-choice",
);

/** One-sided 4-sigma band on a binomial proportion `p` over `n` trials. */
function fourSigma(n: number, p: number): number {
  return 4 * Math.sqrt((p * (1 - p)) / n);
}

/** Chi-square goodness-of-fit statistic against a uniform expectation. */
function chiSquareUniform(counts: readonly number[]): number {
  const total = counts.reduce((sum, count) => sum + count, 0);
  const expected = total / counts.length;
  return counts.reduce((sum, count) => sum + (count - expected) ** 2 / expected, 0);
}

/** Chi-square critical value, df = 3, alpha = 1e-4. */
const CHI2_DF3_ALPHA_1E4 = 21.11;

/** Smallest group of same-option-count problems worth a chi-square. */
const POSITION_GROUP_FLOOR = 30;

/** A shuffle, so the audit below can be pointed at a deliberately broken one. */
type Shuffle = <T>(items: readonly T[], seedKey: string) => T[];

/** Where the correct answer lands in `problem`'s displayed order. */
function displayedIndex(problem: MultipleChoiceProblem, shuffle: Shuffle): number {
  return shuffle(problem.question.options, problem.meta.slug).findIndex(
    (option) => option.id === problem.answer.correctOptionId,
  );
}

/** Where the correct answer sits in `problem`'s authored order. */
function authoredIndex(problem: MultipleChoiceProblem): number {
  return problem.question.options.findIndex(
    (option) => option.id === problem.answer.correctOptionId,
  );
}

/** Counts of displayed index, over problems that all have `size` options. */
function positionCounts(
  problems: readonly MultipleChoiceProblem[],
  size: number,
  shuffle: Shuffle,
): number[] {
  const counts = Array.from({ length: size }, () => 0);
  for (const problem of problems) counts[displayedIndex(problem, shuffle)] += 1;
  return counts;
}

/**
 * Runs the whole invariant against an arbitrary shuffle and returns a list of
 * human-readable failures.
 *
 * Written as a function of the shuffle rather than as inline assertions so
 * that `describe("guard sensitivity")` can feed it a broken one and require a
 * non-empty result. A guard that has never been shown to reject anything is
 * not known to be a guard.
 */
function auditShuffle(shuffle: Shuffle): string[] {
  const failures: string[] = [];

  const bySize = new Map<number, MultipleChoiceProblem[]>();
  for (const problem of MC_PROBLEMS) {
    const size = problem.question.options.length;
    bySize.set(size, [...(bySize.get(size) ?? []), problem]);
  }

  let covered = 0;
  for (const [size, group] of bySize) {
    if (group.length < POSITION_GROUP_FLOOR) continue;
    covered += group.length;

    const counts = positionCounts(group, size, shuffle);

    // (1) Omnibus: is the displayed position of the correct answer uniform?
    const chi2 = chiSquareUniform(counts);
    if (size === 4 && chi2 > CHI2_DF3_ALPHA_1E4) {
      failures.push(
        `${size}-option problems: displayed position of the correct answer is not uniform ` +
          `(chi-square ${chi2.toFixed(2)} over ${JSON.stringify(counts)}, critical ${CHI2_DF3_ALPHA_1E4})`,
      );
    }

    // (2) Every slot carries a real share. This is the direct statement of
    // "the authored corpus never puts the answer at D, and that must not
    // reach the reader": authored slot 3 holds 0 of 125, displayed holds 34.
    const floor = 1 / size - fourSigma(group.length, 1 / size);
    counts.forEach((count, index) => {
      const share = count / group.length;
      if (share < floor) {
        failures.push(
          `${size}-option problems: display slot ${index} holds only ${(100 * share).toFixed(1)}% ` +
            `of correct answers, under the ${(100 * floor).toFixed(1)}% floor`,
        );
      }
    });
  }

  // (3) Enough of the corpus is actually being measured. Without this, a
  // corpus that drifted to five-option problems would quietly fall out of
  // every group above and leave the invariant untested.
  const coverage = covered / MC_PROBLEMS.length;
  if (coverage < 0.8) {
    failures.push(
      `only ${(100 * coverage).toFixed(1)}% of multiple-choice problems sit in a group large ` +
        `enough to test; the position distribution is effectively unguarded`,
    );
  }

  // (4) The invariant itself, stated directly and conditionally: of the
  // problems whose correct answer is *authored* first, how many still show it
  // first? Authoring bias is allowed. Leaking it is not.
  const authoredFirst = MC_PROBLEMS.filter((problem) => authoredIndex(problem) === 0);
  const stillFirst = authoredFirst.filter(
    (problem) => displayedIndex(problem, shuffle) === 0,
  ).length;
  const leak = stillFirst / authoredFirst.length;
  const leakBound = 0.25 + fourSigma(authoredFirst.length, 0.25);
  if (leak > leakBound) {
    failures.push(
      `${(100 * leak).toFixed(1)}% of authored-first correct answers are still displayed first ` +
        `(${stillFirst}/${authoredFirst.length}); bound is ${(100 * leakBound).toFixed(1)}%. ` +
        `The authored share is ${((100 * authoredFirst.length) / MC_PROBLEMS.length).toFixed(0)}%, ` +
        `so this is how much of it reaches the reader`,
    );
  }

  return failures;
}

describe("displayed answer position, over the real problem corpus", () => {
  it("has a corpus worth measuring", () => {
    // If this ever fails, every statistical bound below is being computed
    // against something other than what it was derived for.
    expect(MC_PROBLEMS.length).toBeGreaterThanOrEqual(100);
    const authoredFirst = MC_PROBLEMS.filter((problem) => authoredIndex(problem) === 0);
    // The bias this whole mechanism exists for. Stated as a floor, not an
    // equality, so adding problems does not break it. If it ever drops below
    // half, the corpus has been re-authored and this file wants rereading.
    expect(authoredFirst.length / MC_PROBLEMS.length).toBeGreaterThan(0.5);
  });

  it("does not leak the authored order to the reader", () => {
    expect(auditShuffle(seededShuffle)).toEqual([]);
  });

  it("resolves every correct answer to a real displayed slot", () => {
    // Covers the non-four-option case directly rather than by sampling: the
    // corpus has one three-option problem today, and a shuffle or letter map
    // that assumed four would either throw or silently return -1 here.
    const broken = MC_PROBLEMS.filter((problem) => {
      const index = displayedIndex(problem, seededShuffle);
      return index < 0 || index >= problem.question.options.length;
    }).map((problem) => problem.meta.slug);
    expect(broken).toEqual([]);
  });

  it("gives every problem's correct answer a letter inside its own option range", () => {
    // `displayLetters` is the sole owner of position-to-letter, so this is
    // what a reader literally sees. A three-option problem must never label
    // its answer "D".
    const wrong = MC_PROBLEMS.flatMap((problem) => {
      const letters = displayLetters(problem.question.options, problem.meta.slug);
      const letter = letters.get(problem.answer.correctOptionId);
      const permitted = problem.question.options.map((_, index) =>
        String.fromCharCode(65 + index),
      );
      return letter && permitted.includes(letter)
        ? []
        : [`${problem.meta.slug}: correct answer labelled ${String(letter)} of ${permitted.join("")}`];
    });
    expect(wrong).toEqual([]);
  });

  it("agrees with what AnswerInput renders, for every problem", () => {
    // AnswerInput maps over `seededShuffle(options, slug)` and labels each row
    // from `displayLetters(options, slug)`. Two calls, two chances to drift.
    // Checked over the whole corpus rather than a sample so a drift that only
    // shows up for certain option counts cannot hide.
    const mismatched = MC_PROBLEMS.flatMap((problem) => {
      const letters = displayLetters(problem.question.options, problem.meta.slug);
      const rendered = seededShuffle(problem.question.options, problem.meta.slug).map((option) =>
        letters.get(option.id),
      );
      const expected = problem.question.options.map((_, index) =>
        String.fromCharCode(65 + index),
      );
      return JSON.stringify(rendered) === JSON.stringify(expected) ? [] : [problem.meta.slug];
    });
    expect(mismatched).toEqual([]);
  });
});

/**
 * ============================================================
 * A knowledge-free reader scores at chance
 * ============================================================
 * One level up from position: the whole point of a practice problem is that
 * you cannot answer it without knowing the physics. Position is the exploit
 * that already shipped, but it is not the only shape one can take. "Pick the
 * longest option" is the classic, because a correct statement usually needs
 * more qualifiers than a wrong one, and "pick the one with an absolute word in
 * it" is the classic inverse.
 *
 * These are deterministic: a fixed strategy over a fixed corpus under a fixed
 * shuffle. There is no sampling here, so nothing to flake. The only movement
 * comes from the corpus changing, and the 4-sigma band is sized for that.
 *
 * The comparison is against each problem's *own* chance rate (1/n options
 * averaged over the corpus, 25.07% today, not a flat 25%), so a corpus with
 * mixed option counts is scored honestly.
 *
 * Measured today: always-A 24.8%, always-B 20.8%, always-C 27.2%,
 * always-last 28.0%, longest 26.4%, shortest 21.6%, absolute-word 18.4%.
 * The band is one-sided on purpose. A strategy that scores *below* chance is
 * not an exploit; it is a reader wasting their time.
 */
describe("a knowledge-free reader scores at chance", () => {
  const shown = (problem: MultipleChoiceProblem) =>
    seededShuffle(problem.question.options, problem.meta.slug);

  /** Words that a hedged or absolute-sounding option tends to carry. */
  const ABSOLUTE = /\b(all of the above|none of the above|both|always|never|only)\b/i;

  const strategies: [name: string, pick: (problem: MultipleChoiceProblem) => string][] = [
    ["always pick the first shown option", (p) => shown(p)[0].id],
    ["always pick the second", (p) => shown(p)[1].id],
    ["always pick the third", (p) => shown(p)[2].id],
    ["always pick the last", (p) => shown(p)[shown(p).length - 1].id],
    [
      "pick the longest option",
      (p) => shown(p).reduce((best, o) => (o.text.length > best.text.length ? o : best)).id,
    ],
    [
      "pick the shortest option",
      (p) => shown(p).reduce((best, o) => (o.text.length < best.text.length ? o : best)).id,
    ],
    [
      "pick the option with an absolute word in it",
      (p) => (shown(p).find((o) => ABSOLUTE.test(o.text)) ?? shown(p)[0]).id,
    ],
  ];

  const chance =
    MC_PROBLEMS.reduce((sum, problem) => sum + 1 / problem.question.options.length, 0) /
    MC_PROBLEMS.length;
  const ceiling = chance + fourSigma(MC_PROBLEMS.length, chance);

  it.each(strategies)("%s scores no better than chance", (_name, pick) => {
    const hits = MC_PROBLEMS.filter((problem) => pick(problem) === problem.answer.correctOptionId)
      .length;
    const score = hits / MC_PROBLEMS.length;
    expect(
      score,
      `scores ${(100 * score).toFixed(1)}% against a ${(100 * chance).toFixed(1)}% baseline; ` +
        `anything above ${(100 * ceiling).toFixed(1)}% is a strategy that beats not knowing the physics`,
    ).toBeLessThanOrEqual(ceiling);
  });
});

/**
 * ============================================================
 * Guard sensitivity
 * ============================================================
 * The reason the previous version of this file protected nothing was not a
 * missing assertion. It was an assertion whose bound could not tell a working
 * shuffle from a badly broken one, measured over slugs the site does not
 * serve. So the bound is itself under test here: a shuffle that leaks the
 * authored order 28% of the time must be accepted by the old assertion and
 * rejected by the new audit. If someone later loosens a bound in this file,
 * this is what stops them.
 *
 * 28% is chosen from the arithmetic, not by taste. A shuffle that returns the
 * authored order for a share L of problems and a uniform order otherwise puts
 * the correct answer first with probability 0.25 + 0.75L, so at L = 0.28 it
 * shows the authored first option on top 46% of the time. Over the synthetic
 * bank the old test measured, that came to 49.5%: inside the old
 * `toBeLessThan(0.5)` by half a point, and comfortably past the 41.6% bound
 * the audit now applies to the real corpus.
 */
describe("guard sensitivity", () => {
  /** Cheap deterministic hash, local so the fixture cannot drift with the real one. */
  function hash(text: string): number {
    let value = 0;
    for (let i = 0; i < text.length; i += 1) value = (value * 31 + text.charCodeAt(i)) >>> 0;
    return value;
  }

  /** Returns the authored order for a `rate` share of slugs, shuffles the rest. */
  function leakyShuffle(rate: number): Shuffle {
    return <T,>(items: readonly T[], seedKey: string): T[] =>
      hash(seedKey) % 100 < rate * 100 ? [...items] : seededShuffle(items, seedKey);
  }

  const leaky = leakyShuffle(0.28);

  it("the old assertion accepts a shuffle that leaks 28% of the corpus", () => {
    // Verbatim the check this file used to make, on the synthetic slugs it
    // used to make it over.
    const stillFirst = slugs.filter((slug) => leaky(options, slug)[0].id === "a").length;
    expect(stillFirst / slugs.length).toBeLessThan(0.5);
  });

  it("the new audit rejects it", () => {
    const failures = auditShuffle(leaky);
    expect(failures.length).toBeGreaterThan(0);
    expect(failures.join(" ")).toMatch(/still displayed first/);
  });

  it("the new audit rejects no shuffle at all", () => {
    // The floor case: someone deletes `seededShuffle` from `AnswerInput` and
    // the authored order ships. 88% of correct answers at slot A, none at D.
    const identity: Shuffle = (items) => [...items];
    expect(auditShuffle(identity).length).toBeGreaterThan(0);
  });

  it("the new audit accepts the real shuffle", () => {
    // Stated here as well as above so this block reads as a complete
    // sensitivity/specificity pair rather than half of one.
    expect(auditShuffle(seededShuffle)).toEqual([]);
  });
});

/**
 * `displayLetters` is the one function allowed to turn a displayed position
 * into a letter. It exists to stop `AnswerInput` and `SolutionPanel` from
 * deriving that letter separately: the bug it closes is a solution saying
 * "Option B confuses..." while B sits beside a different answer on screen, a
 * mismatch nothing in the type system or the renderer can catch. These tests
 * pin the unit-level properties; the corpus-level ones are above.
 */
describe("displayLetters", () => {
  it("agrees with the order AnswerInput renders, letter N is the Nth shuffled option", () => {
    for (const slug of slugs.slice(0, 40)) {
      const letters = displayLetters(options, slug);
      const shuffled = seededShuffle(options, slug);
      expect(shuffled.map((option) => letters.get(option.id))).toEqual(["A", "B", "C", "D"]);
    }
  });

  it("covers every option exactly once, with no letter used twice", () => {
    const letters = displayLetters(options, "coverage-check");
    expect(letters.size).toBe(options.length);
    expect(new Set(letters.keys())).toEqual(new Set(options.map((option) => option.id)));
    expect(new Set(letters.values()).size).toBe(options.length);
  });

  it("returns the same map for the same slug, on server, client, and every visit", () => {
    // The hydration guarantee, stated at the grain the UI actually consumes.
    // A per-visit or per-render letter would make the solution panel's
    // cross-references wrong on exactly the renders where they matter.
    for (const slug of slugs.slice(0, 25)) {
      const first = displayLetters(options, slug);
      const second = displayLetters(options, slug);
      expect([...second]).toEqual([...first]);
    }
  });

  it("is not the authored order, the ids are not their own letters", () => {
    // The premise of the whole change: option ids in this corpus are literally
    // "a".."d", and the shuffle means id "b" is usually not letter B.
    const identityOrders = slugs.filter((slug) => {
      const letters = displayLetters(options, slug);
      return options.every((option) => letters.get(option.id) === option.id.toUpperCase());
    });
    expect(identityOrders.length).toBeLessThan(slugs.length / 2);
  });

  it("returns no letter for an id that is not in the option list", () => {
    // SolutionPanel's fallback path depends on this being a miss rather than a
    // throw or an empty string: an unknown `optionId` must degrade to plain
    // prose, never to a blank chip.
    const letters = displayLetters(options, "unknown-id-check");
    expect(letters.get("z")).toBeUndefined();
    expect(letters.get("")).toBeUndefined();
  });

  it("keeps numbering past Z instead of emitting punctuation", () => {
    // `String.fromCharCode(65 + index)` yields "[" at index 26. No authored
    // problem is close to 27 options, but this is the function that decides
    // what a reader sees, so it should not have a cliff.
    const many = Array.from({ length: 28 }, (_, i) => ({ id: `opt-${i}` }));
    const values = [...displayLetters(many, "wide-list").values()];
    expect(new Set(values).size).toBe(many.length);
    expect(values.every((letter) => /^[A-Z]+$/.test(letter))).toBe(true);
    const inOrder = seededShuffle(many, "wide-list").map((option) =>
      displayLetters(many, "wide-list").get(option.id),
    );
    expect(inOrder.slice(24, 28)).toEqual(["Y", "Z", "AA", "AB"]);
  });

  it("handles an empty option list without throwing", () => {
    expect(displayLetters([], "slug").size).toBe(0);
  });
});
