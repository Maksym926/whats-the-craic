// The ONLY place the frontend fetches data.
//
// USE_MOCK = true  → in-memory mock events, nothing leaves the browser.
// USE_MOCK = false → calls the Vercel functions in /api:
//   GET  /api/events     → Event[] (all events, raw; ranking happens here via lib/recommend)
//   POST /api/profile    body: Profile                          → { id: string }
//   POST /api/going      body: { studentId, eventId, going }    → { goingCount: number }
//   POST /api/feedback   body: Feedback & { studentId }         → { ok: true }
//
// "Going" and feedback are also kept in localStorage so the UI and ranking
// react instantly, in both modes.

import { rankEvents } from "@/lib/recommend"
import { readJSON, writeJSON } from "@/lib/storage"
import { MOCK_EVENTS } from "@/mock/events"
import type { Event, Feedback, Profile } from "@/types"

export const USE_MOCK = true

const GOING_KEY = "craic.going"
const FEEDBACK_KEY = "craic.feedback"
const STUDENT_ID_KEY = "craic.studentId"

/** An event counts as "over" (eligible for check-in) 2h after it starts. */
const EVENT_LENGTH_MS = 2 * 60 * 60 * 1000

// ---------- local state ----------

function goingIds(): string[] {
  return readJSON<string[]>(GOING_KEY, [])
}

function feedbackList(): Feedback[] {
  return readJSON<Feedback[]>(FEEDBACK_KEY, [])
}

export function isGoing(eventId: string): boolean {
  return goingIds().includes(eventId)
}

const isOver = (e: Event) => new Date(e.start).getTime() + EVENT_LENGTH_MS < Date.now()
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
  return rankEvents(all.filter((e) => !isOver(e)), profile, feedbackList(), all)
}

/** Upcoming free-food events, soonest first. */
export async function getFoodEvents(): Promise<Event[]> {
  const all = await fetchEvents()
  return all.filter((e) => !isOver(e) && e.categories.includes("Free food")).sort(bySoonest)
}

export async function getEvent(id: string): Promise<Event | undefined> {
  const all = await fetchEvents()
  return all.find((e) => e.id === id)
}

/** Past events the student said they were going to but hasn't rated yet. */
export async function getPendingCheckIns(): Promise<Event[]> {
  const all = await fetchEvents()
  const going = goingIds()
  const rated = new Set(feedbackList().map((f) => f.eventId))
  return all.filter((e) => isOver(e) && going.includes(e.id) && !rated.has(e.id)).sort(bySoonest)
}

// ---------- actions ----------

export async function saveProfile(profile: Profile): Promise<void> {
  if (USE_MOCK) return
  const { id } = await request<{ id: string }>("/api/profile", { method: "POST", body: profile })
  writeJSON(STUDENT_ID_KEY, id)
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
