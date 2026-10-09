import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AppShell } from "@/components/AppShell"
import { FlowLayout } from "@/components/FlowLayout"
import { RedirectIfProfile, RequireProfile } from "@/components/ProfileGate"
import { ScrollToTop } from "@/components/ScrollToTop"
import { TabLayout } from "@/components/TabLayout"
import EventDetail from "@/pages/EventDetail"
import Food from "@/pages/Food"
import Login from "@/pages/Login"
import Onboarding from "@/pages/Onboarding"
import Profile from "@/pages/Profile"
import Recommends from "@/pages/Recommends"
import Registration from "@/pages/Registration"
import Welcome from "@/pages/Welcome"

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppShell>
        <Routes>
          {/* Sign-up flow: only while there's no profile */}
          <Route element={<RedirectIfProfile />}>
            <Route path="/" element={<Welcome />} />
            <Route element={<FlowLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/onboarding" element={<Onboarding />} />
            </Route>
          </Route>

          {/* App: needs a profile */}
          <Route element={<RequireProfile />}>
            <Route element={<TabLayout />}>
              <Route path="/events" element={<Recommends />} />
              <Route path="/food" element={<Food />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            {/* Own bottom action on phones; still gets the desktop sidebar */}
            <Route element={<TabLayout bottomNav={false} />}>
              <Route path="/events/:id" element={<EventDetail />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
