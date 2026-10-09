import { ArrowLeft } from "lucide-react"
import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FieldError } from "@/components/FieldError"
import { PillButton } from "@/components/PillButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useProfile } from "@/context/profile"
import { FIELD } from "@/lib/formStyles"
import { isValidEmail, loadDraft, saveDraft } from "@/lib/registrationDraft"

type LoginError = "empty" | "invalid" | "notFound" | "network"

const MESSAGES: Record<Exclude<LoginError, "notFound">, string> = {
  empty: "Add the email you signed up with.",
  invalid: "That email doesn't look right.",
  network: "Couldn't log in. Check your connection and try again.",
}

/** Email-only login: find the student's account and restore it on this device. */
export default function Login() {
  const { logIn } = useProfile()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<LoginError | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return setError("empty")
    if (!isValidEmail(email)) return setError("invalid")

    setBusy(true)
    setError(null)
    try {
      if (await logIn(email)) navigate("/events", { replace: true })
      else setError("notFound")
    } catch {
      setError("network")
    } finally {
      setBusy(false)
    }
  }

  // "Sign up instead" carries the email over to Registration.
  const signUpWithEmail = () => {
    const draft = loadDraft()
    saveDraft({
      name: draft?.name ?? "",
      college: draft?.college ?? "",
      year: draft?.year ?? "",
      emailNotifications: draft?.emailNotifications ?? false,
      email: email.trim(),
    })
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
      <header className="flex flex-col gap-6 px-4 pt-4">
        <Link
          to="/"
          aria-label="Back"
          className="flex size-11 items-center justify-center rounded-full border border-line hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-craic-blue-text"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="type-display-l">welcome back</h1>
          <p className="text-ink-muted">Log in with the email you signed up with.</p>
        </div>
      </header>

      <div className="flex flex-col gap-2 px-4 py-8">
        <Label htmlFor="email" className="type-label">
          email
        </Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus
          placeholder="you@college.ie"
          className={FIELD}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError(null)
          }}
          aria-invalid={!!error}
          aria-describedby={error ? "email-error" : undefined}
        />
        {error === "notFound" ? (
          <p id="email-error" role="alert" className="type-small text-negative">
            No account with that email.{" "}
            <Link
              to="/register"
              onClick={signUpWithEmail}
              className="font-semibold text-ink underline underline-offset-4"
            >
              Sign up instead
            </Link>
          </p>
        ) : (
          <FieldError id="email-error" message={error ? MESSAGES[error] : undefined} />
        )}
      </div>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-3 border-t border-line bg-surface p-4">
        <PillButton type="submit" className="w-full" disabled={busy}>
          {busy ? "logging in…" : "log in"}
        </PillButton>
        <p className="type-small text-center text-ink-muted">
          New here?{" "}
          <Link to="/register" className="font-semibold text-ink underline underline-offset-4">
            Get started
          </Link>
        </p>
      </div>
    </form>
  )
}
