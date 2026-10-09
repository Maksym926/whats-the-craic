import { useCallback, useMemo, useState, type ReactNode } from "react"
import * as api from "@/api"
import { readJSON, removeKey, writeJSON } from "@/lib/storage"
import type { Profile } from "@/types"
import { ProfileContext } from "./profile"

const PROFILE_KEY = "craic.profile"

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(() => readJSON<Profile | null>(PROFILE_KEY, null))

  const saveProfile = useCallback(async (next: Profile) => {
    await api.saveProfile(next)
    writeJSON(PROFILE_KEY, next)
    setProfile(next)
  }, [])

  const clearProfile = useCallback(() => {
    removeKey(PROFILE_KEY)
    setProfile(null)
  }, [])

  const value = useMemo(() => ({ profile, saveProfile, clearProfile }), [profile, saveProfile, clearProfile])

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}
