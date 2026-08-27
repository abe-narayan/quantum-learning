import path from "node:path";
import { defineConfig, type Plugin } from "vitest/config";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeKatexHtml from "./src/lib/mdx/rehypeKatexHtml.mjs";

// Vite/Vitest has no built-in .mdx loader (that's Next's @next/mdx +
// @mdx-js/loader, which is webpack-only). This plugin recompiles .mdx files
// with the same remark/rehype pipeline as next.config.ts so that tests can
// dynamically import real lesson content (see src/lib/content/lessons.ts and
// its integrity test), the same way `next build` does.
function mdx(): Plugin {
  return {
    name: "quantum-learning-mdx",
    enforce: "pre",
    async transform(code, id) {
      if (!id.endsWith(".mdx")) return null;
      const compiled = await compile(
        { value: code, path: id },
        {
          jsx: false,
          remarkPlugins: [remarkGfm, remarkMath],
          // Kept in step with next.config.ts (including rehype-slug, so
          // heading ids exist in test renders) so `lessonRender.test.ts`
          // exercises the real output rather than a pipeline the site never
          // runs. `rehypeKatexHtml` renders math to single `<KatexHtml/>`
          // string nodes — see that plugin's header.
          rehypePlugins: [rehypeSlug, [rehypeKatexHtml, { strict: false }]],
        }
      );
      return { code: String(compiled), map: null };
    },
  };
}

export default defineConfig({
  plugins: [mdx()],
  resolve: {
    alias: {
      // Mirrors tsconfig.json's "@/*" path so tests can use the same
      // imports as application code (needed once problem content files
      // started importing each other and the engine via "@/...").
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    // The lesson-corpus integrity test dynamically imports 150+ real MDX
    // modules (each of which imports its own visualizations/quantum-engine
    // code); give it real headroom instead of the 5s default.
    testTimeout: 60_000,
  },
});
