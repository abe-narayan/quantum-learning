import { describe, expect, it } from "vitest";
import { budgetGroups } from "@/components/problems/ProblemsCatalog";
import type { ProblemMeta } from "@/lib/problems/types";

/**
 * ============================================================
 * The catalog renders in batches, and its counts stay honest
 * ============================================================
 * `/problems` was measured at **85,023px tall at 375px** and 47,363px at
 * 1280, rendering all 556 problems at once. `budgetGroups` is what cut that
 * to 7,628px: it spends a render budget across the already-grouped, already
 * ordered sections and stops.
 *
 * The subtle half is the part these tests exist for. Every section header on
 * that page states a total — "48 problems", "3/48 solved" — and those totals
 * are derived from the group's `items`. If the budget cut `items` as well as
 * the rendered arrays, every header would report the size of the visible
 * slice as though it were the size of the group, which is precisely the class
 * of silently-wrong number `CLAUDE.md`'s "counts are derived, never typed"
 * rule exists to prevent. So `items` is never touched, and that is asserted
 * here rather than left to a comment.
 */

const problem = (slug: string): ProblemMeta => ({
  slug,
  title: slug,
  course: "quantum-gates-and-circuits",
  difficulty: "intermediate",
  estimatedMinutes: 2,
  problemType: "numeric",
  tags: [],
});

/** `featured` + `rest` is the split `splitFeatured` produces; `items` is the
 *  whole group, which the headers count. */
const group = (name: string, featuredCount: number, restCount: number) => {
  const featured = Array.from({ length: featuredCount }, (_, i) => problem(`${name}-f${i}`));
  const rest = Array.from({ length: restCount }, (_, i) => problem(`${name}-r${i}`));
  return { name, items: [...featured, ...rest], featured, rest };
};

const rendered = (groups: ReturnType<typeof group>[]) =>
  groups.reduce((total, g) => total + g.featured.length + g.rest.length, 0);

describe("budgetGroups", () => {
  const groups = [group("a", 2, 10), group("b", 0, 20), group("c", 1, 5)];

  it("renders everything when the budget covers the whole list", () => {
    const out = budgetGroups(groups, 100);
    expect(rendered(out)).toBe(38);
    expect(out).toHaveLength(3);
  });

  it("spends the budget in order and stops", () => {
    const out = budgetGroups(groups, 15);
    expect(rendered(out)).toBe(15);
    // Group a is whole (12), group b takes the remaining 3, group c never
    // starts — so it is not rendered as an empty section header either.
    expect(out).toHaveLength(2);
    expect(out[0].featured).toHaveLength(2);
    expect(out[0].rest).toHaveLength(10);
    expect(out[1].featured).toHaveLength(0);
    expect(out[1].rest).toHaveLength(3);
  });

  it("spends the featured tier before the rest of the same group", () => {
    // A budget of 1 into a group whose first entry is a `master`-tier card:
    // the feature strip is what the reader sees first on the page, so it is
    // what the budget buys first.
    const out = budgetGroups([group("a", 2, 10)], 1);
    expect(out[0].featured).toHaveLength(1);
    expect(out[0].rest).toHaveLength(0);
  });

  it("never truncates `items`, which is what the section headers count", () => {
    const out = budgetGroups(groups, 15);
    expect(out[0].items).toHaveLength(12);
    expect(out[1].items).toHaveLength(20);
    // The rendered slice is smaller than the group it belongs to; the header
    // still reports the group.
    expect(out[1].rest.length).toBeLessThan(out[1].items.length);
  });

  it("renders nothing at all for a zero or negative budget", () => {
    expect(budgetGroups(groups, 0)).toHaveLength(0);
    expect(budgetGroups(groups, -5)).toHaveLength(0);
  });

  it("does not mutate the groups it is given", () => {
    const input = [group("a", 2, 10)];
    const before = input[0].rest.length;
    budgetGroups(input, 3);
    expect(input[0].rest).toHaveLength(before);
    expect(input[0].items).toHaveLength(12);
  });

  it("is stable: a larger budget is a superset of a smaller one", () => {
    // The reader presses "Show more"; nothing they were already looking at
    // may reorder or disappear.
    const small = budgetGroups(groups, 8);
    const large = budgetGroups(groups, 20);
    const slugs = (out: ReturnType<typeof budgetGroups>) =>
      out.flatMap((g) => [...g.featured, ...g.rest]).map((p) => p.slug);
    expect(slugs(large).slice(0, 8)).toEqual(slugs(small));
  });
});
