import { useState } from "react"
import * as api from "@/api"
import { Chip } from "@/components/Chip"
import { EventList } from "@/components/EventList"
import { PillButton } from "@/components/PillButton"
import { useAsync } from "@/hooks/useAsync"
import { daysFromToday } from "@/lib/format"

type Range = "today" | "week"

export default function Food() {
  const { data: events, error, loading, reload } = useAsync(api.getFoodEvents)
  const [range, setRange] = useState<Range>("today")

  const today = events?.filter((e) => daysFromToday(e.start) === 0)
  const week = events?.filter((e) => daysFromToday(e.start) < 7)
  const shown = range === "today" ? today : week

  return (
    <main className="flex flex-col">
      <header className="flex flex-col gap-2 px-4 pt-8 pb-4">
        <p className="type-eyebrow text-ink-muted">hungry?</p>
        <h1 className="type-display-l">free food</h1>
      </header>

      <div className="sticky top-0 z-10 border-b border-line bg-surface px-4 py-3">
        <div role="radiogroup" aria-label="When" className="flex gap-2">
          <Chip mode="radio" selected={range === "today"} onClick={() => setRange("today")}>
            today{today && ` · ${today.length}`}
          </Chip>
          <Chip mode="radio" selected={range === "week"} onClick={() => setRange("week")}>
            this week{week && ` · ${week.length}`}
          </Chip>
        </div>
      </div>

      <div className="px-4 pt-6 pb-8">
        <EventList
          events={shown}
          loading={loading}
          error={error}
          onRetry={reload}
          empty={
            range === "today" ? (
              <div className="flex flex-col items-center gap-4">
                <p>No free food left today.</p>
                <PillButton variant="secondary" onClick={() => setRange("week")}>
                  see this week
                </PillButton>
              </div>
            ) : (
              <>No free food this week. We'll keep looking.</>
            )
          }
        />
      </div>
    </main>
  )
}
