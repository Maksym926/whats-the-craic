import type { Event } from "@/types"

/** Local time `days` from today at hh:mm, as an ISO string, so the demo never goes stale. */
function at(days: number, hour: number, minute = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

/** Mock mode: a new student starts as "going" to these past events, so the 👍/👎 check-in shows up in demos. */
export const DEMO_GOING = ["evt-coffee-mixer"]

const SU = "Students' Union"
const SOCS = "Societies portal"
const COLLEGE = "College website"

export const MOCK_EVENTS: Event[] = [
  {
    id: "evt-pizza-games",
    title: "Free Pizza & Board Games Night",
    organiser: "Games Society",
    start: at(0, 18),
    location: "Students' Union, Room 2",
    categories: ["Free food", "Social", "Making friends"],
    source: SU,
    sourceUrl: "https://example.com/su/pizza-games",
    imageUrl: "",
    description:
      "Grab a slice and a seat. Catan, Codenames and a stack of party games. Come solo, we'll find you a table. Veggie and vegan pizza available.",
    goingCount: 42,
  },
  {
    id: "evt-trad-session",
    title: "Trad Session at the Student Bar",
    organiser: "Traditional Music Society",
    start: at(0, 21),
    location: "Student Bar",
    categories: ["Music & nights out", "Culture"],
    source: SOCS,
    sourceUrl: "https://example.com/socs/trad",
    imageUrl: "",
    description:
      "Bring an instrument or just bring yourself. Open session from 9pm, all levels welcome, and no one will make you sing (unless you want to).",
    goingCount: 31,
  },
  {
    id: "evt-pancakes",
    title: "Pancake Breakfast in Halls",
    organiser: "Residences Committee",
    start: at(1, 9, 30),
    location: "Halls Common Room",
    categories: ["Free food", "Making friends", "Social"],
    source: SU,
    sourceUrl: "https://example.com/su/pancakes",
    imageUrl: "",
    description:
      "Free pancakes, toppings bar and tea/coffee for anyone living in campus accommodation. A good chance to meet your neighbours.",
    goingCount: 57,
  },
  {
    id: "evt-five-a-side",
    title: "5-a-side Football Drop-in",
    organiser: "Soccer Club",
    start: at(1, 17),
    location: "Sports Centre, Pitch 3",
    categories: ["Sport", "Team activities", "Making friends"],
    source: SOCS,
    sourceUrl: "https://example.com/socs/football",
    imageUrl: "",
    description:
      "Casual mixed games, no tryouts, no commitment. Teams picked on the night. Bring runners and water; bibs provided.",
    goingCount: 18,
  },
  {
    id: "evt-ceili",
    title: "Freshers' Céilí",
    organiser: "Irish Language Society",
    start: at(2, 19, 30),
    location: "Exam Hall",
    categories: ["Culture", "Music & nights out", "Social"],
    source: SOCS,
    sourceUrl: "https://example.com/socs/ceili",
    imageUrl: "",
    description:
      "Never danced a céilí? Perfect. Callers walk you through every set. Live band, and the Siege of Ennis is guaranteed chaos.",
    goingCount: 96,
  },
  {
    id: "evt-cv-clinic",
    title: "CV Clinic with Graduate Recruiters",
    organiser: "Careers Service",
    start: at(2, 13),
    location: "Library, Seminar Room B",
    categories: ["Careers"],
    source: COLLEGE,
    sourceUrl: "https://example.com/careers/cv-clinic",
    imageUrl: "",
    description:
      "Bring a printed or digital CV for 1:1 feedback from recruiters. 15-minute slots, first come, first served.",
    goingCount: 23,
  },
  {
    id: "evt-yoga",
    title: "Mindful Yoga for Beginners",
    organiser: "SU Welfare",
    start: at(3, 12, 30),
    location: "Sports Centre, Studio 1",
    categories: ["Wellbeing", "Sport"],
    source: SU,
    sourceUrl: "https://example.com/su/yoga",
    imageUrl: "",
    description:
      "45 minutes of gentle yoga to reset mid-week. Mats provided, no experience needed.",
    goingCount: 27,
  },
  {
    id: "evt-food-fair",
    title: "International Food Fair",
    organiser: "International Students Society",
    start: at(4, 13),
    location: "Main Concourse",
    categories: ["Free food", "Culture", "Making friends"],
    source: SOCS,
    sourceUrl: "https://example.com/socs/food-fair",
    imageUrl: "",
    description:
      "Students from 30+ countries cook a dish from home. Free tasting plates while they last, so arrive early.",
    goingCount: 140,
  },
  {
    id: "evt-careers-fair",
    title: "Tech & Engineering Careers Fair",
    organiser: "Careers Service",
    start: at(5, 11),
    location: "Sports Hall",
    categories: ["Careers", "Free food"],
    source: COLLEGE,
    sourceUrl: "https://example.com/careers/fair",
    imageUrl: "",
    description:
      "40+ employers hiring for internships and graduate roles. Free coffee and pastries at the entrance.",
    goingCount: 210,
  },
  {
    id: "evt-sea-swim",
    title: "Sunrise Sea Swim",
    organiser: "Swimming Club",
    start: at(6, 7),
    location: "Forty Foot, Sandycove",
    categories: ["Sport", "Wellbeing", "Making friends"],
    source: SOCS,
    sourceUrl: "https://example.com/socs/sea-swim",
    imageUrl: "",
    description:
      "A short, supervised dip followed by hot chocolate. Lifeguard on site. Strong swimmers not required, just a bit of courage.",
    goingCount: 14,
  },
  {
    id: "evt-comedy",
    title: "Stand-up Comedy Night",
    organiser: "Comedy Society",
    start: at(7, 20),
    location: "Student Theatre",
    categories: ["Music & nights out", "Social"],
    source: SOCS,
    sourceUrl: "https://example.com/socs/comedy",
    imageUrl: "",
    description:
      "Student comics plus a headline act. Open-mic spots available, so sign up at the door.",
    goingCount: 65,
  },
  {
    id: "evt-hackathon",
    title: "Hack the Liffey: 24h Hackathon",
    organiser: "Computer Science Society",
    start: at(8, 10),
    location: "Engineering Building",
    categories: ["Hackathons", "Team activities", "Careers", "Free food"],
    source: SOCS,
    sourceUrl: "https://example.com/socs/hackathon",
    imageUrl: "",
    description:
      "Build something for Dublin in 24 hours. Teams of 2–4 (or join one on the day). All meals and snacks provided, plus prizes and sponsor mentors.",
    goingCount: 88,
  },
  // Past events: used to demo the post-event 👍/👎 check-in.
  {
    id: "evt-coffee-mixer",
    title: "Coffee & Chats Mixer",
    organiser: "SU Welfare",
    start: at(-1, 15),
    location: "Students' Union Café",
    categories: ["Making friends", "Social", "Free food"],
    source: SU,
    sourceUrl: "https://example.com/su/coffee",
    imageUrl: "",
    description: "Free coffee and conversation-starter cards. Low-key way to meet people.",
    goingCount: 38,
  },
  {
    id: "evt-climbing",
    title: "Climbing Taster Session",
    organiser: "Mountaineering Club",
    start: at(-2, 18),
    location: "Sports Centre, Climbing Wall",
    categories: ["Sport", "Team activities"],
    source: SOCS,
    sourceUrl: "https://example.com/socs/climbing",
    imageUrl: "",
    description: "Harnesses and shoes provided. Instructors on the wall the whole session.",
    goingCount: 22,
  },
]
