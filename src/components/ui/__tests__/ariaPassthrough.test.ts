/* eslint-disable react/no-children-prop -- a raw `createElement` harness in a
   `.test.ts` file (vitest's `include` is `src/**\/*.test.ts`, and `.ts` files
   aren't parsed for JSX), and these components declare `children` as required,
   so `createElement`'s positional-children overload doesn't type-check here;
   passing `children` in the props object is the only form tsc accepts. */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Instrument, Panel } from "@/components/ui/Panel";
import { TechLabel, TechValue } from "@/components/ui/Typography";

/**
 * ============================================================
 * ARIA that reaches the element, or does not
 * ============================================================
 * Both suites below guard the same failure, from its two sides. It is a
 * failure with no symptom anywhere else in the toolchain:
 *
 *   **TypeScript cannot catch it.** A closed props type on a JSX component
 *   does not reject a hyphenated attribute — `aria-*` and `data-*` names are
 *   permitted on any JSX element regardless of what the component declares.
 *   So `<TechValue aria-hidden="true">` type-checks, is destructured by
 *   nobody, reaches no element, and emits nothing, with `tsc --noEmit` green.
 *
 *   **Review cannot catch it.** The call site reads exactly right. The only
 *   place the truth is visible is the rendered markup, which is what these
 *   tests assert against.
 *
 * That is not hypothetical on either side. `DailyPuzzleClient`'s reserved-space
 * date readout asked to be hidden and the served homepage carried
 * `<span class="tech-value text-xs opacity-0">0000-00-00</span>`: invisible to
 * a sighted reader and announced to a screen-reader one, the exact inversion of
 * the request. And `nameableRole` in Panel.tsx has the opposite exposure — it
 * is correct today and has never once run, because no call site passes a name.
 */

describe("Panel / Instrument naming", () => {
  /**
   * The state of the tree, asserted rather than asserted-in-prose: no caller
   * names a panel yet, so everything below this line is a forward guarantee
   * for the first one that does. See the header comment in Panel.tsx for why
   * that is the right state and not a gap to be filled.
   */
  it("adds no role at all when the caller supplies no name", () => {
    const panel = renderToStaticMarkup(createElement(Panel, { children: "body" }));
    const instrument = renderToStaticMarkup(createElement(Instrument, { children: "body" }));

    expect(panel).not.toContain("role=");
    expect(instrument).not.toContain("role=");
  });

  /**
   * The branch that has never run in a browser. ARIA prohibits naming the
   * implicit `generic` role a bare `<div>` carries, so a name without a role
   * is dropped by every major screen reader; `group` is the narrowest role
   * that can hold one without adding a landmark to the page's landmark list.
   */
  it("pairs a name with role=group on the default div, so the name is honoured", () => {
    const labelled = renderToStaticMarkup(
      createElement(Panel, { children: "body", "aria-label": "Readout" })
    );
    expect(labelled).toContain('role="group"');
    expect(labelled).toContain('aria-label="Readout"');

    const described = renderToStaticMarkup(
      createElement(Instrument, { children: "body", "aria-labelledby": "some-heading" })
    );
    expect(described).toContain('role="group"');
    expect(described).toContain('aria-labelledby="some-heading"');
  });

  /**
   * The escape hatch for a caller who genuinely wants a landmark. A named
   * `<section>` is a `region` by definition, so stamping `role="group"` on it
   * would *downgrade* it — the helper has to stay out of the way.
   */
  it("leaves a caller-chosen element's own role alone", () => {
    const markup = renderToStaticMarkup(
      createElement(Instrument, { children: "body", as: "section", "aria-label": "Bench" })
    );
    expect(markup).toContain("<section");
    expect(markup).not.toContain("role=");
    expect(markup).toContain('aria-label="Bench"');
  });
});

describe("TechLabel / TechValue aria-hidden", () => {
  it("forwards aria-hidden to the rendered element", () => {
    const value = renderToStaticMarkup(
      createElement(TechValue, { children: "0000-00-00", "aria-hidden": "true" })
    );
    const label = renderToStaticMarkup(
      createElement(TechLabel, { children: "Difficulty", "aria-hidden": true })
    );

    expect(value).toContain('aria-hidden="true"');
    expect(label).toContain('aria-hidden="true"');
  });

  it("emits no aria-hidden when the caller does not ask for one", () => {
    const value = renderToStaticMarkup(createElement(TechValue, { children: "556" }));
    expect(value).not.toContain("aria-hidden");
    expect(value).toContain('class="tech-value"');
  });

  /**
   * `aria-label` is deliberately *not* forwarded: these render a bare
   * `<span>`, whose implicit `generic` role cannot be named, so forwarding it
   * would replace a visibly dead attribute with an invisibly dead one. Pinned
   * so that "make it forward everything" is a conscious decision rather than a
   * tidy-up, and so the omission reads as intent to the next author.
   */
  it("does not forward a name onto an element that cannot hold one", () => {
    const markup = renderToStaticMarkup(
      // @ts-expect-error -- `aria-label` is not part of the props type; this
      // asserts the runtime behaviour that matches the type's refusal.
      createElement(TechValue, { children: "12", "aria-label": "Minutes" })
    );
    expect(markup).not.toContain("aria-label");
  });
});
