import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Chip } from "@/components/Chip"
import { PillButton } from "@/components/PillButton"
import { StepHeader } from "@/components/StepHeader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { isValidEmail, loadDraft, saveDraft, type RegistrationDraft } from "@/lib/registrationDraft"
import { COLLEGES, YEARS } from "@/types"

type Errors = Partial<Record<keyof RegistrationDraft, string>>

const EMPTY: RegistrationDraft = { name: "", college: "", year: "", email: "", emailNotifications: false }

// Brand input: surface-raised fill, 1px line, 8px radius, 48px tall.
const FIELD = "h-12 rounded-input border-line bg-surface-raised px-4 text-[15px]"

function validate(d: RegistrationDraft): Errors {
  const errors: Errors = {}
  if (!d.name.trim()) errors.name = "Tell us what to call you."
  if (!d.college) errors.college = "Pick your college."
  if (!d.year) errors.year = "Pick your year."
  if (d.emailNotifications && !d.email.trim()) errors.email = "Add your email to get event emails."
  else if (d.email.trim() && !isValidEmail(d.email)) errors.email = "That email doesn't look right."
  return errors
}

export default function Registration() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState<RegistrationDraft>(() => loadDraft() ?? EMPTY)
  const [errors, setErrors] = useState<Errors>({})

  const update = <K extends keyof RegistrationDraft>(key: K, value: RegistrationDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(draft)
    setErrors(found)
    if (Object.keys(found).length) return
    saveDraft({ ...draft, name: draft.name.trim(), email: draft.email.trim() })
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
              className={`w-full ${FIELD} data-[size=default]:h-12`}
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
            email <span className="font-normal text-ink-muted">(optional)</span>
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
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          <FieldError id="email-error" message={errors.email} />
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
        <PillButton type="submit" className="w-full">
          next
        </PillButton>
      </div>
    </form>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="type-small text-negative">
      {message}
    </p>
  )
}
