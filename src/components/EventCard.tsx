import { Link } from "react-router-dom"
import { EventImage } from "@/components/EventImage"
import { LiveBadge } from "@/components/LiveBadge"
import { CATEGORY_LABEL } from "@/lib/categories"
import { formatWhen, liveStatus } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Event } from "@/types"

interface EventCardProps {
  event: Event
  /** Show the "because you…" line (feed only). */
  showWhy?: boolean
  /** Top recommendation: blue border (wtc-card--picked). Keep to one per view. */
  picked?: boolean
}

/**
 * Brand EventCard. Anatomy: eyebrow (when / live badge · going) → title → society · venue
 * → up to three tags → why line.
 */
export function EventCard({ event, showWhy = false, picked = false }: EventCardProps) {
  const status = liveStatus(event.start)
  const isLive = status && status.kind !== "ended"

  return (
    <Link
      to={`/events/${event.id}`}
      state={{ why: event.why }}
      className={cn(
        "wtc-card h-full max-w-none transition-colors hover:border-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-craic-blue-text",
        picked && "wtc-card--picked hover:border-craic-blue",
      )}
    >
      <EventImage event={event} className="mb-2 rounded-input" />
      <div className="wtc-card__eyebrow">
        {isLive ? <LiveBadge label={status.label} /> : <span>{formatWhen(event.start)}</span>}
        <span>{event.goingCount} going</span>
      </div>
      <h3 className="wtc-card__title line-clamp-2">{event.title}</h3>
      <p className="wtc-card__meta">
        {event.organiser} · {event.location}
      </p>
      <div className="wtc-card__tags">
        {event.categories.slice(0, 3).map((c) => (
          <span key={c} className="wtc-tag">
            {CATEGORY_LABEL[c]}
          </span>
        ))}
      </div>
      {showWhy && event.why && (
        <p className="wtc-card__why mt-1 items-start lowercase">
          <span className="wtc-dot mt-[5px] size-1.5" aria-hidden />
          {event.why}
        </p>
      )}
    </Link>
  )
}

export function EventCardSkeleton() {
  return (
    <div aria-hidden className="wtc-card max-w-none">
      <div className="h-3 w-1/3 animate-pulse rounded-full bg-line" />
      <div className="h-5 w-3/4 animate-pulse rounded-full bg-line" />
      <div className="h-3 w-1/2 animate-pulse rounded-full bg-line" />
      <div className="mt-1 flex gap-1">
        <div className="h-6 w-16 animate-pulse rounded-full bg-line" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-line" />
      </div>
    </div>
  )
}
