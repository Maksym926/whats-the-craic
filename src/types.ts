export const CATEGORIES = [
  "Free food",
  "Social",
  "Making friends",
  "Culture",
  "Sport",
  "Team activities",
  "Music & nights out",
  "Hackathons",
  "Careers",
  "Wellbeing",
] as const
export type Category = (typeof CATEGORIES)[number]

export const GOALS = ["Make friends", "Build my CV", "Try new things", "Free food"] as const
export type Goal = (typeof GOALS)[number]

// Text only, never logos.
export const COLLEGES = [
  "Trinity College Dublin",
  "University College Dublin",
  "Dublin City University",
  "TU Dublin",
  "Maynooth University",
  "RCSI",
  "NCAD",
  "IADT",
  "Griffith College",
  "Dublin Business School",
] as const

export const YEARS = ["1st year", "2nd year", "3rd year", "4th year", "Postgrad"] as const

export interface Event {
  id: string
  title: string
  organiser: string
  /** ISO date-time string */
  start: string
  location: string
  categories: Category[]
  /** Shown as text, e.g. "via Students' Union" */
  source: string
  sourceUrl: string
  /** May be empty; UI falls back to a category placeholder */
  imageUrl: string
  description: string
  goingCount: number
  /** Explanation of why it was recommended; set by the feed only */
  why?: string
}

export interface Profile {
  name: string
  college: string
  year: string
  interests: Category[]
  livesInAccommodation: boolean
  goal: Goal
  /** Required and unique: students log in with it (email-only login) */
  email: string
  /** Opt-in to event emails; off by default */
  emailNotifications: boolean
}

export interface Feedback {
  eventId: string
  went: boolean
  liked?: boolean
  reasons?: string[]
}
