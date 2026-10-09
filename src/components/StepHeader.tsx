import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

interface StepHeaderProps {
  step: number
  total: number
  title: string
  subtitle?: string
  backTo: string
}

export function StepHeader({ step, total, title, subtitle, backTo }: StepHeaderProps) {
  return (
    <header className="flex flex-col gap-6 px-4 pt-4">
      <div className="flex items-center justify-between">
        <Link
          to={backTo}
          aria-label="Back"
          className="flex size-11 items-center justify-center rounded-full border border-line hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-craic-blue-text"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
        <span className="type-eyebrow text-ink-muted">
          step {step} of {total}
        </span>
      </div>
      <div
        className="h-1 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-label="Sign-up progress"
      >
        <div className="h-full rounded-full bg-ink transition-all" style={{ width: `${(step / total) * 100}%` }} />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="type-display-l">{title}</h1>
        {subtitle && <p className="text-ink-muted">{subtitle}</p>}
      </div>
    </header>
  )
}
