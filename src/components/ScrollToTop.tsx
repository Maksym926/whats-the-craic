import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/** New page → start at the top (otherwise the detail page opens mid-scroll). */
export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
