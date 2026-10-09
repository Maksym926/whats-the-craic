import type { ReactNode } from "react"

// Temporary scaffold for pages not built yet. Delete once every page is real.
export function PagePlaceholder({ title, note, children }: { title: string; note: string; children?: ReactNode }) {
  return (
    <main className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{note}</p>
      {children}
    </main>
  )
}
