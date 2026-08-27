import { describe, expect, it } from "vitest";
import { CONCEPT_NODES, getPrerequisitePath } from "@/lib/content/concepts";

const byId = new Map(CONCEPT_NODES.map((node) => [node.id, node]));

describe("getPrerequisitePath", () => {
  it("returns just the concept itself for a root", () => {
    const roots = CONCEPT_NODES.filter((node) => node.prerequisiteIds.length === 0);
    expect(roots.length).toBeGreaterThan(0);
    for (const root of roots) {
      expect(getPrerequisitePath(root.id).map((node) => node.id)).toEqual([root.id]);
    }
  });

  it("returns [] for an id that isn't on the map", () => {
    expect(getPrerequisitePath("not-a-real-concept")).toEqual([]);
  });

  it("ends with the requested concept", () => {
    for (const node of CONCEPT_NODES) {
      const path = getPrerequisitePath(node.id);
      expect(path.at(-1)?.id).toBe(node.id);
    }
  });

  it("lists every prerequisite before the concept that needs it", () => {
    for (const node of CONCEPT_NODES) {
      const path = getPrerequisitePath(node.id);
      const position = new Map(path.map((entry, index) => [entry.id, index]));
      for (const entry of path) {
        for (const prereqId of entry.prerequisiteIds) {
          if (!byId.has(prereqId)) continue;
          expect(position.has(prereqId)).toBe(true);
          expect(position.get(prereqId)!).toBeLessThan(position.get(entry.id)!);
        }
      }
    }
  });

  it("contains no duplicates even when prerequisites reconverge", () => {
    for (const node of CONCEPT_NODES) {
      const ids = getPrerequisitePath(node.id).map((entry) => entry.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("is the transitive closure — nothing reachable is missing", () => {
    for (const node of CONCEPT_NODES) {
      const path = new Set(getPrerequisitePath(node.id).map((entry) => entry.id));
      // Independent BFS over the same edges, as a cross-check of the DFS.
      const expected = new Set<string>([node.id]);
      const queue = [node.id];
      while (queue.length > 0) {
        const current = byId.get(queue.shift()!);
        for (const prereqId of current?.prerequisiteIds ?? []) {
          if (!byId.has(prereqId) || expected.has(prereqId)) continue;
          expected.add(prereqId);
          queue.push(prereqId);
        }
      }
      expect(path).toEqual(expected);
    }
  });

  it("resolves a known deep concept to a concrete, ordered route", () => {
    const path = getPrerequisitePath("shors-algorithm").map((node) => node.id);
    expect(path).toContain("superposition");
    expect(path).toContain("quantum-fourier-transform");
    expect(path.indexOf("superposition")).toBeLessThan(path.indexOf("qubit"));
    expect(path.indexOf("quantum-circuits")).toBeLessThan(path.indexOf("quantum-fourier-transform"));
    expect(path.at(-1)).toBe("shors-algorithm");
  });
});
