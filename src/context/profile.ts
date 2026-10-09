import { createContext, useContext } from "react"
import type { Profile } from "@/types"

export interface ProfileContextValue {
  /** null until the student finishes onboarding */
  profile: Profile | null
  /** Saves to the API (if enabled) and localStorage. */
  saveProfile: (profile: Profile) => Promise<void>
  clearProfile: () => void
}

export const ProfileContext = createContext<ProfileContextValue | null>(null)

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used inside <ProfileProvider>")
  return ctx
}
