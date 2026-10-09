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

export type DetailErrors = Partial<Record<keyof RegistrationDraft, string>>

/** Shared by Registration and Profile. Email is only required when event emails are switched on. */
export function validateDetails(d: RegistrationDraft): DetailErrors {
  const errors: DetailErrors = {}
  if (!d.name.trim()) errors.name = "Tell us what to call you."
  if (!d.college) errors.college = "Pick your college."
  if (!d.year) errors.year = "Pick your year."
  if (d.emailNotifications && !d.email.trim()) errors.email = "Add your email to get event emails."
  else if (d.email.trim() && !isValidEmail(d.email)) errors.email = "That email doesn't look right."
  return errors
}
