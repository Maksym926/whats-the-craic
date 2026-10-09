import type { ReactNode } from "react"

/** Page ground. Layouts (FlowLayout, TabLayout) decide widths per screen size. */
export function AppShell({ children }: { children: ReactNode }) {
  return <div className="flex min-h-svh flex-col bg-surface">{children}</div>
}
