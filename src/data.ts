export type PlacementStatus =
  | "draft"
  | "awaiting-employer"
  | "due-diligence"
  | "awaiting-student"
  | "ready-to-confirm"
  | "active"
  | "at-risk"
  | "completed"
  | "cancelled";

export interface Task {
  id: string;
  title: string;
  due: string;
  priority: "high" | "medium" | "low";
  done: boolean;
}

export interface PlacementOffer {
  id: string;
  contact: string;
  employer: string;
  time: string;
  status: PlacementStatus;
}

export interface EmployerLocation {
  id: string;
  name: string;
  address: string;
  placements: number;
  lastUpdated: string;
}

export interface Message {
  id: string;
  sender: string;
  subject: string;
  time: string;
  unread: boolean;
}

export interface Visit {
  id: string;
  student: string;
  employer: string;
  date: string;
  type: string;
}

export interface Placement {
  id: string;
  title: string;
  course: string;
  employer: string;
  students: number;
  startDate: string;
  endDate: string;
  status: PlacementStatus;
  coordinator: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  mobile: string;
  email: string;
  primary: boolean;
}

export interface Conversation {
  id: string;
  date: string;
  method: string;
  summary: string;
  coordinator: string;
  actions: string[];
  expanded?: boolean;
}

export interface Employer {
  id: string;
  name: string;
  address: string;
  phone: string;
  sicCode: string;
  legalStatus: string;
  employees: number;
  previousPlacement: boolean;
  currentApprentice: boolean;
  lpSupport: boolean;
  dueDiligenceStatus: "compliant" | "pending" | "action-required" | "expired";
  contacts: Contact[];
  conversations: Conversation[];
  activePlacements: number;
  completedPlacements: number;
}

export interface Student {
  id: string;
  name: string;
  course: string;
  group: string;
  tutor: string;
  email: string;
  phone: string;
  placementStatus: PlacementStatus;
  employer?: string;
  startDate?: string;
  endDate?: string;
}

// ── Tasks ────────────────────────────────────────────────────────────────────

export const tasks: Task[] = [
  { id: "t1", title: "Assess Topps Tiles employer due diligence", due: "Today", priority: "high", done: false },
  { id: "t2", title: "Create industry placement — Health & Social Care L3", due: "Today", priority: "high", done: false },
  { id: "t3", title: "Follow up with Nessie Nursery re supervisor details", due: "Tomorrow", priority: "medium", done: false },
  { id: "t4", title: "Create student project brief for Electrical L2", due: "12 Aug 2026", priority: "low", done: false },
  { id: "t5", title: "Staff meeting — placement team agenda", due: "14 Aug 2026", priority: "low", done: false },
  { id: "t6", title: "Assess computing skills — Group B verification", due: "15 Aug 2026", priority: "medium", done: false },
];

// ── Placement Offers ─────────────────────────────────────────────────────────

export const placementOffers: PlacementOffer[] = [
  { id: "po1", contact: "Briony Holgate", employer: "Smiths Electronics", time: "Today 11.43", status: "ready-to-confirm" },
  { id: "po2", contact: "Ian Wilson", employer: "Charlie's Pantry", time: "Yesterday 14.46", status: "awaiting-employer" },
  { id: "po3", contact: "Peter Westbrooke", employer: "Nessie Nursery", time: "11 Aug 2026 18.06", status: "due-diligence" },
  { id: "po4", contact: "Angelique Bumble", employer: "W H Smiths", time: "11 Aug 2026 10.01", status: "active" },
];

// ── Employer Locations ───────────────────────────────────────────────────────

export const employerLocations: EmployerLocation[] = [
  { id: "el1", name: "W H Smiths", address: "Talbot Road, Northbridge FY1 1NB", placements: 2, lastUpdated: "11 Aug 2026" },
  { id: "el2", name: "Nessie Nursery", address: "Stanley Park Road, Northbridge FY3 9DT", placements: 4, lastUpdated: "11 Aug 2026" },
  { id: "el3", name: "Smiths Electronics", address: "Belgrove House, Cray Avenue, Orpington BR5 3QS", placements: 8, lastUpdated: "09 Aug 2026" },
];

// ── Messages ─────────────────────────────────────────────────────────────────

export const messages: Message[] = [
  { id: "m1", sender: "David Hughes", subject: "Northbridge College Meet — re placement dates", time: "Today 11.43", unread: true },
  { id: "m2", sender: "Ian Wilson", subject: "Ian Wilson placement — query about hours", time: "Yesterday 14.46", unread: true },
  { id: "m3", sender: "Raj Patel", subject: "Coding and ethics — CPD follow-up", time: "11 Aug 2026 18.06", unread: false },
  { id: "m4", sender: "Sarah Collins", subject: "Mandy and Ben site visit — confirmed", time: "11 Aug 2026 10.01", unread: false },
  { id: "m5", sender: "Chamber of Commerce", subject: "Northbridge Business Conference 2026", time: "11 Aug 2026 08.32", unread: false },
];

// ── Visits ───────────────────────────────────────────────────────────────────

