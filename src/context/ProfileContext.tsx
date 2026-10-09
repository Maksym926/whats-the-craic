import { useCallback, useMemo, useState, type ReactNode } from "react"
import * as api from "@/api"
import { clearDraft } from "@/lib/registrationDraft"
import { readJSON, removeKey, writeJSON } from "@/lib/storage"
import type { Profile } from "@/types"
import { ProfileContext } from "./profile"

const PROFILE_KEY = "craic.profile"

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(() => readJSON<Profile | null>(PROFILE_KEY, null))

  const keep = useCallback((next: Profile | null) => {
    if (next) writeJSON(PROFILE_KEY, next)
    else removeKey(PROFILE_KEY)
    setProfile(next)
  }, [])

  const saveProfile = useCallback(
    async (next: Profile) => {
      await api.saveProfile(next, profile?.email)
      keep(next)
    },
    [profile, keep],
  )

  const logIn = useCallback(
    async (email: string) => {
      const found = await api.logIn(email)
      if (found) keep(found)
      return found !== null
    },
    [keep],
  )

  const logOut = useCallback(() => {
    if (profile) api.logOut(profile)
    keep(null)
  }, [profile, keep])

  const startOver = useCallback(() => {
    if (profile) api.deleteLocalAccount(profile)
    clearDraft()
    keep(null)
  }, [profile, keep])

  const value = useMemo(
    () => ({ profile, saveProfile, logIn, logOut, startOver }),
    [profile, saveProfile, logIn, logOut, startOver],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}
