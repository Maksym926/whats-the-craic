import { ThumbsDown, ThumbsUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedbackPromptProps {
  /** Event name in the question: "How was the welcome night?" */
  eventTitle: string
  /** Chosen vote, if any: true = 👍, false = 👎 */
  liked?: boolean
  onVote: (liked: boolean) => void
  className?: string
}

/**
 * Brand FeedbackPrompt (`wtc-feedback`): one question + thumbs up/down.
 * The icon carries the meaning; colour (positive/negative) only confirms the choice.
 */
export function FeedbackPrompt({ eventTitle, liked, onVote, className }: FeedbackPromptProps) {
  return (
    <div className={cn("wtc-feedback max-w-none", className)}>
      <div className="min-w-0">
        <p className="wtc-feedback__q">How was {eventTitle}?</p>
        <p className="wtc-feedback__sub">Your answer tunes what we pick next.</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          className="wtc-thumb wtc-thumb--up"
          aria-label="Liked it"
          aria-pressed={liked === true}
          onClick={() => onVote(true)}
        >
          <ThumbsUp aria-hidden />
        </button>
        <button
          type="button"
          className="wtc-thumb wtc-thumb--down"
          aria-label="Not for me"
          aria-pressed={liked === false}
          onClick={() => onVote(false)}
        >
          <ThumbsDown aria-hidden />
        </button>
      </div>
    </div>
  )
}
