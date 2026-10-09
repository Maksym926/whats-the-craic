import type { ReactNode } from "react"

// Temporary scaffold for pages not built yet. Delete once every page is real.
export function PagePlaceholder({ title, note, children }: { title: string; note: string; children?: ReactNode }) {
  return (
    <main className="flex flex-col gap-4 px-4 pt-8">
      <h1 className="type-display-l">{title}</h1>
      <p className="text-ink-muted">{note}</p>
      {children}
    </main>
  )
}
