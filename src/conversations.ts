import type { Screen } from "./components/Sidebar";

export interface ChatMessage {
  id: string;
  sender: string;
  senderInitials: string;
  isOwn: boolean;
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  relatedPlacement?: string;
  lastMessage: string;
  lastTime: string;
  unread: boolean;
  messages: ChatMessage[];
}

export interface AppNotification {
  id: string;
  type: "message" | "task" | "placement" | "document" | "visit";
  title: string;
  body: string;
  time: string;
  read: boolean;
  targetScreen?: Screen;
}

// ── Initial conversations ─────────────────────────────────────────────────

export const initialConversations: Conversation[] = [
  {
    id: "conv1",
    participants: ["David Hughes", "Sarah Ahmed"],
    relatedPlacement: "Electrical Installation L2 — Work Experience",
    lastMessage: "That works for us. I'll confirm the supervisor by end of week.",
    lastTime: "Today 11.43",
    unread: true,
    messages: [
      {
        id: "msg1",
        sender: "Sarah Ahmed",
        senderInitials: "SA",
        isOwn: false,
        text: "Hi David, following up on the October work-experience block for our Electrical Installation L2 students. Are the three places still available from 7–25 October?",
        time: "Today 10.15",
      },
      {
        id: "msg2",
        sender: "David Hughes",
        senderInitials: "DH",
        isOwn: true,
        text: "Hi Sarah, yes the three places are still available. We'll need the timetables and learning objectives before we can confirm the supervisor.",
        time: "Today 10.52",
      },
      {
        id: "msg3",
        sender: "Sarah Ahmed",
        senderInitials: "SA",
        isOwn: false,
        text: "I'll send those over by 18 August. Can you also confirm which department the students will be based in?",
        time: "Today 11.10",
      },
      {
        id: "msg4",
        sender: "David Hughes",
        senderInitials: "DH",
        isOwn: true,
        text: "That works for us. I'll confirm the supervisor by end of week.",
        time: "Today 11.43",
      },
    ],
  },
  {
    id: "conv2",
    participants: ["Ian Wilson", "Sarah Ahmed"],
    relatedPlacement: "Catering & Hospitality — Front of House",
    lastMessage: "Could we move the start date to 28 September? The kitchen refurb runs until then.",
    lastTime: "Yesterday 14.46",
    unread: true,
    messages: [
      {
        id: "msg5",
        sender: "Ian Wilson",
        senderInitials: "IW",
        isOwn: false,
        text: "Hi Sarah — just had a look at the placement dates. Could we move the start date to 28 September? The kitchen refurb runs until then.",
        time: "Yesterday 14.46",
      },
    ],
  },
  {
    id: "conv3",
    participants: ["Mrs J. Pearce", "Sarah Ahmed"],
    relatedPlacement: "Health & Social Care — Block Placement",
    lastMessage: "Maya has completed her health declaration. Just the safeguarding module outstanding.",
    lastTime: "11 Aug 2026 18.06",
    unread: false,
    messages: [
      {
        id: "msg6",
        sender: "Mrs J. Pearce",
        senderInitials: "JP",
        isOwn: false,
        text: "Sarah — just to let you know Maya has completed her health declaration. Just the safeguarding module outstanding before her placement begins.",
        time: "11 Aug 2026 18.06",
      },
    ],
  },
  {
    id: "conv4",
    participants: ["Sarah Ahmed", "Mandy Collins"],
    relatedPlacement: "Health & Social Care — Block Placement",
    lastMessage: "Visit confirmed for 14 August at 10:00. I'll send the observation form beforehand.",
    lastTime: "11 Aug 2026 10.01",
    unread: false,
    messages: [
      {
        id: "msg7",
        sender: "Sarah Ahmed",
        senderInitials: "SA",
        isOwn: true,
        text: "Can we confirm the interim visit for Maya Thompson at Nessie Nursery on 14 August?",
        time: "10 Aug 2026 14.30",
      },
      {
        id: "msg8",
        sender: "Mandy Collins",
        senderInitials: "MC",
        isOwn: false,
        text: "Visit confirmed for 14 August at 10:00. I'll send the observation form beforehand.",
        time: "11 Aug 2026 10.01",
      },
    ],
  },
];

// Employer-specific conversations (David's inbox)
export const employerConversations: Conversation[] = [
  {
    id: "econv1",
    participants: ["Sarah Ahmed", "David Hughes"],
    relatedPlacement: "Electrical Installation L2 — Work Experience",
    lastMessage: "That works for us. I'll confirm the supervisor by end of week.",
    lastTime: "Today 11.43",
    unread: true,
    messages: initialConversations[0].messages.map((m) => ({
      ...m,
      isOwn: m.sender === "David Hughes",
    })),
  },
  {
    id: "econv2",
    participants: ["Sarah Ahmed", "David Hughes"],
    relatedPlacement: "Risk Assessment",
    lastMessage: "The risk assessment form is attached. Please review and sign.",
    lastTime: "Yesterday 09.15",
    unread: false,
    messages: [
      {
        id: "emsg1",
        sender: "Sarah Ahmed",
        senderInitials: "SA",
        isOwn: false,
        text: "David, the risk assessment form is attached for the October placement. Please review, sign and return by 25 August.",
        time: "Yesterday 09.15",
      },
    ],
  },
];

