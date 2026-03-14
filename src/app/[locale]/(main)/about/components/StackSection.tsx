"use client"

import { useInView } from "@/lib/hooks/useInView"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

const packageJson = {
  name: "ai-era",
  version: "0.1.0",
  description: "A training ground for developers in the AI era",
  license: "MIT",
  dependencies: {
    next: "15.x",
    react: "19.x",
    typescript: "5.x",
    "drizzle-orm": "latest",
    "better-auth": "latest",
    tailwindcss: "4.x",
    "@xyflow/react": "latest",
    "@google/genai": "latest",
  },
  devDependencies: {
    bun: "latest",
    postgresql: "15.x",
    docker: "*",
  },
  scripts: {
    dev: "bun run dev",
    build: "bun run build",
    learn: "open https://ai-era.dev/challenges",
    improve: "open https://github.com/your-org/ai-era/issues",
  },
}

const comments: Record<string, string> = {
  next: "The framework",
  react: "The UI layer",
  typescript: "Because we're not animals",
  "drizzle-orm": "Type-safe queries",
  "better-auth": "Auth without the pain",
  tailwindcss: "Utility-first CSS",
  "@xyflow/react": "The skill map",
  "@google/genai": "The AI part of AI-Era",
  bun: "Fast. Very fast.",
  postgresql: "The database",
  docker: "Ships anywhere",
}

function JsonHighlight({ data, indent = 0 }: { data: unknown; indent?: number }) {
  const spacing = "  ".repeat(indent)

  if (data === null || data === undefined) {
    return <span className="text-muted-foreground">null</span>
  }

  if (typeof data === "string") {
    const comment = comments[data.replace(/"/g, "")]
    return (
      <>
        <span className="text-secondary">&quot;{data}&quot;</span>
        {comment && (
          <span className="text-muted-foreground italic opacity-60">{" // "}{comment}</span>
        )}
      </>
    )
  }

  if (typeof data === "number") {
    return <span className="text-success">{data}</span>
  }

  if (typeof data === "boolean") {
    return <span className="text-primary">{data.toString()}</span>
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-muted-foreground">[]</span>
    return (
      <>
        <span className="text-muted-foreground">[</span>
        {"\n"}
        {data.map((item, i) => (
          <span key={i}>
            {spacing}{"  "}
            <JsonHighlight data={item} indent={indent + 1} />
            {i < data.length - 1 && <span className="text-muted-foreground">,</span>}
            {"\n"}
          </span>
        ))}
        {spacing}
        <span className="text-muted-foreground">]</span>
      </>
    )
  }

  if (typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>)
    if (entries.length === 0) return <span className="text-muted-foreground">{"{}"}</span>
    return (
      <>
        <span className="text-muted-foreground">{"{"}</span>
        {"\n"}
        {entries.map(([key, value], i) => (
          <span key={key}>
            {spacing}{"  "}
            <span className="text-primary">&quot;{key}&quot;</span>
            <span className="text-muted-foreground">: </span>
            <JsonHighlight data={value} indent={indent + 1} />
            {i < entries.length - 1 && <span className="text-muted-foreground">,</span>}
            {"\n"}
          </span>
        ))}
        {spacing}
        <span className="text-muted-foreground">{"}"}</span>
      </>
    )
  }

  return <span>{String(data)}</span>
}

export function StackSection() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 })
  const prefersReducedMotion = useReducedMotion()

  const animationStyle = prefersReducedMotion
    ? {}
    : {
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 500ms ease-out, transform 500ms ease-out",
      }

  return (
    <section ref={ref} className="py-16 md:py-20" style={animationStyle}>
      {/* Command Line Title */}
      <div className="text-[13px] font-bold text-primary font-mono mb-4">
        {`> cat package.json`}
      </div>

      {/* JSON Container */}
      <div className="bg-card border border-border border-l-[3px] border-l-primary px-7 py-7 overflow-x-auto">
        <pre className="text-[13px] leading-[2] font-mono whitespace-pre">
          <JsonHighlight data={packageJson} />
        </pre>
      </div>
    </section>
  )
}
