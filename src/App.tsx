import { AppShell } from "@/components/AppShell"
import { Button } from "@/components/ui/button"

// Placeholder until routing lands (Step 3).
function App() {
  return (
    <AppShell>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-3xl font-bold">What's The Craic</h1>
        <p className="text-muted-foreground">Campus events, picked for you.</p>
        <Button className="h-12 w-full text-base">Get started</Button>
      </main>
    </AppShell>
  )
}

export default App
