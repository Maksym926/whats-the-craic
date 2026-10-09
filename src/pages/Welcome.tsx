import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const POINTS = [
  { emoji: "🎯", text: "Events picked for you, from societies, the SU and college sites" },
  { emoji: "🍕", text: "Never miss free food on campus again" },
  { emoji: "👍", text: "Rate what you went to and your feed gets smarter" },
]

export default function Welcome() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-col items-center gap-3 bg-primary px-6 pt-16 pb-12 text-center text-primary-foreground">
        <span className="text-5xl" aria-hidden>
          🎉
        </span>
        <h1 className="text-4xl font-bold tracking-tight">What's The Craic</h1>
        <p className="text-lg opacity-90">Find your people and your plans on campus in Dublin.</p>
      </section>

      <ul className="flex flex-col gap-5 px-6 py-8">
        {POINTS.map(({ emoji, text }) => (
          <li key={text} className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-xl" aria-hidden>
              {emoji}
            </span>
            <span className="pt-2.5">{text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-3 px-6 pb-8">
        <Button asChild className="h-12 w-full text-base">
          <Link to="/register">Get started</Link>
        </Button>
        <p className="text-center text-sm text-muted-foreground">No password needed. Takes about 30 seconds.</p>
      </div>
    </main>
  )
}
