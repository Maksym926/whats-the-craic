import { useCallback, useMemo, useState } from "react"
import * as api from "@/api"
import { EventList } from "@/components/EventList"
import { FilterChips } from "@/components/FilterChips"
import { useProfile } from "@/context/profile"
import { useAsync } from "@/hooks/useAsync"
import { CATEGORY_LABEL } from "@/lib/categories"
import { CATEGORIES, type Category } from "@/types"

export default function Recommends() {
  const { profile } = useProfile()
  const load = useCallback(() => (profile ? api.getFeed(profile) : Promise.resolve([])), [profile])
  const { data: events, error, loading, reload } = useAsync(load)
  const [filter, setFilter] = useState<Category | null>(null)

  // Only offer filters that have events; the student's interests first.
  const filterOptions = useMemo(() => {
    const present = new Set(events?.flatMap((e) => e.categories))
    const interests = profile?.interests ?? []
    return [...interests, ...CATEGORIES.filter((c) => !interests.includes(c))].filter((c) => present.has(c))
  }, [events, profile])

  const shown = filter ? events?.filter((e) => e.categories.includes(filter)) : events

  return (
    <main className="flex flex-col">
      <header className="flex flex-col gap-2 px-4 pt-8 pb-4">
        <p className="type-eyebrow text-ink-muted">hey {profile?.name}</p>
        <h1 className="type-display-l">picked for you</h1>
      </header>

      <div className="sticky top-0 z-10 border-b border-line bg-surface px-4 py-2">
        <FilterChips categories={filterOptions} selected={filter} onChange={setFilter} />
      </div>

      <div className="px-4 pt-6 pb-8">
        <EventList
          events={shown}
          loading={loading}
          error={error}
          onRetry={reload}
          showWhy
          empty={
            filter ? (
              <>No {CATEGORY_LABEL[filter]} coming up. Try another filter.</>
            ) : (
              <>Nothing coming up right now. Check back soon.</>
            )
          }
        />
      </div>
    </main>
  )
}
