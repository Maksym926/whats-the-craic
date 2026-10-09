import { useState } from "react"
import { Chip } from "@/components/Chip"
import { PillButton } from "@/components/PillButton"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const REASONS = {
  liked: ["great people", "good food", "fun vibe", "learned something", "well organised"],
  disliked: ["not my thing", "too crowded", "no one to talk to", "badly organised", "too far"],
} as const

interface CheckInSheetProps {
  /** The vote that opened the sheet; null = closed. */
  liked: boolean | null
  /** Called once, with any reasons picked. Closing the sheet counts as "no reasons". */
  onSubmit: (reasons: string[]) => void
}

/** After a 👍/👎: optional reasons, then done. The vote is saved however the sheet closes. */
export function CheckInSheet({ liked, onSubmit }: CheckInSheetProps) {
  const [reasons, setReasons] = useState<string[]>([])
  const options = liked ? REASONS.liked : REASONS.disliked

  const toggle = (r: string) => setReasons((list) => (list.includes(r) ? list.filter((x) => x !== r) : [...list, r]))

  const submit = () => {
    onSubmit(reasons)
    setReasons([])
  }

  return (
    <Sheet open={liked !== null} onOpenChange={(open) => !open && submit()}>
      <SheetContent
        side="bottom"
        className="mx-auto max-w-[430px] gap-6 rounded-t-tile border-line bg-surface px-4 pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-none"
      >
        <SheetHeader className="gap-2 px-0 pt-4 pr-10">
          {/* = type-title, as utilities so they win over SheetTitle's own text classes */}
          <SheetTitle className="font-display text-2xl leading-7 font-semibold tracking-[-0.02em] text-ink">{liked ? "nice one. what made it?" : "fair enough. what was off?"}</SheetTitle>
          <SheetDescription className="text-ink-muted">Optional. Pick any that fit.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-wrap gap-2">
          {options.map((r) => (
            <Chip key={r} selected={reasons.includes(r)} onClick={() => toggle(r)}>
              {r}
            </Chip>
          ))}
        </div>

        <PillButton className="w-full" onClick={submit}>
          done
        </PillButton>
      </SheetContent>
    </Sheet>
  )
}
