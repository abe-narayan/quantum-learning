/* eslint-disable react/no-children-prop -- this is a raw `createElement` harness in a
   `.test.ts` file (vitest's `include` is `src/**\/*.test.ts`, and `.ts` files aren't
   parsed for JSX), and `Term`'s props type declares `children` as required, so
   `createElement`'s positional-children overload doesn't type-check here — passing
   `children` in the props object is the only way tsc accepts this call. */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Term } from "@/components/mdx/Term";
import { GLOSSARY_TERMS } from "@/lib/content/glossary";

/**
 * `Term` is exercised for real across the lesson corpus by
 * `src/lib/content/__tests__/lessonRender.test.ts` once lesson authors adopt
 * it. These are the fast, component-local checks: the "fail loudly on a
 * mismatched id" contract (the whole point of addressing by id rather than
 * free-text title), and that a real id renders without throwing and carries
 * both the glossary definition and a link back to the full entry.
 */
/**
 * React escapes `&`, `<`, `>`, `"` and `'` on the way into static markup, so a
 * definition containing any of them can never appear verbatim in the output.
 * Asserting on the raw string made these tests depend on which entry happens to
 * sort first in GLOSSARY_TERMS and on whether that entry's prose happens to be
 * punctuation-free: adding a term with an earlier title, or an apostrophe to the
 * current first one, broke the test for a reason that had nothing to do with
 * `Term`. Escaping here pins what the component actually owes the reader.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
describe("Term", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("throws when id has no matching glossary entry, rather than rendering silently", () => {
    expect(() =>
      renderToStaticMarkup(createElement(Term, { id: "not-a-real-glossary-id", children: "some phrase" }))
    ).toThrow(/does not match any entry in GLOSSARY_TERMS/);
  });

  /**
   * The asymmetry is the whole point (see the component's "loud in dev,
   * survivable in prod" section). Authors are adding `<Term>` calls by hand
   * across 219 statically-generated lessons; one mistyped id should cost one
   * gloss, not the entire site's build. Dev and test still throw — that's the
   * test above, and `lessonRender.test.ts` — so this fallback is a backstop
   * that should never be reached, not a licence to ship bad ids.
   */
  describe("in a production build", () => {
    it("does not throw on an unknown id — it logs and renders the bare phrase", () => {
      vi.stubEnv("NODE_ENV", "production");
      const error = vi.spyOn(console, "error").mockImplementation(() => {});

      const html = renderToStaticMarkup(
        createElement(Term, { id: "not-a-real-glossary-id", children: "some phrase" })
      );

      expect(html).toContain("some phrase");
      expect(html).toContain('data-term-missing="not-a-real-glossary-id"');
      expect(error).toHaveBeenCalledTimes(1);
      expect(error.mock.calls[0][0]).toMatch(/does not match any entry in GLOSSARY_TERMS/);
    });

    it("degrades to plain text — no dangling checkbox, dfn or definition panel", () => {
      vi.stubEnv("NODE_ENV", "production");
      vi.spyOn(console, "error").mockImplementation(() => {});

      const html = renderToStaticMarkup(
        createElement(Term, { id: "not-a-real-glossary-id", children: "some phrase" })
      );

      // A gloss that can't resolve must not leave an orphan control behind in
      // the screen-reader forms list, nor a dotted underline promising a
      // definition that isn't there.
      expect(html).not.toContain('type="checkbox"');
      expect(html).not.toContain("<dfn");
      expect(html).not.toContain('role="definition"');
      expect(html).not.toContain("glossary definition");
    });

    it("still renders a valid id completely", () => {
      vi.stubEnv("NODE_ENV", "production");
      const term = GLOSSARY_TERMS[0];
      const html = renderToStaticMarkup(createElement(Term, { id: term.id, children: "the term" }));

      expect(html).toContain(escapeHtml(term.definition));
      expect(html).toContain('type="checkbox"');
    });
  });

  it("renders a real glossary id with its definition and a /glossary link, without throwing", () => {
    const term = GLOSSARY_TERMS[0];
    const html = renderToStaticMarkup(createElement(Term, { id: term.id, children: "the term" }));

    expect(html).toContain("the term");
    expect(html).toContain(escapeHtml(term.definition));
    expect(html).toContain(`/glossary#${term.id}`);
  });

  it("never renders a bare <details> (would silently split an enclosing <p>)", () => {
    const term = GLOSSARY_TERMS[0];
    const html = renderToStaticMarkup(createElement(Term, { id: term.id, children: "the term" }));
    expect(html).not.toContain("<details");
  });

  /**
   * The accessible-name contract. A screen-reader rotor / forms list shows a
   * control's name, role and state and nothing else — no surrounding
   * sentence — so each gloss has to name itself completely. Role is stuck at
   * "checkbox" (see the component docstring for why every alternative was
   * rejected), which makes the name the whole fix, and the name is the
   * `<label>`'s text content: the phrase, the canonical glossary title, and
   * a show/hide verb that CSS swaps with the reveal.
   *
   * Titles are matched against a plain-ASCII entry so the assertions compare
   * against literal HTML rather than fighting React's entity escaping.
   */
  const PLAIN_TITLE_TERM = GLOSSARY_TERMS.find((entry) => /^[A-Za-z0-9 ]+$/.test(entry.title));

  describe("accessible name", () => {
    it("names the control with the canonical glossary title when the prose phrase differs", () => {
      expect(PLAIN_TITLE_TERM).toBeDefined();
      const term = PLAIN_TITLE_TERM!;
      const html = renderToStaticMarkup(
        createElement(Term, { id: term.id, children: "a phrase the author chose instead" })
      );

      // Both halves of the CSS-swapped name are in the markup; `:has(:checked)`
      // picks which one is `display: none` (and so which one is excluded from
      // the name) at read time.
      expect(html).toContain(`${term.title}: show glossary definition`);
      expect(html).toContain(`${term.title}: hide glossary definition`);
      expect(html).toContain("a phrase the author chose instead");
    });

    it("does not repeat the title when the prose phrase already is the title", () => {
      expect(PLAIN_TITLE_TERM).toBeDefined();
      const term = PLAIN_TITLE_TERM!;
      // Lower-cased: prose almost never capitalises the way a glossary entry
      // does, and that must not count as a different phrase.
      const html = renderToStaticMarkup(
        createElement(Term, { id: term.id, children: term.title.toLowerCase() })
      );

      expect(html).toContain(", show glossary definition");
      expect(html).not.toContain(`${term.title}: show glossary definition`);
    });

    it("falls back to including the title when children are not a plain string", () => {
      expect(PLAIN_TITLE_TERM).toBeDefined();
      const term = PLAIN_TITLE_TERM!;
      const html = renderToStaticMarkup(
        createElement(Term, {
          id: term.id,
          children: createElement("em", null, term.title.toLowerCase()),
        })
      );

      expect(html).toContain(`${term.title}: show glossary definition`);
    });
  });

  describe("disclosure semantics", () => {
    it("exposes the phrase as a term and the panel as its definition", () => {
      const term = GLOSSARY_TERMS[0];
      const html = renderToStaticMarkup(createElement(Term, { id: term.id, children: "the term" }));

      expect(html).toContain("<dfn");
      expect(html).toContain('role="definition"');
    });

    it("stays a zero-JS native checkbox and never claims a state it cannot update", () => {
      const term = GLOSSARY_TERMS[0];
      const html = renderToStaticMarkup(createElement(Term, { id: term.id, children: "the term" }));

      expect(html).toContain('type="checkbox"');
      // `aria-expanded` is valid on role="checkbox" but nothing here can ever
      // change it — CSS cannot write ARIA and the toggle flips a DOM property,
      // not an attribute — so a hard-coded value would announce the wrong
      // state half the time. Same for re-roling to a button, which would
      // promise Enter-activation a checkbox doesn't honour.
      expect(html).not.toContain("aria-expanded");
      expect(html).not.toContain('role="button"');
    });
  });
});
