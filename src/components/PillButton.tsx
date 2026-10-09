import { Slot } from "radix-ui"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

const VARIANT = {
  primary: "wtc-btn--primary",
  secondary: "wtc-btn--secondary",
  ghost: "wtc-btn--ghost",
} as const

interface PillButtonProps extends ComponentProps<"button"> {
  /** One primary per screen: it's the only big area of craic-blue. */
  variant?: keyof typeof VARIANT
  /** 36px, for inside cards */
  small?: boolean
  /** Render the child (e.g. a router <Link>) with button styles. */
  asChild?: boolean
}

/** Brand Button (design system `wtc-btn`): pill, lowercase label. */
export function PillButton({ variant = "primary", small, asChild, className, ...props }: PillButtonProps) {
  const Comp = asChild ? Slot.Root : "button"
  return <Comp className={cn("wtc-btn", VARIANT[variant], small && "wtc-btn--sm", className)} {...props} />
}
