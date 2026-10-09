import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Chip } from "@/components/Chip"
import { StepHeader } from "@/components/StepHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { isValidEmail, loadDraft, saveDraft, type RegistrationDraft } from "@/lib/registrationDraft"
import { COLLEGES, YEARS } from "@/types"

type Errors = Partial<Record<keyof RegistrationDraft, string>>

const EMPTY: RegistrationDraft = { name: "", college: "", year: "", email: "", emailNotifications: false }

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
      <StepHeader step={1} total={2} title="About you" subtitle="So we can find events at your college." backTo="/" />

      <div className="flex flex-col gap-6 px-6 py-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">First name</Label>
          <Input
            id="name"
            autoComplete="given-name"
            placeholder="e.g. Aoife"
            className="h-12 text-base"
            value={draft.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          <FieldError id="name-error" message={errors.name} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="college">College</Label>
          <Select value={draft.college} onValueChange={(v) => update("college", v)}>
            <SelectTrigger
              id="college"
              className="w-full text-base data-[size=default]:h-12"
              aria-invalid={!!errors.college}
              aria-describedby={errors.college ? "college-error" : undefined}
            >
              <SelectValue placeholder="Choose your college" />
            </SelectTrigger>
            <SelectContent>
              {COLLEGES.map((c) => (
                <SelectItem key={c} value={c} className="min-h-11 text-base">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError id="college-error" message={errors.college} />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">Year</legend>
          <div role="radiogroup" aria-label="Year" className="flex flex-wrap gap-2">
            {YEARS.map((y) => (
              <Chip key={y} mode="radio" selected={draft.year === y} onClick={() => update("year", y)}>
                {y}
              </Chip>
            ))}
          </div>
          <FieldError id="year-error" message={errors.year} />
        </fieldset>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">
            Email <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@college.ie"
            className="h-12 text-base"
            value={draft.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>

        <label htmlFor="email-notifications" className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-xl border p-4">
          <span className="flex flex-col gap-0.5">
            <span id="email-notifications-label" className="font-medium">
              Email me about events I'd like
            </span>
            <span className="text-sm text-muted-foreground">You can turn this off any time in Profile.</span>
          </span>
          <Switch
            id="email-notifications"
            aria-labelledby="email-notifications-label"
            checked={draft.emailNotifications}
            onCheckedChange={(on) => update("emailNotifications", on)}
          />
        </label>
      </div>

      <div className="sticky bottom-0 mt-auto border-t bg-background p-4">
        <Button type="submit" className="h-12 w-full text-base">
          Next
        </Button>
      </div>
    </form>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  )
}
