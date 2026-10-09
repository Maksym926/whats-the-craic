import { Link, NavLink } from "react-router-dom"
import { Wordmark } from "@/components/Wordmark"
import { useProfile } from "@/context/profile"
import { NAV_TABS } from "@/lib/navTabs"
import { cn } from "@/lib/utils"

/** Desktop navigation (lg and up): wordmark, sections, who's logged in. */
export function SideNav() {
  const { profile } = useProfile()

  return (
    <aside className="sticky top-0 hidden h-svh flex-col gap-10 border-r border-line px-5 py-8 lg:flex">
      <Link to="/events" className="self-start rounded-input focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-craic-blue-text">
        <Wordmark className="w-32" />
      </Link>

      <nav aria-label="Main" className="flex flex-col gap-1">
        {NAV_TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              cn(
                "type-heading flex h-11 items-center gap-3 rounded-full px-4 transition-colors focus-visible:outline-2 focus-visible:outline-craic-blue-text",
                isActive ? "bg-surface-raised text-ink" : "text-ink-muted hover:bg-surface-raised hover:text-ink",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="size-5" strokeWidth={isActive ? 2.25 : 1.75} aria-hidden />
                {label}
                {isActive && <span className="wtc-dot ml-auto size-1.5" aria-hidden />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {profile && (
        <div className="mt-auto flex flex-col gap-0.5 border-t border-line pt-4">
          <span className="type-label truncate">{profile.name}</span>
          <span className="type-small truncate text-ink-muted">{profile.email}</span>
        </div>
      )}
    </aside>
  )
}
