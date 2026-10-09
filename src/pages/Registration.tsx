import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import * as api from "@/api"
import { Chip } from "@/components/Chip"
import { FieldError } from "@/components/FieldError"
import { PillButton } from "@/components/PillButton"
import { StepHeader } from "@/components/StepHeader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { FIELD } from "@/lib/formStyles"
import {
  loadDraft,
  saveDraft,
  validateDetails,
  type DetailErrors,
  type RegistrationDraft,
} from "@/lib/registrationDraft"
import { COLLEGES, YEARS } from "@/types"

const EMPTY: RegistrationDraft = { name: "", college: "", year: "", email: "", emailNotifications: false }

export default function Registration() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState<RegistrationDraft>(() => loadDraft() ?? EMPTY)
  const [errors, setErrors] = useState<DetailErrors>({})
  // Email already registered → offer log in instead.
  const [taken, setTaken] = useState(false)
  const [checking, setChecking] = useState(false)

  const update = <K extends keyof RegistrationDraft>(key: K, value: RegistrationDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
    if (key === "email") setTaken(false)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validateDetails(draft)
    setErrors(found)
    if (Object.keys(found).length) return

    const clean = { ...draft, name: draft.name.trim(), email: draft.email.trim() }
    saveDraft(clean)
    setChecking(true)
    try {
      if (await api.emailTaken(clean.email)) {
        setTaken(true)
        return
      }
    } catch {
      // Can't check right now; Onboarding's save will surface any real problem.
    } finally {
      setChecking(false)
    }
    navigate("/onboarding")
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
      <StepHeader step={1} total={2} title="about you" subtitle="So we can find events at your college." backTo="/" />

      <div className="flex flex-col gap-6 px-4 py-8">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="type-label">
            first name
          </Label>
          <Input
            id="name"
            autoComplete="given-name"
            placeholder="e.g. Aoife"
            className={FIELD}
            value={draft.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          <FieldError id="name-error" message={errors.name} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="college" className="type-label">
            college
          </Label>
          <Select value={draft.college} onValueChange={(v) => update("college", v)}>
            <SelectTrigger
              id="college"
              className={`w-full ${FIELD}`}
              aria-invalid={!!errors.college}
              aria-describedby={errors.college ? "college-error" : undefined}
            >
              <SelectValue placeholder="Choose your college" />
            </SelectTrigger>
            <SelectContent className="rounded-card border-line">
              {COLLEGES.map((c) => (
                <SelectItem key={c} value={c} className="min-h-11 text-[15px]">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError id="college-error" message={errors.college} />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="type-label mb-2">year</legend>
          <div role="radiogroup" aria-label="Year" className="flex flex-wrap gap-2">
            {YEARS.map((y) => (
              <Chip key={y} mode="radio" selected={draft.year === y} onClick={() => update("year", y)}>
                {y.toLowerCase()}
              </Chip>
            ))}
          </div>
          <FieldError id="year-error" message={errors.year} />
        </fieldset>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="type-label">
            email
          </Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@college.ie"
            className={FIELD}
            value={draft.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={!!errors.email || taken}
            aria-describedby={errors.email || taken ? "email-error" : "email-hint"}
          />
          {taken ? (
            <p id="email-error" role="alert" className="type-small text-negative">
              There's already an account with that email.{" "}
              <Link to="/login" className="font-semibold text-ink underline underline-offset-4">
                Log in instead
              </Link>
            </p>
          ) : errors.email ? (
            <FieldError id="email-error" message={errors.email} />
          ) : (
            <p id="email-hint" className="type-small text-ink-muted">
              You'll use this to log back in. No password needed.
            </p>
          )}
        </div>

        <label
          htmlFor="email-notifications"
          className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-card border border-line bg-surface-raised p-4"
        >
          <span className="flex flex-col gap-0.5">
            <span id="email-notifications-label" className="type-heading">
              email me events i'd like
            </span>
            <span className="type-small text-ink-muted">Turn it off any time in your profile.</span>
          </span>
          <Switch
            id="email-notifications"
            aria-labelledby="email-notifications-label"
            checked={draft.emailNotifications}
            onCheckedChange={(on) => update("emailNotifications", on)}
          />
        </label>
      </div>

      <div className="sticky bottom-0 mt-auto border-t border-line bg-surface p-4">
        <PillButton type="submit" className="w-full" disabled={checking}>
          {checking ? "checking…" : "next"}
        </PillButton>
      </div>
    </form>
  )
}
