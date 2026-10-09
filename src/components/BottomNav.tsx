import { CalendarHeart, Pizza, UserRound, type LucideIcon } from "lucide-react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

const TABS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/events", label: "Events", icon: CalendarHeart },
  { to: "/food", label: "Food", icon: Pizza },
  { to: "/profile", label: "Profile", icon: UserRound },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="sticky bottom-0 z-10 grid grid-cols-3 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            cn(
              "flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )
          }
        >
          <Icon className="size-6" aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
