import type { ReactNode } from "react"

/** Mobile-first frame: full width on phones, a centred 430px column on desktop. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-surface-raised">
      <div className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col bg-surface min-[431px]:border-x min-[431px]:border-line">
        {children}
      </div>
    </div>
  )
}
