import { describe, expect, it } from "vitest";
import type { SearchEntryType } from "../types";
import { TYPE_ORDER, compareGroups, groupRank, leadBand } from "../groupRanking";

type Group = { type: SearchEntryType; bestScore: number };

function order(groups: Group[]): SearchEntryType[] {
  return [...groups].sort(compareGroups).map((group) => group.type);
}

describe("leadBand", () => {
  it("treats an exact title hit and a title-prefix hit as one band", () => {
    // Otherwise the group order would rearrange itself between "bell" and
    // "bell state" — the next keystroke of the same word.
    expect(leadBand(0)).toBe(leadBand(1));
  });

  it("separates title matches from description-only matches", () => {
    expect(leadBand(2)).toBeGreaterThan(leadBand(1));
    expect(leadBand(3)).toBeGreaterThan(leadBand(2));
  });
});

describe("groupRank", () => {
  it("follows the curated kind order", () => {
    const ranks = TYPE_ORDER.map((type) => groupRank(type, 0));
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
  });

  it("drops the glossary just under lessons when its best hit is description-only", () => {
    expect(groupRank("term", 3)).toBeGreaterThan(groupRank("lesson", 3));
    expect(groupRank("term", 3)).toBeLessThan(groupRank("problem", 3));
  });

  it("leaves the glossary leading when it actually matched a term", () => {
    expect(groupRank("term", 0)).toBeLessThan(groupRank("lesson", 0));
    expect(groupRank("term", 2)).toBeLessThan(groupRank("lesson", 2));
  });
});

describe("compareGroups", () => {
  it("puts a title match ahead of description-only matches in higher-priority kinds", () => {
    // The `|0>` case measured against the real 1,073-entry index: five
    // Problems carry a ket in their title (band 2); six Lessons and
    // twenty-two Glossary terms only mention one in prose (band 3). Under the
    // old fixed type order the five real answers rendered below all
    // twenty-eight near-misses.
    expect(
      order([
        { type: "term", bestScore: 3 },
        { type: "lesson", bestScore: 3 },
        { type: "problem", bestScore: 2 },
      ])
    ).toEqual(["problem", "lesson", "term"]);
  });

  it("keeps the curated order when every group matches equally well", () => {
    expect(
      order([
        { type: "track", bestScore: 1 },
        { type: "course", bestScore: 1 },
        { type: "lesson", bestScore: 1 },
        { type: "term", bestScore: 1 },
      ])
    ).toEqual(["term", "lesson", "course", "track"]);
  });

  it("preserves the glossary demotion the generalisation subsumes", () => {
    // Both groups are description-only, so they share a band and the band
    // sort cannot separate them — this is the case the explicit exception in
    // `groupRank` still has to handle. ("what is a qubit": four Lessons at
    // band 1, eighteen Glossary terms at band 3.)
    expect(
      order([
        { type: "term", bestScore: 3 },
        { type: "lesson", bestScore: 3 },
      ])
    ).toEqual(["lesson", "term"]);
  });

  it("lifts a course named by the query above a simulator that only mentions it", () => {
    // "entanglement" against the real index: seven Courses at band 1, one
    // Simulator at band 3. The old order shipped the simulator first purely
    // because `simulator` precedes `course` in TYPE_ORDER.
    expect(
      order([
        { type: "simulator", bestScore: 3 },
        { type: "course", bestScore: 1 },
      ])
    ).toEqual(["course", "simulator"]);
  });

  it("is deterministic regardless of the order groups are built in", () => {
    const groups: Group[] = [
      { type: "course", bestScore: 1 },
      { type: "term", bestScore: 3 },
      { type: "problem", bestScore: 2 },
      { type: "lesson", bestScore: 3 },
    ];
    expect(order(groups)).toEqual(order([...groups].reverse()));
  });
});
