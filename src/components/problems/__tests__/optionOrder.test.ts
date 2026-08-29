import { describe, expect, it } from "vitest";
import { displayLetters, seededShuffle } from "../optionOrder";

const options = [
  { id: "a", text: "first" },
  { id: "b", text: "second" },
  { id: "c", text: "third" },
  { id: "d", text: "fourth" },
];

/** A varied bank of realistic slugs to measure distribution over. */
const slugs = Array.from({ length: 200 }, (_, i) => `problem-slug-${i}-${(i * 37) % 101}`);

describe("seededShuffle", () => {
  it("is deterministic for the same seed key (hydration safety)", () => {
    for (const slug of slugs.slice(0, 25)) {
      const first = seededShuffle(options, slug);
      const second = seededShuffle(options, slug);
      expect(first.map((o) => o.id)).toEqual(second.map((o) => o.id));
    }
  });

  it("keeps every option intact — same ids, same objects, nothing added or dropped", () => {
    const shuffled = seededShuffle(options, "any-problem-slug");
    expect(shuffled).toHaveLength(options.length);
    expect(new Set(shuffled.map((o) => o.id))).toEqual(new Set(options.map((o) => o.id)));
    for (const option of shuffled) {
      // Same object references — the shuffle reorders, never clones or edits.
      expect(options).toContain(option);
    }
  });

  it("does not mutate the input array", () => {
    const input = [...options];
    seededShuffle(input, "mutation-check");
    expect(input).toEqual(options);
  });

  it("produces different orders across slugs (statistically)", () => {
    const orders = new Set(slugs.map((slug) => seededShuffle(options, slug).map((o) => o.id).join("")));
    // 4 options have 24 permutations; 200 slugs should hit a large share of
    // them. A weak seeding (or a constant order) collapses this to 1.
    expect(orders.size).toBeGreaterThan(10);
  });

  it("moves the authored-first option away from the top for most slugs", () => {
    // The exploit this exists to fix: the correct answer was authored first
    // in the vast majority of problems. Under a uniform shuffle the authored
    // first option stays on top ~25% of the time for 4 options.
    const stillFirst = slugs.filter((slug) => seededShuffle(options, slug)[0].id === "a").length;
    expect(stillFirst / slugs.length).toBeLessThan(0.5);
    // ...and every option gets a turn in the top slot across the bank.
    const firstIds = new Set(slugs.map((slug) => seededShuffle(options, slug)[0].id));
    expect(firstIds.size).toBe(options.length);
  });

  it("handles empty and single-item lists", () => {
    expect(seededShuffle([], "slug")).toEqual([]);
    expect(seededShuffle([options[0]], "slug")).toEqual([options[0]]);
  });
});

/**
 * `displayLetters` is the one function allowed to turn a displayed position
 * into a letter. It exists to stop `AnswerInput` and `SolutionPanel` from
 * deriving that letter separately — the bug it closes is a solution saying
 * "Option B confuses..." while B sits beside a different answer on screen, a
 * mismatch nothing in the type system or the renderer can catch. These tests
 * pin the two properties that make the mismatch impossible: the map agrees
 * with the shuffle it is built from, and it is a pure function of (options,
 * slug).
 */
describe("displayLetters", () => {
  it("agrees with the order AnswerInput renders — letter N is the Nth shuffled option", () => {
    // This *is* AnswerInput's loop: it maps over `seededShuffle(options, slug)`
    // and labels each option by asking this map. If the two ever disagreed,
    // this is where it would show.
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

  it("returns the same map for the same slug — server, client, and every visit", () => {
    // The hydration guarantee, stated at the grain the UI actually consumes.
    // A per-visit or per-render letter would make the solution panel's
    // cross-references wrong on exactly the renders where they matter.
    for (const slug of slugs.slice(0, 25)) {
      const first = displayLetters(options, slug);
      const second = displayLetters(options, slug);
      expect([...second]).toEqual([...first]);
    }
  });

  it("is not the authored order — the ids are not their own letters", () => {
    // The premise of the whole change: option ids in this corpus are literally
    // "a".."d", and the shuffle means id "b" is usually not letter B. If this
    // ever held for every slug, the seeded shuffle would have stopped working
    // and the letter-reference machinery would be dead weight.
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
    const inOrder = seededShuffle(many, "wide-list").map((option) => displayLetters(many, "wide-list").get(option.id));
    expect(inOrder.slice(24, 28)).toEqual(["Y", "Z", "AA", "AB"]);
  });

  it("handles an empty option list without throwing", () => {
    expect(displayLetters([], "slug").size).toBe(0);
  });
});
