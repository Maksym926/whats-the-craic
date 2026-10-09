import type { ReactNode } from "react"
import { EventCard, EventCardSkeleton } from "@/components/EventCard"
import { PillButton } from "@/components/PillButton"
import type { Event } from "@/types"

interface EventListProps {
  events: Event[] | undefined
  loading: boolean
  error?: Error
  onRetry: () => void
  /** Feed mode: why lines, and the top pick gets the blue "picked" border. */
  showWhy?: boolean
  /** Shown when loaded and there's nothing to list. */
  empty: ReactNode
}

/** One column on phones, 2 on tablets, 3 on wide desktops. */
const GRID = "grid gap-6 md:grid-cols-2 xl:grid-cols-3"

/** List with loading skeletons, error + retry, and empty state. */
export function EventList({ events, loading, error, onRetry, showWhy, empty }: EventListProps) {
  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center gap-4 rounded-card border border-line bg-surface-raised p-6 text-center">
        <p>couldn't load events. check your connection.</p>
        <PillButton variant="secondary" onClick={onRetry}>
          try again
        </PillButton>
      </div>
    )
  }

  if (!events) {
    return (
      <div className={GRID} aria-busy="true" aria-label="Loading events">
        <EventCardSkeleton />
        <EventCardSkeleton />
        <EventCardSkeleton />
      </div>
    )
  }

  if (!events.length) {
    return <div className="rounded-card border border-dashed border-line p-6 text-center text-ink-muted">{empty}</div>
  }

  return (
    <ul className={GRID} aria-busy={loading}>
      {events.map((e, i) => (
        <li key={e.id}>
          <EventCard event={e} showWhy={showWhy} picked={showWhy && i === 0 && !!e.why} />
        </li>
      ))}
    </ul>
  )
}
