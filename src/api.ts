// The ONLY place the frontend fetches data.
//
// USE_MOCK = true  → in-memory mock events and accounts in localStorage; nothing leaves the browser.
// USE_MOCK = false → calls the Vercel functions in /api:
//   GET  /api/events     → Event[] (all events, raw; ranking happens here via lib/recommend)
//   POST /api/login      body: { email }                        → Account | 404 if no student has that email
//   POST /api/profile    body: Profile & { id?: string }        → { id: string }  (create, or update when id is sent)
//   POST /api/going      body: { studentId, eventId, going }    → { goingCount: number }
//   POST /api/feedback   body: Feedback & { studentId }         → { ok: true }
//
//   Account = { id: string, profile: Profile, going: string[] (event ids), feedback: Feedback[] }
//   Login is email-only (no password): a hackathon trade-off. Emails are unique per student
//   and matched case-insensitively.
//
// "Going" and feedback are also kept in localStorage so the UI and ranking
// react instantly, in both modes.

import { EVENT_LENGTH_MS } from "@/lib/format"
import { rankEvents } from "@/lib/recommend"
import { readJSON, removeKey, writeJSON } from "@/lib/storage"
import { DEMO_GOING, MOCK_EVENTS } from "@/mock/events"
import type { Event, Feedback, Profile } from "@/types"

export const USE_MOCK = true

const GOING_KEY = "craic.going"
const FEEDBACK_KEY = "craic.feedback"
const DISMISSED_KEY = "craic.checkInDismissed"
const STUDENT_ID_KEY = "craic.studentId"

// ---------- local state ----------

function goingIds(): string[] {
  // Mock only: a fresh student "went" to a past event, so the check-in can be demoed.
  return readJSON<string[]>(GOING_KEY, USE_MOCK ? DEMO_GOING : [])
}

function feedbackList(): Feedback[] {
  return readJSON<Feedback[]>(FEEDBACK_KEY, [])
}

function dismissedIds(): string[] {
  return readJSON<string[]>(DISMISSED_KEY, [])
}

export function isGoing(eventId: string): boolean {
  return goingIds().includes(eventId)
}

/** The student's check-in for an event, if they gave one. */
export function getFeedback(eventId: string): Feedback | undefined {
  return feedbackList().find((f) => f.eventId === eventId)
}

/** True once an event is over (2h after start). */
export const hasEnded = (e: Event) => new Date(e.start).getTime() + EVENT_LENGTH_MS < Date.now()
const bySoonest = (a: Event, b: Event) => new Date(a.start).getTime() - new Date(b.start).getTime()

// ---------- events ----------

async function fetchEvents(): Promise<Event[]> {
  if (USE_MOCK) {
    await delay(150) // lets loading states show up during development
    const going = goingIds()
    // Mock has no server, so add the student's own "going" to the count locally.
    return MOCK_EVENTS.map((e) => (going.includes(e.id) ? { ...e, goingCount: e.goingCount + 1 } : e))
  }
  return request<Event[]>("/api/events")
}

/** Personalised feed: upcoming events ranked for this student, each with a `why`. */
export async function getFeed(profile: Profile): Promise<Event[]> {
  const all = await fetchEvents()
  return rankEvents(all.filter((e) => !hasEnded(e)), profile, feedbackList(), all)
}

/** Upcoming free-food events, soonest first. */
export async function getFoodEvents(): Promise<Event[]> {
  const all = await fetchEvents()
  return all.filter((e) => !hasEnded(e) && e.categories.includes("Free food")).sort(bySoonest)
}

export async function getEvent(id: string): Promise<Event | undefined> {
  const all = await fetchEvents()
  return all.find((e) => e.id === id)
}

/** Past events the student said they were going to, not yet rated or dismissed. Most recent first. */
export async function getPendingCheckIns(): Promise<Event[]> {
  const all = await fetchEvents()
  const going = goingIds()
  const skip = new Set([...feedbackList().map((f) => f.eventId), ...dismissedIds()])
  return all
    .filter((e) => hasEnded(e) && going.includes(e.id) && !skip.has(e.id))
    .sort((a, b) => bySoonest(b, a))
}

/** Events the student has checked in on, latest answer first. */
export async function getCheckInHistory(): Promise<{ event: Event; feedback: Feedback }[]> {
  const byId = new Map((await fetchEvents()).map((e) => [e.id, e]))
  return feedbackList()
    .flatMap((feedback) => {
      const event = byId.get(feedback.eventId)
      return event ? [{ event, feedback }] : []
    })
    .reverse()
}

