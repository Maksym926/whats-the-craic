/** Events have no end time in the data; treat each as lasting 2 hours. */
export const EVENT_LENGTH_MS = 2 * 60 * 60 * 1000

const weekdayShort = new Intl.DateTimeFormat("en-IE", { weekday: "short" })
const dayMonth = new Intl.DateTimeFormat("en-IE", { weekday: "short", day: "numeric", month: "short" })

/** Whole calendar days from today (local time): 0 = today, 1 = tomorrow, -1 = yesterday. */
export function daysFromToday(iso: string, now = new Date()): number {
  const start = new Date(iso)
  const a = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  const b = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((a - b) / 86_400_000)
}

/** "7pm", "9:30am" */
function shortTime(d: Date): string {
  const h = d.getHours() % 12 || 12
  const m = d.getMinutes()
  return `${h}${m ? `:${String(m).padStart(2, "0")}` : ""}${d.getHours() < 12 ? "am" : "pm"}`
}

/**
 * Brand voice, lowercase: "tonight · 7pm", "today · 1pm", "tomorrow · 9:30am", "sun · 7:30pm", "sat 17 oct · 10am".
 * Render inside an eyebrow to get the uppercase "TONIGHT · 7PM".
 */
export function formatWhen(iso: string): string {
  const d = new Date(iso)
  const days = daysFromToday(iso)
  const day =
    days === 0
      ? d.getHours() >= 17
        ? "tonight"
        : "today"
      : days === 1
        ? "tomorrow"
        : days === -1
          ? "yesterday"
          : days > 1 && days < 7
            ? weekdayShort.format(d)
            : dayMonth.format(d)
  return `${day.toLowerCase()} · ${shortTime(d)}`
}

export type LiveStatus = { kind: "live" | "soon" | "ended"; label: string }

/** LiveBadge state: on now, starting within the hour, or ended. null otherwise. */
export function liveStatus(iso: string, now = Date.now()): LiveStatus | null {
  const start = new Date(iso).getTime()
  if (now >= start + EVENT_LENGTH_MS) return { kind: "ended", label: "ended" }
  if (now >= start) return { kind: "live", label: "on now" }
  const mins = Math.ceil((start - now) / 60_000)
  if (mins <= 60) return { kind: "soon", label: `starts in ${mins} min` }
  return null
}
