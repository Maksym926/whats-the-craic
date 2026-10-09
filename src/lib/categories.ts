import type { Category, Goal } from "@/types"

/** Lowercase, casual display labels (brand voice). Data keeps the canonical Category values. */
export const CATEGORY_LABEL: Record<Category, string> = {
  "Free food": "free food",
  Social: "social",
  "Making friends": "making friends",
  Culture: "cultural nights",
  Sport: "sports",
  "Team activities": "team stuff",
  "Music & nights out": "music & nights out",
  Hackathons: "hackathons",
  Careers: "careers",
  Wellbeing: "wellbeing",
}

export const GOAL_LABEL: Record<Goal, string> = {
  "Make friends": "make friends",
  "Build my CV": "build my cv",
  "Try new things": "try new things",
  "Free food": "free food",
}
