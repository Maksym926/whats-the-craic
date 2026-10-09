import { PagePlaceholder } from "@/components/PagePlaceholder"
import { PillButton } from "@/components/PillButton"
import { useProfile } from "@/context/profile"

export default function Profile() {
  const { profile, clearProfile } = useProfile()

  return (
    <PagePlaceholder title="you" note={`Signed up as ${profile?.name}. Edit screen: built in Phase 7.`}>
      {/* RequireProfile sends the student back to Welcome once cleared. */}
      <PillButton variant="secondary" className="self-start" onClick={clearProfile}>
        reset profile
      </PillButton>
    </PagePlaceholder>
  )
}
