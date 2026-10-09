import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { Chip } from "@/components/Chip"
import { PillButton } from "@/components/PillButton"
import { StepHeader } from "@/components/StepHeader"
import { useProfile } from "@/context/profile"
import { CATEGORY_LABEL, GOAL_LABEL } from "@/lib/categories"
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
        title="what are you into?"
        subtitle={`Nice one, ${draft.name}. Pick as many as you like.`}
        backTo="/register"
      />

      <div className="flex flex-col gap-8 px-4 py-8">
        <section aria-label="Interests" className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip key={c} selected={interests.includes(c)} onClick={() => toggleInterest(c)}>
              {CATEGORY_LABEL[c]}
            </Chip>
          ))}
          <Chip selected={livesInAccommodation} onClick={() => setLivesInAccommodation((v) => !v)}>
            i'm in accommodation
          </Chip>
        </section>

        <section aria-labelledby="goal-heading" className="flex flex-col gap-4">
          <h2 id="goal-heading" className="type-title">
            main goal this term?
          </h2>
          <div role="radiogroup" aria-labelledby="goal-heading" className="grid grid-cols-2 gap-2">
            {GOALS.map((g) => (
              <button
                key={g}
                type="button"
                role="radio"
                aria-checked={goal === g}
                onClick={() => setGoal(g)}
                className={cn(
                  "type-heading flex min-h-16 items-center gap-2 rounded-card border p-4 text-left transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-craic-blue-text",
                  goal === g
                    ? "border-craic-blue bg-blue-soft text-craic-blue-text"
                    : "border-line bg-surface-raised hover:border-ink-muted",
                )}
              >
                {goal === g && <span className="wtc-dot size-1.5" aria-hidden />}
                {GOAL_LABEL[g]}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-2 border-t border-line bg-surface p-4">
        {error && (
          <p role="alert" className="type-small text-negative">
            {error}
          </p>
        )}
        <PillButton className="w-full" disabled={missing.length > 0 || saving} onClick={finish}>
          {saving ? "saving…" : "show me events"}
        </PillButton>
        {missing.length > 0 && (
          <p className="type-small text-center text-ink-muted">Pick {missing.join(" and ")} to continue.</p>
        )}
      </div>
    </div>
  )
}
