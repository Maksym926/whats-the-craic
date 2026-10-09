import { CalendarDays, Pizza, UserRound, type LucideIcon } from "lucide-react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

const TABS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/events", label: "events", icon: CalendarDays },
  { to: "/food", label: "food", icon: Pizza },
  { to: "/profile", label: "profile", icon: UserRound },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="sticky bottom-0 z-10 grid grid-cols-3 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            cn(
              "type-label flex h-16 flex-col items-center justify-center gap-1 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-craic-blue-text",
              isActive ? "text-ink" : "text-ink-muted hover:text-ink",
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="size-6" strokeWidth={isActive ? 2.25 : 1.75} aria-hidden />
              <span className="flex items-center gap-1">
                {/* The dot marks the selected tab, like a selected chip. */}
                {isActive && <span className="wtc-dot size-1.5" aria-hidden />}
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
