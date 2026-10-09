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
    <header className="flex flex-col gap-4 px-6 pt-4">
      <div className="flex items-center justify-between">
        <Link
          to={backTo}
          aria-label="Back"
          className="-ml-3 flex size-11 items-center justify-center rounded-full hover:bg-muted"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
        <span className="text-sm text-muted-foreground">
          Step {step} of {total}
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-label="Sign-up progress"
      >
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(step / total) * 100}%` }} />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
    </header>
  )
}
