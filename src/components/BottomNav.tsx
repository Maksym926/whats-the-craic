import { NavLink } from "react-router-dom"
import { NAV_TABS } from "@/lib/navTabs"
import { cn } from "@/lib/utils"

/** Phones and tablets; desktop uses SideNav. */
export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="sticky bottom-0 z-10 grid grid-cols-3 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {NAV_TABS.map(({ to, label, icon: Icon }) => (
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
