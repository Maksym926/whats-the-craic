import { ArrowLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { PagePlaceholder } from "@/components/PagePlaceholder"
import { Button } from "@/components/ui/button"

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <PagePlaceholder title="Event" note={`Details for "${id}": built in Phase 5.`}>
      <Button variant="outline" className="h-12 text-base" onClick={() => navigate(-1)}>
        <ArrowLeft aria-hidden /> Back
      </Button>
    </PagePlaceholder>
  )
}
