import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ProfileProvider } from './context/ProfileContext.tsx'
import { applyTheme, getTheme } from './lib/theme.ts'

// Before first render, so a Paper user never sees a flash of Night.
applyTheme(getTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProfileProvider>
      <App />
    </ProfileProvider>
  </StrictMode>,
)
