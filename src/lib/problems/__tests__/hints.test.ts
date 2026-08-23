import { describe, expect, it } from "vitest";
import { revealNextHint } from "../hints";

describe("revealNextHint", () => {
  it("reveals one more hint than currently revealed", () => {
    expect(revealNextHint(0, 3)).toBe(1);
    expect(revealNextHint(1, 3)).toBe(2);
  });

  it("never exceeds the total number of hints", () => {
    expect(revealNextHint(3, 3)).toBe(3);
    expect(revealNextHint(2, 3)).toBe(3);
  });

  it("handles zero hints", () => {
    expect(revealNextHint(0, 0)).toBe(0);
  });
});
