import { Link } from "react-router-dom"
import { PillButton } from "@/components/PillButton"
import { Wordmark } from "@/components/Wordmark"

const POINTS = [
  { title: "picked for you", text: "Every society, SU and college event in one feed, sorted by what you're into." },
  { title: "free food, found", text: "Never miss a slice on campus again." },
  { title: "always says why", text: "Rate what you went to and the picks get better." },
]

/** Phone: one column. Desktop: wordmark hero on the left, points + actions on the right. */
export default function Welcome() {
  return (
    <main className="mx-auto flex w-full max-w-[430px] flex-1 flex-col px-4 md:max-w-[480px] lg:grid lg:max-w-6xl lg:grid-cols-2 lg:content-center lg:items-center lg:gap-24 lg:px-12">
      <section className="flex flex-col gap-6 py-12 lg:gap-8">
        <Wordmark className="w-56 lg:w-[26rem]" />
        <p className="type-heading text-ink-muted lg:type-title">Find your people on campus.</p>
      </section>

      <div className="flex flex-1 flex-col lg:flex-none">
        <ul className="flex flex-col">
          {POINTS.map(({ title, text }) => (
            <li key={title} className="flex flex-col gap-1 border-t border-line py-4">
              <span className="type-heading">{title}</span>
              <span className="text-ink-muted">{text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-3 pt-8 pb-8 lg:mt-4">
          <PillButton asChild className="w-full">
            <Link to="/register">get started</Link>
          </PillButton>
          <PillButton asChild variant="secondary" className="w-full">
            <Link to="/login">log in</Link>
          </PillButton>
          <p className="type-small text-center text-ink-muted">No password needed. Takes about 30 seconds.</p>
        </div>
      </div>
    </main>
  )
}
