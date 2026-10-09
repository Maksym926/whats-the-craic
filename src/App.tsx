import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AppShell } from "@/components/AppShell"
import { RedirectIfProfile, RequireProfile } from "@/components/ProfileGate"
import { TabLayout } from "@/components/TabLayout"
import EventDetail from "@/pages/EventDetail"
import Food from "@/pages/Food"
import Onboarding from "@/pages/Onboarding"
import Profile from "@/pages/Profile"
import Recommends from "@/pages/Recommends"
import Registration from "@/pages/Registration"
import Welcome from "@/pages/Welcome"

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          {/* Sign-up flow: only while there's no profile */}
          <Route element={<RedirectIfProfile />}>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/onboarding" element={<Onboarding />} />
          </Route>

          {/* App: needs a profile */}
          <Route element={<RequireProfile />}>
            <Route element={<TabLayout />}>
              <Route path="/events" element={<Recommends />} />
              <Route path="/food" element={<Food />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/events/:id" element={<EventDetail />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
