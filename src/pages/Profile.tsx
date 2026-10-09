import { ThumbsDown, ThumbsUp } from "lucide-react"
import { useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import * as api from "@/api"
import { Chip } from "@/components/Chip"
import { FieldError } from "@/components/FieldError"
import { PillButton } from "@/components/PillButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useProfile } from "@/context/profile"
import { useAsync } from "@/hooks/useAsync"
import { CATEGORY_LABEL, GOAL_LABEL } from "@/lib/categories"
import { FIELD } from "@/lib/formStyles"
import { formatWhen } from "@/lib/format"
import { sameEmail, validateDetails, type DetailErrors } from "@/lib/registrationDraft"
import { getTheme, saveTheme, type Theme } from "@/lib/theme"
import { CATEGORIES, COLLEGES, GOALS, YEARS, type Category, type Profile as ProfileData } from "@/types"

export default function Profile() {
  const { profile } = useProfile()
  // RequireProfile guarantees a profile; the guard just narrows the type.
  return profile ? <ProfileScreen profile={profile} /> : null
}

type Status = "idle" | "saving" | "saved" | "error"

function ProfileScreen({ profile }: { profile: ProfileData }) {
  const { saveProfile } = useProfile()
  const [form, setForm] = useState<ProfileData>(profile)
  const [errors, setErrors] = useState<DetailErrors & { interests?: string }>({})
  const [status, setStatus] = useState<Status>("idle")

  const dirty = JSON.stringify(form) !== JSON.stringify(profile)

  const update = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
    setStatus("idle")
  }

  const toggleInterest = (c: Category) => {
    // Functional update: two quick taps must not overwrite each other.
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(c) ? f.interests.filter((x) => x !== c) : [...f.interests, c],
    }))
    setErrors((e) => ({ ...e, interests: undefined }))
    setStatus("idle")
  }

  const save = async () => {
    const found: DetailErrors & { interests?: string } = validateDetails(form)
    if (!form.interests.length) found.interests = "Pick at least one."
    setErrors(found)
    if (Object.keys(found).length) return

    setStatus("saving")
    try {
      // Email is the login, so it must stay unique.
      if (!sameEmail(form.email, profile.email) && (await api.emailTaken(form.email))) {
        setErrors({ email: "Another account already uses that email." })
        setStatus("idle")
        return
      }
      await saveProfile({ ...form, name: form.name.trim(), email: form.email.trim() })
      setStatus("saved")
      setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 3000)
    } catch {
      setStatus("error")
    }
  }

  const discard = () => {
    setForm(profile)
    setErrors({})
    setStatus("idle")
  }

  return (
    // Forms read best narrow, even on desktop.
    <main className="flex w-full flex-col lg:max-w-2xl">
      <header className="flex flex-col gap-2 px-4 pt-8 pb-6 lg:pt-12">
        <p className="type-eyebrow text-ink-muted">your profile</p>
        <h1 className="type-display-l break-words lg:type-display-xl">{profile.name}</h1>
        <p className="text-ink-muted">
          {profile.college} · {profile.year.toLowerCase()}
        </p>
      </header>

      <Section title="your details">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="type-label">
            first name
          </Label>
          <Input
            id="name"
            autoComplete="given-name"
            className={FIELD}
            value={form.name}
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
          <Select value={form.college} onValueChange={(v) => update("college", v)}>
            <SelectTrigger id="college" className={`w-full ${FIELD}`} aria-invalid={!!errors.college}>
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
              <Chip key={y} mode="radio" selected={form.year === y} onClick={() => update("year", y)}>
                {y.toLowerCase()}
              </Chip>
            ))}
          </div>
        </fieldset>
      </Section>

      <Section title="what you're into">
        <div className="flex flex-wrap gap-2" aria-label="Interests">
          {CATEGORIES.map((c) => (
            <Chip key={c} selected={form.interests.includes(c)} onClick={() => toggleInterest(c)}>
              {CATEGORY_LABEL[c]}
            </Chip>
          ))}
          <Chip selected={form.livesInAccommodation} onClick={() => setForm((f) => ({ ...f, livesInAccommodation: !f.livesInAccommodation }))}>
            i'm in accommodation
          </Chip>
        </div>
        <FieldError id="interests-error" message={errors.interests} />
      </Section>

      <Section title="main goal">
        <div role="radiogroup" aria-label="Main goal" className="flex flex-wrap gap-2">
          {GOALS.map((g) => (
            <Chip key={g} mode="radio" selected={form.goal === g} onClick={() => update("goal", g)}>
              {GOAL_LABEL[g]}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="emails">
        <label
          htmlFor="email-notifications"
          className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-card border border-line bg-surface-raised p-4"
        >
          <span id="email-notifications-label" className="type-heading">
            email me events i'd like
          </span>
          <Switch
            id="email-notifications"
            aria-labelledby="email-notifications-label"
            checked={form.emailNotifications}
            onCheckedChange={(on) => update("emailNotifications", on)}
          />
        </label>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="type-label">
            email <span className="font-normal text-ink-muted">(you log in with this)</span>
          </Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@college.ie"
            className={FIELD}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
      </Section>

      <CheckInHistory />
      <Appearance />
      <Account />

      {(dirty || status === "saved") && (
        <div className="sticky bottom-16 z-10 flex items-center gap-2 border-t border-line bg-surface p-4 lg:bottom-0">
          {dirty ? (
            <>
              <PillButton variant="ghost" onClick={discard} disabled={status === "saving"}>
                discard
              </PillButton>
              <PillButton className="flex-1" onClick={save} disabled={status === "saving"}>
                {status === "saving" ? "saving…" : "save changes"}
              </PillButton>
            </>
          ) : (
            <p role="status" className="type-small w-full text-center text-ink-muted">
              Saved. Your picks are updated.
            </p>
          )}
        </div>
      )}
      {status === "error" && (
        <p role="alert" className="type-small px-4 pb-4 text-negative">
          Couldn't save. Check your connection and try again.
        </p>
      )}
    </main>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-line px-4 py-6">
      <h2 className="type-title">{title}</h2>
      {children}
    </section>
  )
}

/** What the student has rated: makes the learning loop visible. */
function CheckInHistory() {
  const { data } = useAsync(api.getCheckInHistory)

  return (
    <Section title="your check-ins">
      {!data ? null : data.length === 0 ? (
        <p className="text-ink-muted">Nothing yet. After an event you went to, we'll ask how it was.</p>
      ) : (
        <ul className="flex flex-col">
          {data.map(({ event, feedback }) => (
            <li key={event.id} className="border-b border-line last:border-b-0">
              <Link
                to={`/events/${event.id}`}
                className="flex min-h-14 items-center justify-between gap-4 py-3 focus-visible:outline-2 focus-visible:outline-craic-blue-text"
              >
                <span className="flex min-w-0 flex-col">
                  <span className="type-heading truncate">{event.title}</span>
                  <span className="type-small text-ink-muted">{formatWhen(event.start)}</span>
                </span>
                <Verdict went={feedback.went} liked={feedback.liked} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

function Verdict({ went, liked }: { went: boolean; liked?: boolean }) {
  if (!went || liked === undefined) return <span className="type-small shrink-0 text-ink-muted">didn't go</span>
  return liked ? (
    <span className="type-label flex shrink-0 items-center gap-1 text-positive">
      <ThumbsUp className="size-4" aria-hidden /> liked
    </span>
  ) : (
    <span className="type-label flex shrink-0 items-center gap-1 text-negative">
      <ThumbsDown className="size-4" aria-hidden /> not for me
    </span>
  )
}

/** Night (the app's hero theme) or Paper. Saved on this device only. */
function Appearance() {
  const [theme, setTheme] = useState<Theme>(getTheme)
  const choose = (t: Theme) => {
    setTheme(t)
    saveTheme(t)
  }

  return (
    <Section title="appearance">
      <div role="radiogroup" aria-label="Theme" className="flex gap-2">
        <Chip mode="radio" selected={theme === "dark"} onClick={() => choose("dark")}>
          night
        </Chip>
        <Chip mode="radio" selected={theme === "light"} onClick={() => choose("light")}>
          paper
        </Chip>
      </div>
    </Section>
  )
}

/**
 * Log out keeps the account (log back in with the same email).
 * Start over also deletes it (mock mode). Either way RequireProfile then sends the student to Welcome.
 */
function Account() {
  const { profile, logOut, startOver } = useProfile()
  const [confirming, setConfirming] = useState(false)

  return (
    <Section title="account">
      <p className="text-ink-muted">Logged in as {profile?.email}</p>
      {confirming ? (
        <div className="flex flex-col gap-4">
          <p>This deletes your profile, plans and check-ins.</p>
          <div className="flex gap-2">
            <PillButton variant="secondary" onClick={startOver}>
              yes, delete
            </PillButton>
            <PillButton variant="ghost" onClick={() => setConfirming(false)}>
              cancel
            </PillButton>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <PillButton variant="secondary" onClick={logOut}>
            log out
          </PillButton>
          <PillButton variant="ghost" onClick={() => setConfirming(true)}>
            start over
          </PillButton>
        </div>
      )}
    </Section>
  )
}
