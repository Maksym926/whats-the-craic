import { cn } from "@/lib/utils"

/** The wordmark's blue dot as a status marker: "on now", "starts in 20 min", or muted "ended". */
export function LiveBadge({ label, muted = false, className }: { label: string; muted?: boolean; className?: string }) {
  return (
    <span className={cn("wtc-live", muted && "wtc-live--muted", className)}>
      <span className="wtc-dot" aria-hidden />
      {label}
    </span>
  )
}
