import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Event } from "@/types"

/**
 * Event photo, full-bleed in a rounded tile, no filters or overlays (brand imagery rule).
 * Renders nothing when there's no image or it fails to load; the brand avoids placeholder art.
 */
export function EventImage({ event, className }: { event: Event; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (!event.imageUrl || failed) return null

  return (
    <img
      src={event.imageUrl}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("aspect-video w-full rounded-tile object-cover", className)}
    />
  )
}
