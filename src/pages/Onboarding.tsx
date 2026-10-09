import { PagePlaceholder } from "@/components/PagePlaceholder"
import { Button } from "@/components/ui/button"
import { useProfile } from "@/context/profile"

export default function Onboarding() {
  const { saveProfile } = useProfile()

  // Placeholder: saves a demo profile so the rest of the app can be clicked through.
  // RedirectIfProfile then sends the student on to /events.
  const finish = () =>
    saveProfile({
      name: "Demo Student",
      college: "TU Dublin",
      year: "1st year",
      interests: ["Free food", "Social", "Sport"],
      livesInAccommodation: true,
      goal: "Make friends",
    })

  return (
    <PagePlaceholder title="Onboarding" note="Interests, accommodation, goal: built in Phase 4.">
      <Button className="h-12 text-base" onClick={finish}>
        Finish (demo profile)
      </Button>
    </PagePlaceholder>
  )
}
