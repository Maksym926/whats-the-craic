import { PagePlaceholder } from "@/components/PagePlaceholder"
import { Button } from "@/components/ui/button"
import { useProfile } from "@/context/profile"

export default function Profile() {
  const { profile, clearProfile } = useProfile()

  return (
    <PagePlaceholder title="Profile" note={`Signed up as ${profile?.name}. Edit screen: built in Phase 7.`}>
      {/* RequireProfile sends the student back to Welcome once cleared. */}
      <Button variant="outline" className="h-12 text-base" onClick={clearProfile}>
        Reset profile
      </Button>
    </PagePlaceholder>
  )
}