export const visits: Visit[] = [
  { id: "v1", student: "Maya Thompson", employer: "Nessie Nursery", date: "14 Aug 2026, 10:00", type: "Interim visit" },
  { id: "v2", student: "Jordan Ellis", employer: "Smiths Electronics", date: "15 Aug 2026, 14:00", type: "Initial visit" },
  { id: "v3", student: "Priya Sharma", employer: "Charlie's Pantry", date: "18 Aug 2026, 11:30", type: "Final review" },
];

// ── Placements ───────────────────────────────────────────────────────────────

export const placements: Placement[] = [
  { id: "pl1", title: "Health & Social Care — Block Placement", course: "Health and Social Care L3", employer: "Nessie Nursery", students: 4, startDate: "02 Sep 2026", endDate: "14 Nov 2026", status: "active", coordinator: "Sarah Ahmed" },
  { id: "pl2", title: "Childcare T-Level — Year 2 Placement", course: "Childcare T-Level (Year 2)", employer: "Little Stars Nursery", students: 6, startDate: "14 Sep 2026", endDate: "28 Feb 2027", status: "ready-to-confirm", coordinator: "Sarah Ahmed" },
  { id: "pl3", title: "Electrical Installation L2 — Work Experience", course: "Electrical Installation L2", employer: "Smiths Electronics", students: 3, startDate: "07 Oct 2026", endDate: "25 Oct 2026", status: "awaiting-employer", coordinator: "Sarah Ahmed" },
  { id: "pl4", title: "Catering & Hospitality — Front of House", course: "Hospitality & Catering L2", employer: "Charlie's Pantry", students: 2, startDate: "21 Sep 2026", endDate: "12 Oct 2026", status: "due-diligence", coordinator: "Sarah Ahmed" },
  { id: "pl5", title: "Health & Social Care — Adult Care Block", course: "Health and Social Care L3", employer: "Sunrise Care Home", students: 5, startDate: "05 Jan 2027", endDate: "16 Mar 2027", status: "draft", coordinator: "Sarah Ahmed" },
  { id: "pl6", title: "Retail — W H Smiths Experience", course: "Retail L2", employer: "W H Smiths", students: 2, startDate: "18 Aug 2026", endDate: "05 Sep 2026", status: "at-risk", coordinator: "Sarah Ahmed" },
];

// ── Employers ────────────────────────────────────────────────────────────────

export const employers: Employer[] = [
  {
    id: "e1",
    name: "Smiths Electronics",
    address: "Belgrove House Estate, Cray Avenue, Orpington, BR5 3QS",
    phone: "0845 322 4856",
    sicCode: "Electronics and Engineering",
    legalStatus: "Limited Company",
    employees: 48,
    previousPlacement: false,
    currentApprentice: true,
    lpSupport: false,
    dueDiligenceStatus: "compliant",
    activePlacements: 3,
    completedPlacements: 7,
    contacts: [
      { id: "c1", name: "David Hughes", role: "Operations Manager", phone: "01444 345 2786", mobile: "07749 345 2786", email: "david.hughes@smithselec.co.uk", primary: true },
      { id: "c2", name: "Elsie Harbinger", role: "General Manager", phone: "01444 345 2787", mobile: "07749 345 2787", email: "elsie@smithselec.co.uk", primary: false },
      { id: "c3", name: "Marcus Webb", role: "Health & Safety Officer", phone: "01444 345 2788", mobile: "07749 345 2788", email: "m.webb@smithselec.co.uk", primary: false },
    ],
    conversations: [
      { id: "cv1", date: "11 Aug 2026, 14:30", method: "Phone call", summary: "Discussed availability for October work-experience block. David confirmed three places for Electrical Installation L2 students. He requested timetables and learning objectives to be sent by 18 August.", coordinator: "Sarah Ahmed", actions: ["Send timetables and learning objectives by 18 Aug", "Confirm student names by 25 Aug"] },
      { id: "cv2", date: "22 Jul 2026, 10:15", method: "Site visit", summary: "Initial employer engagement visit. Toured workshop and storage facilities. Assessed suitability for Level 2 students. Risk assessment forms handed over. David introduced Marcus Webb as H&S lead.", coordinator: "Sarah Ahmed", actions: ["Return completed risk assessment form", "Provide employer liability insurance certificate"] },
    ],
  },
  {
    id: "e2",
    name: "Nessie Nursery",
    address: "Stanley Park Road, Northbridge, FY3 9DT",
    phone: "01253 556 230",
    sicCode: "Early Years Education",
    legalStatus: "Sole Trader",
    employees: 12,
    previousPlacement: true,
    currentApprentice: false,
    lpSupport: true,
    dueDiligenceStatus: "pending",
    activePlacements: 4,
    completedPlacements: 12,
    contacts: [
      { id: "c4", name: "Peter Westbrooke", role: "Nursery Manager", phone: "01253 556 230", mobile: "07891 234 567", email: "peter@nessienursery.co.uk", primary: true },
      { id: "c5", name: "Janine Okafor", role: "Deputy Manager", phone: "01253 556 231", mobile: "07891 234 568", email: "janine@nessienursery.co.uk", primary: false },
    ],
    conversations: [
      { id: "cv3", date: "10 Aug 2026, 11:00", method: "Email follow-up", summary: "Chased supervisor details for Health & Social Care block starting 2 Sep. Peter confirmed Janine Okafor will supervise. Enhanced DBS check for new supervisor still outstanding.", coordinator: "Sarah Ahmed", actions: ["Confirm Janine Okafor DBS status by 20 Aug"] },
    ],
  },
  {
    id: "e3",
    name: "Charlie's Pantry",
    address: "21 Church Street, Northbridge, FY1 1HU",
    phone: "01253 621 050",
    sicCode: "Food & Beverage Service",
    legalStatus: "Limited Company",
    employees: 22,
    previousPlacement: true,
    currentApprentice: true,
    lpSupport: false,
    dueDiligenceStatus: "action-required",
    activePlacements: 2,
    completedPlacements: 5,
    contacts: [
      { id: "c6", name: "Ian Wilson", role: "General Manager", phone: "01253 621 050", mobile: "07700 900 012", email: "ian@charliespantry.co.uk", primary: true },
    ],
    conversations: [],
  },
  {
    id: "e4",
    name: "W H Smiths — Northbridge",
    address: "44 Bank Hey Street, Northbridge, FY1 4RU",
    phone: "01253 294 000",
    sicCode: "Retail",
    legalStatus: "PLC",
    employees: 34,
    previousPlacement: true,
    currentApprentice: false,
    lpSupport: false,
    dueDiligenceStatus: "expired",
    activePlacements: 2,
    completedPlacements: 9,
    contacts: [
      { id: "c7", name: "Angelique Bumble", role: "Store Manager", phone: "01253 294 001", mobile: "07700 900 034", email: "a.bumble@whsmith.co.uk", primary: true },
    ],
    conversations: [],
  },
  {
    id: "e5",
    name: "Sunrise Care Home",
    address: "Westcliffe Drive, Northbridge, FY3 7PX",
    phone: "01253 398 456",
    sicCode: "Adult Social Care",
    legalStatus: "Limited Company",
    employees: 65,
    previousPlacement: false,
    currentApprentice: false,
    lpSupport: true,
    dueDiligenceStatus: "compliant",
    activePlacements: 0,
    completedPlacements: 0,
    contacts: [
      { id: "c8", name: "Fatima Al-Rashid", role: "Placement Coordinator", phone: "01253 398 457", mobile: "07800 900 123", email: "f.alrashid@sunrisecare.co.uk", primary: true },
    ],
    conversations: [],
  },
];