// Student conversations (Maya's inbox)
export const studentConversations: Conversation[] = [
  {
    id: "sconv1",
    participants: ["Sarah Ahmed", "Maya Thompson"],
    relatedPlacement: "Health & Social Care — Block Placement",
    lastMessage: "Your placement at Nessie Nursery starts 2 Sep. Let me know if you have any questions.",
    lastTime: "Today 09.15",
    unread: true,
    messages: [
      {
        id: "smsg1",
        sender: "Sarah Ahmed",
        senderInitials: "SA",
        isOwn: false,
        text: "Hi Maya — your placement at Nessie Nursery is confirmed to start on 2 September. Your supervisor will be Janine Okafor. Let me know if you have any questions before then.",
        time: "Today 09.15",
      },
    ],
  },
  {
    id: "sconv2",
    participants: ["Mrs J. Pearce", "Maya Thompson"],
    relatedPlacement: "Health & Social Care — Block Placement",
    lastMessage: "Don't forget to complete your safeguarding module before placement begins.",
    lastTime: "Yesterday",
    unread: false,
    messages: [
      {
        id: "smsg2",
        sender: "Mrs J. Pearce",
        senderInitials: "JP",
        isOwn: false,
        text: "Hi Maya — just a reminder to complete your online safeguarding module before your placement begins. It only takes about 45 minutes. Let me know if you have any problems accessing it.",
        time: "Yesterday 15.30",
      },
    ],
  },
];

// ── Initial notifications ─────────────────────────────────────────────────

export const initialNotifications: AppNotification[] = [
  {
    id: "n1",
    type: "message",
    title: "New message from David Hughes",
    body: "That works for us. I'll confirm the supervisor by end of week.",
    time: "Today 11.43",
    read: false,
    targetScreen: "messages",
  },
  {
    id: "n2",
    type: "placement",
    title: "Placement request awaiting response",
    body: "Smiths Electronics — Electrical Installation L2 block has not been responded to.",
    time: "Today 09.00",
    read: false,
    targetScreen: "placements",
  },
  {
    id: "n3",
    type: "task",
    title: "Task overdue",
    body: "Assess Topps Tiles employer due diligence was due today.",
    time: "Today 08.00",
    read: false,
    targetScreen: "tasks",
  },
  {
    id: "n4",
    type: "visit",
    title: "Upcoming visit in 3 days",
    body: "Interim visit — Maya Thompson at Nessie Nursery, 14 Aug at 10:00.",
    time: "Yesterday",
    read: false,
    targetScreen: "visits",
  },
  {
    id: "n5",
    type: "document",
    title: "Document required",
    body: "Enhanced DBS check for Janine Okafor at Nessie Nursery is outstanding.",
    time: "11 Aug 2026",
    read: true,
    targetScreen: "employer-detail",
  },
];

// Employer notifications
export const employerNotifications: AppNotification[] = [
  {
    id: "en1",
    type: "placement",
    title: "New placement request",
    body: "Northbridge College — Electrical Installation L2, 7–25 October 2026.",
    time: "Today 09.00",
    read: false,
    targetScreen: "emp-requests",
  },
  {
    id: "en2",
    type: "document",
    title: "Document reminder",
    body: "Enhanced DBS check for Marcus Webb is still outstanding.",
    time: "Yesterday",
    read: false,
    targetScreen: "emp-documents",
  },
  {
    id: "en3",
    type: "message",
    title: "Message from Sarah Ahmed",
    body: "I'll send the timetables and learning objectives by 18 August.",
    time: "Today 11.10",
    read: false,
    targetScreen: "emp-messages",
  },
];

// Student notifications
export const studentNotifications: AppNotification[] = [
  {
    id: "sn1",
    type: "task",
    title: "Required task outstanding",
    body: "Please complete your safeguarding awareness module before 2 September.",
    time: "Today",
    read: false,
    targetScreen: "stu-tasks",
  },
  {
    id: "sn2",
    type: "message",
    title: "Message from Sarah Ahmed",
    body: "Your placement at Nessie Nursery starts 2 Sep.",
    time: "Today 09.15",
    read: false,
    targetScreen: "stu-messages",
  },
  {
    id: "sn3",
    type: "placement",
    title: "Placement confirmed",
    body: "Your placement at Nessie Nursery is confirmed. Start date: 2 September 2026.",
    time: "Yesterday",
    read: true,
    targetScreen: "stu-placement",
  },
];
