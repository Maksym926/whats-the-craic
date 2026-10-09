// Pure, explainable ranking. No browser APIs here so /api can reuse it.
//
// score = 2 × (matching interests)
//       + 1 if lives in accommodation & event is Free food | Social | Making friends
//       + 1 per past 👍 in same category − 1 per past 👎 in same category
// Sorted by score, then soonest first.

import type { Category, Event, Feedback, Profile } from "../types"

const ACCOMMODATION_CATEGORIES: Category[] = ["Free food", "Social", "Making friends"]

/** Net 👍/👎 per category, from feedback on events the student actually went to. */
export function categoryVotes(feedback: Feedback[], events: Event[]): Map<Category, number> {
  const byId = new Map(events.map((e) => [e.id, e]))
  const votes = new Map<Category, number>()
  for (const f of feedback) {
    if (!f.went || f.liked === undefined) continue
    const event = byId.get(f.eventId)
    if (!event) continue
    for (const c of event.categories) {
      votes.set(c, (votes.get(c) ?? 0) + (f.liked ? 1 : -1))
    }
  }
  return votes
}

export function scoreEvent(
  event: Event,
  profile: Profile,
  votes: Map<Category, number>,
): { score: number; why?: string } {
  const matches = event.categories.filter((c) => profile.interests.includes(c))
  const accommodation =
    profile.livesInAccommodation &&
    event.categories.some((c) => ACCOMMODATION_CATEGORIES.includes(c))
  const enjoyed: Category[] = []

  let score = 2 * matches.length + (accommodation ? 1 : 0)
  for (const c of event.categories) {
    const v = votes.get(c) ?? 0
    score += v
    if (v > 0) enjoyed.push(c)
  }

  const reasons: string[] = []
  if (matches.length) reasons.push(`like ${listCategories(matches)}`)
  if (accommodation) reasons.push("live in accommodation")
  if (enjoyed.length) {
    // Keep it short: name one category the student hasn't already been told about.
    const fresh = enjoyed.find((c) => !matches.includes(c))
    reasons.push(fresh ? `enjoyed past ${fresh} events` : "enjoyed similar events before")
  }

  return { score, why: reasons.length ? `Because you ${joinClauses(reasons)}` : undefined }
}

/**
 * Rank events for a student. `history` is the pool used to look up categories of
 * events in `feedback` (usually all events, including past ones).
 */
export function rankEvents(
  events: Event[],
  profile: Profile,
  feedback: Feedback[],
  history: Event[] = events,
): Event[] {
  const votes = categoryVotes(feedback, history)
  return events
    .map((event) => ({ event, ...scoreEvent(event, profile, votes) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(a.event.start).getTime() - new Date(b.event.start).getTime(),
    )
    .map(({ event, why }) => ({ ...event, why }))
}

function listCategories(cats: Category[]): string {
  return cats.length <= 1 ? cats.join("") : `${cats.slice(0, -1).join(", ")} & ${cats.at(-1)}`
}

function joinClauses(parts: string[]): string {
  return parts.length <= 1 ? parts.join("") : `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}`
}
