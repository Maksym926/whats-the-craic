import { ArrowLeft, ArrowUpRight, Check, MapPin, ThumbsDown, ThumbsUp, Users } from "lucide-react"
import { useCallback, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import * as api from "@/api"
import { CheckIn } from "@/components/CheckIn"
import { EventImage } from "@/components/EventImage"
import { LiveBadge } from "@/components/LiveBadge"
import { PillButton } from "@/components/PillButton"
import { useAsync } from "@/hooks/useAsync"
import { CATEGORY_LABEL } from "@/lib/categories"
import { formatWhen, liveStatus } from "@/lib/format"

export default function EventDetail() {
  const { id = "" } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const why = (location.state as { why?: string } | null)?.why

  const load = useCallback(() => api.getEvent(id), [id])
  const { data: event, error, loading, reload } = useAsync(load)

  // Fetched counts already include this student if they were going, so track the change since load.
  const [initiallyGoing] = useState(() => api.isGoing(id))
  const [going, setGoing] = useState(initiallyGoing)
  const [saveError, setSaveError] = useState(false)
  const [feedback, setFeedback] = useState(() => api.getFeedback(id))

  // Opened from a shared link (no history) → go to the feed instead of leaving the app.
  const back = () => (location.key === "default" ? navigate("/events") : navigate(-1))

  const toggleGoing = async () => {
    const next = !going
    setGoing(next)
    setSaveError(false)
    try {
      await api.markGoing(id, next)
    } catch {
      setGoing(!next)
      setSaveError(true)
    }
  }

  const status = event ? liveStatus(event.start) : null

  const topBar = (
    <div className="flex items-center justify-between px-4 pt-4">
      <button
        type="button"
        aria-label="Back"
        onClick={back}
        className="flex size-11 items-center justify-center rounded-full border border-line hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-craic-blue-text"
      >
        <ArrowLeft className="size-5" aria-hidden />
      </button>
      {status && <LiveBadge label={status.label} muted={status.kind === "ended"} />}
    </div>
  )

  if (!event) {
    return (
      <main className="flex flex-1 flex-col">
        {topBar}
        {loading ? (
          <div aria-busy="true" aria-label="Loading event" className="flex flex-col gap-3 p-4 pt-8">
            <div className="h-3 w-1/3 animate-pulse rounded-full bg-line" />
            <div className="h-7 w-3/4 animate-pulse rounded-full bg-line" />
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-line" />
          </div>
        ) : (
          <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-6 p-4 text-center">
            <p>{error ? "Couldn't load this event. Check your connection." : "We couldn't find that event."}</p>
            <PillButton className="w-full" onClick={error ? reload : () => navigate("/events")}>
              {error ? "try again" : "back to events"}
            </PillButton>
          </div>
        )}
      </main>
    )
  }

  const ended = status?.kind === "ended"
  const goingCount = event.goingCount + Number(going) - Number(initiallyGoing)

  return (
    <main className="flex flex-1 flex-col">
      {topBar}

      <article className="flex flex-col gap-6 px-4 pt-6 pb-8">
        <EventImage event={event} />

        <div className="flex flex-col gap-2">
          <p className="type-eyebrow text-ink-muted">{formatWhen(event.start)}</p>
          <h1 className="type-title">{event.title}</h1>
          <p className="type-small text-ink-muted">{event.organiser}</p>
        </div>

        <div className="wtc-card__tags mt-0">
          {event.categories.map((c) => (
            <span key={c} className="wtc-tag">
              {CATEGORY_LABEL[c]}
            </span>
          ))}
        </div>

        <ul className="flex flex-col border-y border-line">
          <li className="flex items-center gap-3 border-b border-line py-3">
            <MapPin className="size-5 shrink-0 text-ink-muted" aria-hidden />
            {event.location}
          </li>
          <li className="flex items-center gap-3 py-3">
            <Users className="size-5 shrink-0 text-ink-muted" aria-hidden />
            <span aria-live="polite">{goingCount} going</span>
          </li>
        </ul>

        {why && (
          <p className="flex items-start gap-2 rounded-card bg-blue-soft p-4 font-medium text-craic-blue-text lowercase">
            <span className="wtc-dot mt-[7px] size-1.5" aria-hidden />
            {why}
          </p>
        )}

        <p>{event.description}</p>

        <a
          href={event.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="type-small flex min-h-11 items-center gap-1 self-start text-ink-muted underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-craic-blue-text"
        >
          via {event.source} · view original
          <ArrowUpRight className="size-4" aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </article>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-2 border-t border-line bg-surface p-4">
        {ended ? (
          feedback ? (
            <FeedbackSummary liked={feedback.went ? feedback.liked : undefined} went={feedback.went} />
          ) : going ? (
            <CheckIn event={event} dismissible={false} onDone={(f) => f && setFeedback(f)} />
          ) : (
            <p className="text-center text-ink-muted">This one's over.</p>
          )
        ) : (
          <>
            {saveError && (
              <p role="alert" className="type-small text-center text-negative">
                Couldn't save that. Try again.
              </p>
            )}
            <PillButton
              variant={going ? "secondary" : "primary"}
              aria-pressed={going}
              className="w-full"
              onClick={toggleGoing}
            >
              {going ? (
                <>
                  <Check className="size-4" aria-hidden /> you're going
                </>
              ) : (
                "i'm going"
              )}
            </PillButton>
            {going && <p className="type-small text-center text-ink-muted">Tap again if you can't make it.</p>}
          </>
        )}
      </div>
    </main>
  )
}

/** What the student said after an event they rated. Icon carries the meaning, colour confirms it. */
function FeedbackSummary({ went, liked }: { went: boolean; liked?: boolean }) {
  if (!went) return <p className="text-center text-ink-muted">You didn't make this one.</p>
  if (liked === undefined) return <p className="text-center text-ink-muted">Thanks for checking in.</p>
  const Icon = liked ? ThumbsUp : ThumbsDown
  return (
    <p className={`flex items-center justify-center gap-2 font-semibold ${liked ? "text-positive" : "text-negative"}`}>
      <Icon className="size-5" aria-hidden />
      {liked ? "you liked this one" : "not for you"}
    </p>
  )
}
