import katex from "katex";

/**
 * Renders plain text containing inline `$...$` LaTeX segments — the
 * lightweight alternative to full MDX compilation for content (like
 * problems) that's mostly short structured strings rather than long-form
 * prose. Pure function of its props (no hooks), so — like
 * `QuantumStateDisplay` — it works from a Server Component or a Client
 * Component without needing two versions.
 */
export function MathText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\$[^$]+\$)/g).filter((part) => part.length > 0);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("$") && part.endsWith("$") && part.length > 1) {
          const html = katex.renderToString(part.slice(1, -1), {
            displayMode: false,
            throwOnError: false,
            strict: false,
          });
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
