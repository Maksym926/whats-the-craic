import inkWordmark from "@/assets/wordmark-ink.png"
import paperWordmark from "@/assets/wordmark-paper.png"
import { cn } from "@/lib/utils"

/** Brand wordmark: ink version on Paper, paper version on Night. Never recolour or stretch. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <>
      <img src={inkWordmark} alt="What's The Craic" className={cn("block h-auto night:hidden", className)} />
      <img src={paperWordmark} alt="What's The Craic" className={cn("hidden h-auto night:block", className)} />
    </>
  )
}
