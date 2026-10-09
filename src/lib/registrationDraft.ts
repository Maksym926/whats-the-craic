// Registration answers, held until Onboarding finishes and the full Profile is saved.
// Kept in localStorage so Back / refresh don't wipe the form.

import { readJSON, removeKey, writeJSON } from "@/lib/storage"
import type { Profile } from "@/types"

export type RegistrationDraft = Pick<Profile, "name" | "college" | "year" | "email" | "emailNotifications">

const KEY = "craic.registration"

export const loadDraft = () => readJSON<RegistrationDraft | null>(KEY, null)
export const saveDraft = (draft: RegistrationDraft) => writeJSON(KEY, draft)
export const clearDraft = () => removeKey(KEY)

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
