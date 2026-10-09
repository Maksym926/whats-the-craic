import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

interface ChipProps extends Omit<ComponentProps<"button">, "type"> {
  selected: boolean
  /** "toggle" for multi-select (aria-pressed), "radio" inside a role="radiogroup" */
  mode?: "toggle" | "radio"
}

/**
 * Brand InterestChip (`wtc-chip`): 36px pill; selected = blue-soft fill, blue border and a blue dot.
 * The invisible ::after stretches the tap area to 44px without changing the look.
 */
export function Chip({ selected, mode = "toggle", className, ...props }: ChipProps) {
  const a11y = mode === "radio" ? { role: "radio", "aria-checked": selected } : { "aria-pressed": selected }
  return (
    <button
      type="button"
      {...a11y}
      className={cn("wtc-chip relative shrink-0 after:absolute after:inset-x-0 after:-inset-y-1 after:content-['']", className)}
      {...props}
    />
  )
}
