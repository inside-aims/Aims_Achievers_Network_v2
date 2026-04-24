import {
  Ticket,
  TicketType,
  EventTicketInfo,
  ScanResult,
} from "./index";

// Helper to generate ticket codes
function makeCode(prefix: string, index: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${code}${index}`;
}

// TICKET TYPES PER EVENT
export const FAST_TICKET_TYPES: TicketType[] = [
  {
    id: "fast-general",
    name: "General Admission",
    description: "Standard entry to the awards ceremony with seating",
    pricePesewas: 2000, // GHS 20.00
    quantityTotal: 500,
    quantitySold: 342,
    salesStartAt: "2026-03-01",
    salesEndAt: "2026-06-14",
  },
  {
    id: "fast-vip",
    name: "VIP",
    description: "Front row seating, complimentary drinks, and backstage access",
    pricePesewas: 5000,
    quantityTotal: 100,
    quantitySold: 87,
    salesStartAt: "2026-03-01",
    salesEndAt: "2026-06-14",
  },
  {
    id: "fast-early",
    name: "Early Bird",
    description: "Discounted general admission for early purchasers",
    pricePesewas: 1500,
    quantityTotal: 200,
    quantitySold: 200,
    salesStartAt: "2026-02-01",
    salesEndAt: "2026-02-28",
  },
];

export const FBNE_TICKET_TYPES: TicketType[] = [
  {
    id: "fbne-general",
    name: "Standard Pass",
    description: "General admission to the innovation awards",
    pricePesewas: 1500,
    quantityTotal: 300,
    quantitySold: 128,
    salesStartAt: "2026-04-01",
    salesEndAt: "2026-12-15",
  },
  {
    id: "fbne-premium",
    name: "Premium Pass",
    description: "Reserved seating with dinner and networking reception",
    pricePesewas: 8000,
    quantityTotal: 50,
    quantitySold: 31,
    salesStartAt: "2026-04-01",
    salesEndAt: "2026-12-15",
  },
];

// EVENT TICKET INFO (used by ticket purchase section)
export const EVENT_TICKET_INFO: Record<string, EventTicketInfo> = {
  "fast-awards-2025": {
    eventId: "fast-awards-2025",
    eventTitle: "FAST Excellence Awards 2025",
    eventDate: "2026-06-15",
    eventTime: "7:00 PM",
    venue: "Great Hall, UENR Campus",
    themeId: "royal-night",
    ticketTypes: FAST_TICKET_TYPES,
  },
  "fbne-awards-2025": {
    eventId: "fbne-awards-2025",
    eventTitle: "FBNE Innovation Awards 2025",
    eventDate: "2026-12-16",
    eventTime: "6:30 PM",
    venue: "Multi Purpose Hall, UENR Campus",
    themeId: "campus-vibes",
    ticketTypes: FBNE_TICKET_TYPES,
  },
};

// SCAN ACCESS CODES (one per event — given to organizer staff at entrance)
export const SCAN_ACCESS_CODES: Record<string, string> = {
  "fast-awards-2025": "FAST-SCAN-2025",
  "fbne-awards-2025": "FBNE-SCAN-2025",
};

// Returns true if the provided code matches the event's scan access code (case-insensitive)
export function verifyScanAccess(eventId: string, code: string): boolean {
  const expected = SCAN_ACCESS_CODES[eventId];
  if (!expected) return false;
  return expected.toLowerCase() === code.trim().toLowerCase();
}

// Verifies a ticket code against the event's ticket pool.
// usedCodes tracks codes already verified as "success" in the current scan session.
export function verifyTicketCode(
  eventId: string,
  code: string,
  usedCodes: Set<string>
): ScanResult {
  const now = new Date().toISOString();
  const ticket = SAMPLE_TICKETS.find(
    (t) => t.ticketCode.toLowerCase() === code.trim().toLowerCase()
  );

  if (!ticket) {
    return {
      type: "invalid",
      ticket: null,
      message: "No ticket found for this code. Please check and try again.",
      scannedAt: now,
    };
  }

  if (ticket.eventId !== eventId) {
    return {
      type: "invalid",
      ticket: null,
      message: "This ticket does not belong to this event.",
      scannedAt: now,
    };
  }

  if (ticket.status === "cancelled") {
    return {
      type: "cancelled",
      ticket,
      message: "This ticket has been cancelled and is no longer valid.",
      scannedAt: now,
    };
  }

  if (ticket.status === "used" || usedCodes.has(ticket.ticketCode)) {
    return {
      type: "already_used",
      ticket,
      message: "This ticket has already been scanned. If re-entry is needed, generate a new QR code.",
      scannedAt: now,
    };
  }

  return {
    type: "success",
    ticket,
    message: "Ticket verified successfully. Welcome!",
    scannedAt: now,
  };
}

// ============================================================
// SAMPLE TICKETS (for lookup pages)
// ============================================================

export const SAMPLE_TICKETS: Ticket[] = [
  {
    id: "tkt-001",
    eventId: "fast-awards-2025",
    eventTitle: "FAST Excellence Awards 2025",
    eventDate: "2026-06-15",
    eventTime: "7:00 PM",
    venue: "Great Hall, UENR Campus",
    orderId: "ord-001",
    ticketTypeName: "VIP",
    ticketCode: makeCode("FAST", 1),
    holderName: "Kwame Mensah",
    holderEmail: "kwame.mensah@email.com",
    holderPhone: "0551234567",
    status: "valid",
    themeId: "royal-night",
    createdAt: "2026-04-10T14:30:00Z",
  },
  {
    id: "tkt-002",
    eventId: "fast-awards-2025",
    eventTitle: "FAST Excellence Awards 2025",
    eventDate: "2026-06-15",
    eventTime: "7:00 PM",
    venue: "Great Hall, UENR Campus",
    orderId: "ord-001",
    ticketTypeName: "VIP",
    ticketCode: makeCode("FAST", 2),
    holderName: "Abena Osei",
    holderEmail: "kwame.mensah@email.com",
    holderPhone: "0551234567",
    status: "valid",
    themeId: "royal-night",
    createdAt: "2026-04-10T14:30:00Z",
  },
  {
    id: "tkt-003",
    eventId: "fast-awards-2025",
    eventTitle: "FAST Excellence Awards 2025",
    eventDate: "2026-06-15",
    eventTime: "7:00 PM",
    venue: "Great Hall, UENR Campus",
    orderId: "ord-002",
    ticketTypeName: "General Admission",
    ticketCode: makeCode("FAST", 3),
    holderName: "Daniel Adjei",
    holderEmail: "daniel.adjei@email.com",
    holderPhone: "0247890123",
    status: "used",
    usedAt: "2026-06-15T18:45:00Z",
    themeId: "royal-night",
    createdAt: "2026-04-05T09:15:00Z",
    previousCodes: ["FAST-OLD001"],
  },
  {
    id: "tkt-004",
    eventId: "fbne-awards-2025",
    eventTitle: "FBNE Innovation Awards 2025",
    eventDate: "2026-12-16",
    eventTime: "6:30 PM",
    venue: "Multi Purpose Hall, UENR Campus",
    orderId: "ord-003",
    ticketTypeName: "Premium Pass",
    ticketCode: makeCode("FBNE", 4),
    holderName: "Grace Boateng",
    holderEmail: "grace.boateng@email.com",
    holderPhone: "0201234567",
    status: "valid",
    themeId: "campus-vibes",
    createdAt: "2026-04-12T11:00:00Z",
  },
  {
    id: "tkt-005",
    eventId: "fbne-awards-2025",
    eventTitle: "FBNE Innovation Awards 2025",
    eventDate: "2026-12-16",
    eventTime: "6:30 PM",
    venue: "Multi Purpose Hall, UENR Campus",
    orderId: "ord-004",
    ticketTypeName: "Standard Pass",
    ticketCode: makeCode("FBNE", 5),
    holderName: "Emmanuel Asante",
    holderEmail: "emmanuel.asante@email.com",
    status: "cancelled",
    themeId: "campus-vibes",
    createdAt: "2026-04-08T16:20:00Z",
  },
  // Fixed-code demo tickets for manual entry testing on the scan page
  {
    id: "tkt-demo-01",
    eventId: "fast-awards-2025",
    eventTitle: "FAST Excellence Awards 2025",
    eventDate: "2026-06-15",
    eventTime: "7:00 PM",
    venue: "Great Hall, UENR Campus",
    orderId: "ord-demo",
    ticketTypeName: "General Admission",
    ticketCode: "FAST-DEMO01",
    holderName: "Ama Serwaa",
    holderEmail: "ama.serwaa@email.com",
    holderPhone: "0244001122",
    status: "valid",
    themeId: "royal-night",
    createdAt: "2026-04-20T10:00:00Z",
  },
  {
    id: "tkt-demo-02",
    eventId: "fast-awards-2025",
    eventTitle: "FAST Excellence Awards 2025",
    eventDate: "2026-06-15",
    eventTime: "7:00 PM",
    venue: "Great Hall, UENR Campus",
    orderId: "ord-demo",
    ticketTypeName: "VIP",
    ticketCode: "FAST-DEMO02",
    holderName: "Kofi Boateng",
    holderEmail: "kofi.boateng@email.com",
    holderPhone: "0277334455",
    status: "used",
    usedAt: "2026-06-15T18:20:00Z",
    themeId: "royal-night",
    createdAt: "2026-04-20T10:05:00Z",
  },
  {
    id: "tkt-demo-03",
    eventId: "fbne-awards-2025",
    eventTitle: "FBNE Innovation Awards 2025",
    eventDate: "2026-12-16",
    eventTime: "6:30 PM",
    venue: "Multi Purpose Hall, UENR Campus",
    orderId: "ord-demo-fbne",
    ticketTypeName: "Premium Pass",
    ticketCode: "FBNE-DEMO01",
    holderName: "Nana Yaa Asante",
    holderEmail: "nana.asante@email.com",
    holderPhone: "0209887766",
    status: "valid",
    themeId: "campus-vibes",
    createdAt: "2026-04-21T09:30:00Z",
  },
];

// ============================================================
// SAMPLE SCAN RESULTS (for scanner UI demos)
// ============================================================

export const SAMPLE_SCAN_RESULTS: ScanResult[] = [
  {
    type: "success",
    ticket: SAMPLE_TICKETS[0],
    message: "Ticket verified successfully. Welcome!",
    scannedAt: "2026-06-15T18:30:00Z",
  },
  {
    type: "already_used",
    ticket: SAMPLE_TICKETS[2],
    message: "This ticket has already been scanned. If re-entry is needed, generate a new QR code.",
    scannedAt: "2026-06-15T19:15:00Z",
  },
  {
    type: "invalid",
    ticket: null,
    message: "No ticket found for this code. Please check and try again.",
    scannedAt: "2026-06-15T19:20:00Z",
  },
  {
    type: "cancelled",
    ticket: SAMPLE_TICKETS[4],
    message: "This ticket has been cancelled and is no longer valid.",
    scannedAt: "2026-06-15T19:25:00Z",
  },
];

// ============================================================
// LOOKUP HELPERS (simulate backend queries)
// ============================================================

export function lookupByEmail(email: string): Ticket[] {
  return SAMPLE_TICKETS.filter(
    (t) => t.holderEmail.toLowerCase() === email.toLowerCase()
  );
}

export function lookupByPhone(phone: string): Ticket[] {
  return SAMPLE_TICKETS.filter((t) => t.holderPhone === phone);
}

export function lookupByCode(code: string): Ticket | undefined {
  return SAMPLE_TICKETS.find(
    (t) => t.ticketCode.toLowerCase() === code.toLowerCase()
  );
}

export function getEventTicketInfo(eventId: string): EventTicketInfo | undefined {
  return EVENT_TICKET_INFO[eventId];
}

// Check if an event has ticketing enabled (for UI conditionals)
export function isTicketingEnabled(eventId: string): boolean {
  return eventId in EVENT_TICKET_INFO;
}
