import { Outlet } from "react-router-dom"
import { BottomNav } from "@/components/BottomNav"

/** Main app pages (Events, Food, Profile): page content + bottom tab bar. */
export function TabLayout() {
  return (
    <>
      <div className="flex-1">
        <Outlet />
      </div>
      <BottomNav />
    </>
  )
}
