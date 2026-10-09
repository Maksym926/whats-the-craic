import { Outlet } from "react-router-dom"
import { BottomNav } from "@/components/BottomNav"
import { SideNav } from "@/components/SideNav"

/**
 * Logged-in pages.
 *  phone   (<768):  430px column + bottom tab bar
 *  tablet  (768+):  wider column + bottom tab bar
 *  desktop (1024+): sidebar + wide content, no bottom bar
 * `bottomNav={false}` for pages with their own bottom action (event detail).
 */
export function TabLayout({ bottomNav = true }: { bottomNav?: boolean }) {
  return (
    <div className="flex flex-1 lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <SideNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col md:max-w-3xl lg:max-w-6xl lg:px-6">
          <Outlet />
        </div>
        {bottomNav && <BottomNav />}
      </div>
    </div>
  )
}
