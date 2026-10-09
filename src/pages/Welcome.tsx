import { Link } from "react-router-dom"
import { PagePlaceholder } from "@/components/PagePlaceholder"
import { Button } from "@/components/ui/button"

export default function Welcome() {
  return (
    <PagePlaceholder title="What's The Craic" note="Welcome screen: built in Phase 4.">
      <Button asChild className="h-12 text-base">
        <Link to="/register">Get started</Link>
      </Button>
    </PagePlaceholder>
  )
}