// ── Students ─────────────────────────────────────────────────────────────────

export const students: Student[] = [
  { id: "s1", name: "Maya Thompson", course: "Health and Social Care L3", group: "Group A", tutor: "Mrs J. Pearce", email: "m.thompson@student.northbridgecollege.example", phone: "07700 900 100", placementStatus: "active", employer: "Nessie Nursery", startDate: "02 Sep 2026", endDate: "14 Nov 2026" },
  { id: "s2", name: "Jordan Ellis", course: "Electrical Installation L2", group: "Group B", tutor: "Mr D. Chandra", email: "j.ellis@student.northbridgecollege.example", phone: "07700 900 101", placementStatus: "awaiting-employer", employer: "Smiths Electronics" },
  { id: "s3", name: "Priya Sharma", course: "Hospitality & Catering L2", group: "Group A", tutor: "Mrs K. Booth", email: "p.sharma@student.northbridgecollege.example", phone: "07700 900 102", placementStatus: "active", employer: "Charlie's Pantry", startDate: "21 Sep 2026", endDate: "12 Oct 2026" },
  { id: "s4", name: "Lee Fitzpatrick", course: "Health and Social Care L3", group: "Group A", tutor: "Mrs J. Pearce", email: "l.fitzpatrick@student.northbridgecollege.example", phone: "07700 900 103", placementStatus: "at-risk", employer: "Sunrise Care Home" },
  { id: "s5", name: "Aisha Rahman", course: "Childcare T-Level (Year 2)", group: "Group C", tutor: "Miss P. Gallagher", email: "a.rahman@student.northbridgecollege.example", phone: "07700 900 104", placementStatus: "ready-to-confirm", employer: "Little Stars Nursery" },
];

// ── Courses ──────────────────────────────────────────────────────────────────

export const courses = [
  "Health and Social Care L3",
  "Childcare T-Level (Year 2)",
  "Childcare T-Level (Year 1)",
  "Electrical Installation L2",
  "Hospitality & Catering L2",
  "Retail L2",
  "Business Administration L3",
  "Computing & IT L3",
];

export const learningObjectiveTypes = [
  "Knowledge — Understanding care principles",
  "Knowledge — Safeguarding and legislation",
  "Skills — Communication and professional behaviour",
  "Skills — Practical care and support tasks",
  "Behaviour — Professionalism and reliability",
  "Behaviour — Teamwork and collaboration",
];