/** Forget going, check-ins and dismissals on this device. (Server data is untouched.) */
function resetLocalData(): void {
  for (const key of [GOING_KEY, FEEDBACK_KEY, DISMISSED_KEY, STUDENT_ID_KEY]) removeKey(key)
}

// ---------- accounts (email-only login) ----------

interface Account {
  id?: string
  profile: Profile
  going: string[]
  feedback: Feedback[]
}

// Mock mode keeps accounts in this browser, keyed by lowercase email, so register → log out → log in works in a demo.
const MOCK_ACCOUNTS_KEY = "craic.mockAccounts"
const emailKey = (email: string) => email.trim().toLowerCase()
const mockAccounts = () => readJSON<Record<string, Account>>(MOCK_ACCOUNTS_KEY, {})

async function findAccount(email: string): Promise<Account | null> {
  if (USE_MOCK) {
    await delay(150)
    return mockAccounts()[emailKey(email)] ?? null
  }
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`POST /api/login failed: ${res.status}`)
  return res.json() as Promise<Account>
}

/** Is this email already registered? (Before sign-up, or when changing email in Profile.) */
export async function emailTaken(email: string): Promise<boolean> {
  return (await findAccount(email)) !== null
}

/** Log in by email. Restores the student's plans and check-ins onto this device; null if no account. */
export async function logIn(email: string): Promise<Profile | null> {
  const account = await findAccount(email)
  if (!account) return null
  resetLocalData()
  writeJSON(GOING_KEY, account.going)
  writeJSON(FEEDBACK_KEY, account.feedback)
  if (account.id) writeJSON(STUDENT_ID_KEY, account.id)
  return account.profile
}

/** Log out: clear this device. The account stays, so logging back in restores everything. */
export function logOut(profile: Profile): void {
  if (USE_MOCK) saveMockAccount(profile) // snapshot latest plans + check-ins
  resetLocalData()
}

/** Start over: clear this device, and in mock mode delete the demo account too. */
export function deleteLocalAccount(profile: Profile): void {
  if (USE_MOCK) {
    const accounts = mockAccounts()
    delete accounts[emailKey(profile.email)]
    writeJSON(MOCK_ACCOUNTS_KEY, accounts)
  }
  resetLocalData()
}

function saveMockAccount(profile: Profile, previousEmail?: string): void {
  const accounts = mockAccounts()
  if (previousEmail) delete accounts[emailKey(previousEmail)]
  accounts[emailKey(profile.email)] = { profile, going: goingIds(), feedback: feedbackList() }
  writeJSON(MOCK_ACCOUNTS_KEY, accounts)
}

/** "Not now" on a check-in: never ask about this event again (brand rule: never nag twice). */
export function dismissCheckIn(eventId: string): void {
  writeJSON(DISMISSED_KEY, [...new Set([...dismissedIds(), eventId])])
}

// ---------- actions ----------

/** Create the account (sign-up) or update it (Profile page). Pass the old email if it changed. */
export async function saveProfile(profile: Profile, previousEmail?: string): Promise<void> {
  if (USE_MOCK) return saveMockAccount(profile, previousEmail)
  const id = studentId() ?? undefined
  const res = await request<{ id: string }>("/api/profile", { method: "POST", body: { ...profile, id } })
  writeJSON(STUDENT_ID_KEY, res.id)
}

export async function markGoing(eventId: string, going: boolean): Promise<void> {
  const ids = goingIds().filter((id) => id !== eventId)
  writeJSON(GOING_KEY, going ? [...ids, eventId] : ids)
  if (USE_MOCK) return
  await request("/api/going", { method: "POST", body: { studentId: studentId(), eventId, going } })
}

export async function sendFeedback(feedback: Feedback): Promise<void> {
  writeJSON(FEEDBACK_KEY, [...feedbackList().filter((f) => f.eventId !== feedback.eventId), feedback])
  if (USE_MOCK) return
  await request("/api/feedback", { method: "POST", body: { ...feedback, studentId: studentId() } })
}

// ---------- helpers ----------

function studentId(): string | null {
  return readJSON<string | null>(STUDENT_ID_KEY, null)
}

async function request<T>(url: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(url, {
    method: opts.method ?? "GET",
    headers: opts.body ? { "Content-Type": "application/json" } : undefined,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })
  if (!res.ok) throw new Error(`${opts.method ?? "GET"} ${url} failed: ${res.status}`)
  return res.json() as Promise<T>
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
