import { useState } from "react"
import * as api from "@/api"
import { CheckInSheet } from "@/components/CheckInSheet"
import { FeedbackPrompt } from "@/components/FeedbackPrompt"
import { PillButton } from "@/components/PillButton"
import type { Event, Feedback } from "@/types"

interface CheckInProps {
  event: Event
  /** After the answer is saved (or dismissed). */
  onDone: (feedback: Feedback | null) => void
  /** Offer "not now" (feed). On the event page there's nothing to dismiss. */
  dismissible?: boolean
}

/** Post-event check-in: did you go, 👍/👎, optional reasons. Asks once per event. */
export function CheckIn({ event, onDone, dismissible = true }: CheckInProps) {
  const [vote, setVote] = useState<boolean | null>(null)
  const [error, setError] = useState(false)

  const save = async (feedback: Feedback) => {
    setError(false)
    try {
      await api.sendFeedback(feedback)
      onDone(feedback)
    } catch {
      setError(true)
    }
  }

  const finish = (reasons: string[]) => {
    if (vote === null) return
    const liked = vote
    setVote(null)
    void save({ eventId: event.id, went: true, liked, reasons })
  }

  const notNow = () => {
    api.dismissCheckIn(event.id)
    onDone(null)
  }

  return (
    <section aria-label="Check in" className="flex flex-col gap-2">
      <FeedbackPrompt eventTitle={event.title} liked={vote ?? undefined} onVote={setVote} />
      <div className="flex justify-end">
        <PillButton variant="ghost" small onClick={() => save({ eventId: event.id, went: false })}>
          didn't go
        </PillButton>
        {dismissible && (
          <PillButton variant="ghost" small onClick={notNow}>
            not now
          </PillButton>
        )}
      </div>
      {error && (
        <p role="alert" className="type-small text-negative">
          Couldn't save that. Try again.
        </p>
      )}
      <CheckInSheet liked={vote} onSubmit={finish} />
    </section>
  )
}
