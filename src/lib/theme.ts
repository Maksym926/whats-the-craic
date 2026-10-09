// Brand themes: Night (dark, the app's hero theme) and Paper (light).

import { readJSON, writeJSON } from "@/lib/storage"

export type Theme = "dark" | "light"

const KEY = "craic.theme"
const BACKGROUND: Record<Theme, string> = { dark: "#171717", light: "#ffffff" }

export const getTheme = (): Theme => readJSON<Theme>(KEY, "dark")

/** Point <html data-theme> (which tokens.css keys off) and the browser chrome at a theme. */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", BACKGROUND[theme])
}

export function saveTheme(theme: Theme): void {
  writeJSON(KEY, theme)
  applyTheme(theme)
}
