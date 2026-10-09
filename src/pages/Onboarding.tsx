import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { Chip } from "@/components/Chip"
import { StepHeader } from "@/components/StepHeader"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useProfile } from "@/context/profile"
import { CATEGORY_EMOJI, GOAL_EMOJI } from "@/lib/categories"
import { clearDraft, loadDraft } from "@/lib/registrationDraft"
import { cn } from "@/lib/utils"
import { CATEGORIES, GOALS, type Category, type Goal } from "@/types"

export default function Onboarding() {
  const navigate = useNavigate()
  const { saveProfile } = useProfile()
  const [draft] = useState(loadDraft)
  const [interests, setInterests] = useState<Category[]>([])
  const [livesInAccommodation, setLivesInAccommodation] = useState(false)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Came here directly without step 1.
  if (!draft) return <Navigate to="/register" replace />

  const toggleInterest = (c: Category) =>
    setInterests((list) => (list.includes(c) ? list.filter((x) => x !== c) : [...list, c]))

  const missing = [!interests.length && "at least one interest", !goal && "a goal"].filter(Boolean)

  const finish = async () => {
    if (!goal || !interests.length) return
    setSaving(true)
    setError(null)
    try {
      await saveProfile({ ...draft, interests, livesInAccommodation, goal })
      clearDraft()
      navigate("/events", { replace: true })
    } catch {
      setError("Couldn't save your profile. Check your connection and try again.")
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <StepHeader
        step={2}
        total={2}
        title={`Nice one, ${draft.name}! What are you into?`}
        subtitle="Pick as many as you like."
        backTo="/register"
      />

      <div className="flex flex-col gap-8 px-6 py-6">
        <section aria-labelledby="interests-heading" className="flex flex-col gap-3">
          <h2 id="interests-heading" className="sr-only">
            Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Chip key={c} selected={interests.includes(c)} onClick={() => toggleInterest(c)}>
                <span aria-hidden>{CATEGORY_EMOJI[c]}</span>
                {c}
              </Chip>
            ))}
          </div>
        </section>

        <label htmlFor="accommodation" className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-xl border p-4">
          <span className="flex flex-col gap-0.5">
            <span id="accommodation-label" className="font-medium">
              I live in student accommodation
            </span>
            <span className="text-sm text-muted-foreground">We'll show you more halls and meet-up events.</span>
          </span>
          <Switch id="accommodation" aria-labelledby="accommodation-label" checked={livesInAccommodation} onCheckedChange={setLivesInAccommodation} />
        </label>

        <section aria-labelledby="goal-heading" className="flex flex-col gap-3">
          <h2 id="goal-heading" className="text-lg font-semibold">
            What's your main goal this term?
          </h2>
          <div role="radiogroup" aria-labelledby="goal-heading" className="grid grid-cols-2 gap-3">
            {GOALS.map((g) => (
              <button
                key={g}
                type="button"
                role="radio"
                aria-checked={goal === g}
                onClick={() => setGoal(g)}
                className={cn(
                  "flex min-h-20 flex-col items-start justify-center gap-1 rounded-xl border p-4 text-left font-medium transition-colors",
                  "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  goal === g ? "border-primary bg-secondary ring-2 ring-primary" : "hover:bg-muted",
                )}
              >
                <span className="text-2xl" aria-hidden>
                  {GOAL_EMOJI[g]}
                </span>
                {g}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-2 border-t bg-background p-4">
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button className="h-12 w-full text-base" disabled={missing.length > 0 || saving} onClick={finish}>
          {saving ? "Saving…" : "Show me events"}
        </Button>
        {missing.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">Pick {missing.join(" and ")} to continue.</p>
        )}
      </div>
    </div>
  )
}
