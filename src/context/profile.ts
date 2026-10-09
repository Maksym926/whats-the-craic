import { createContext, useContext } from "react"
import type { Profile } from "@/types"

export interface ProfileContextValue {
  /** null until the student signs up or logs in */
  profile: Profile | null
  /** Create (sign-up) or update the account, and keep it on this device. */
  saveProfile: (profile: Profile) => Promise<void>
  /** Email-only login. Resolves false when no account has that email. */
  logIn: (email: string) => Promise<boolean>
  /** Clear this device; the account stays so the student can log back in. */
  logOut: () => void
  /** Clear this device and (mock mode) delete the account. */
  startOver: () => void
}

export const ProfileContext = createContext<ProfileContextValue | null>(null)

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used inside <ProfileProvider>")
  return ctx
}
