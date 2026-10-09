import { CalendarDays, Pizza, UserRound, type LucideIcon } from "lucide-react"

/** Main sections: bottom tab bar on phones/tablets, sidebar on desktop. */
export const NAV_TABS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/events", label: "events", icon: CalendarDays },
  { to: "/food", label: "food", icon: Pizza },
  { to: "/profile", label: "profile", icon: UserRound },
]
