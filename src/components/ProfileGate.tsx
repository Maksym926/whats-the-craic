import { Navigate, Outlet } from "react-router-dom"
import { useProfile } from "@/context/profile"

/** App pages: no profile yet → back to Welcome. */
export function RequireProfile() {
  const { profile } = useProfile()
  return profile ? <Outlet /> : <Navigate to="/" replace />
}

/** Welcome / Registration / Onboarding: already set up → straight to the feed. */
export function RedirectIfProfile() {
  const { profile } = useProfile()
  return profile ? <Navigate to="/events" replace /> : <Outlet />
}
