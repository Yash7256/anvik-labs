"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = {
  code: string;
  caption?: string;
};

export default function Mermaid({ code, caption }: Props) {
  const id = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "neutral",
          fontFamily: "inherit",
        });
        const { svg: rendered } = await mermaid.render(`mermaid-${id}`, code);
        if (!cancelled) {
          setSvg(rendered);
          setError("");
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to render diagram");
          setSvg("");
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [code, id]);

  return (
    <figure className="mt-8 overflow-x-auto rounded-[16px] border border-border bg-light-surface p-4 md:p-6">
      <div
        ref={containerRef}
        className="flex justify-center [&_svg]:h-auto [&_svg]:max-w-full"
        aria-label={caption ?? "Mermaid diagram"}
        role="img"
        dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
      />
      {!svg && !error ? (
        <p className="text-center font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
          Rendering diagram…
        </p>
      ) : null}
      {error ? (
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[12px] text-muted">
          {code}
        </pre>
      ) : null}
      {caption ? (
        <figcaption className="mt-3 text-center text-[13px] leading-relaxed text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
