import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

interface ChipProps extends Omit<ComponentProps<"button">, "type"> {
  selected: boolean
  /** "toggle" for multi-select (aria-pressed), "radio" inside a role="radiogroup" */
  mode?: "toggle" | "radio"
}

/** Large, tappable pill used for interests, year, goal and feed filters. */
export function Chip({ selected, mode = "toggle", className, ...props }: ChipProps) {
  const a11y = mode === "radio" ? { role: "radio", "aria-checked": selected } : { "aria-pressed": selected }
  return (
    <button
      type="button"
      {...a11y}
      className={cn(
        "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-background text-foreground hover:bg-muted",
        className,
      )}
      {...props}
    />
  )
}
