import { Link } from "react-router-dom"
import { PagePlaceholder } from "@/components/PagePlaceholder"
import { Button } from "@/components/ui/button"

export default function Registration() {
  return (
    <PagePlaceholder title="Registration" note="Name, college, year, email: built in Phase 4.">
      <Button asChild className="h-12 text-base">
        <Link to="/onboarding">Next</Link>
      </Button>
    </PagePlaceholder>
  )
}
